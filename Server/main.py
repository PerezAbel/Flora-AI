"""
Simple FastAPI inference server for Flora app.

Endpoints expected by the Expo frontend:
  POST /predict/plant
  POST /predict/animal

Request: multipart/form-data
  - model: string (e.g., "plant" or "animal")
  - file: image/jpeg (optional; required for real inference)

Response JSON:
  {
    "label": "string",
    "confidence": number,   # 0-1 or 0-100 both accepted by the app
    "description": "string",  # optional
    "risk": "High"|"Medium"|"Low",  # optional
    "recommendation": "string"      # optional
  }
"""

from __future__ import annotations

import io
import os
import json
import secrets
from typing import Tuple

import torch
from fastapi import FastAPI, File, Form, UploadFile, Header, HTTPException, Depends
from PIL import Image
from torch import nn

# ---- Config -----------------------------------------------------------------
# Update these paths to your actual TorchScript/pt weights.
PLANT_WEIGHTS = os.environ.get("PLANT_WEIGHTS", "Models/plant_model.pt")
ANIMAL_WEIGHTS = os.environ.get("ANIMAL_WEIGHTS", "Models/animal_model.pt")
ANIMAL_META = os.environ.get(
    "ANIMAL_META", "Models/Models-20260401T123751Z-1-001/Models/cattle_meta.json"
)

# If your models need a specific image size, set it here (w, h). None => keep original.
TARGET_SIZE = (224, 224)

# Default normalization (ImageNet). Will override from meta if available.
DEFAULT_MEAN = (0.485, 0.456, 0.406)
DEFAULT_STD = (0.229, 0.224, 0.225)

# -----------------------------------------------------------------------------#

app = FastAPI(title="Flora Inference API", version="0.1.0")


# Internal service: browser clients use Django, not this endpoint.
def authenticate(authorization: str = Header(default="")):
    token = os.environ.get("INFERENCE_TOKEN", "")
    if not token:
        raise HTTPException(
            status_code=503, detail="Inference authentication is not configured"
        )
    if not secrets.compare_digest(authorization, f"Bearer {token}"):
        raise HTTPException(status_code=401, detail="Unauthorized")


def load_model(path: str) -> nn.Module | None:
    if not os.path.exists(path):
        print(f"[warn] model weights not found: {path}")
        return None
    try:
        model = torch.jit.load(path, map_location="cpu")
        model.eval()
        print(f"[info] loaded model: {path}")
        return model
    except Exception as exc:  # pragma: no cover - defensive
        print(f"[error] failed to load model {path}: {exc}")
        return None


plant_model = load_model(PLANT_WEIGHTS)
animal_model = load_model(ANIMAL_WEIGHTS)


def load_animal_meta(path: str):
    try:
        with open(path, "r", encoding="utf-8") as f:
            meta = json.load(f)
        mean = tuple(meta.get("mean", DEFAULT_MEAN))
        std = tuple(meta.get("std", DEFAULT_STD))
        classes = meta.get("classes")
        return {"mean": mean, "std": std, "classes": classes}
    except Exception:
        return {"mean": DEFAULT_MEAN, "std": DEFAULT_STD, "classes": None}


animal_meta = load_animal_meta(ANIMAL_META)
plant_meta = load_animal_meta(os.environ.get("PLANT_META", "Models/plant_meta.json"))


def preprocess(image_bytes: bytes, mean=DEFAULT_MEAN, std=DEFAULT_STD) -> torch.Tensor:
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    if TARGET_SIZE:
        img = img.resize(TARGET_SIZE)
    tensor = torch.tensor(list(img.getdata()), dtype=torch.float32).view(
        img.height, img.width, 3
    )
    tensor = tensor.permute(2, 0, 1) / 255.0
    if mean and std:
        mean_t = torch.tensor(mean, dtype=torch.float32).view(3, 1, 1)
        std_t = torch.tensor(std, dtype=torch.float32).view(3, 1, 1)
        tensor = (tensor - mean_t) / std_t
    return tensor.unsqueeze(0)  # (1, 3, H, W)


def predict(
    model: nn.Module | None,
    image_bytes: bytes,
    mean=DEFAULT_MEAN,
    std=DEFAULT_STD,
    classes=None,
) -> Tuple[str, float]:
    if model is None:
        raise HTTPException(
            status_code=503, detail="Validated model weights are not available"
        )
    inputs = preprocess(image_bytes, mean=mean, std=std)
    with torch.no_grad():
        outputs = model(inputs)
    # Generic handling: assume logits or single score
    if isinstance(outputs, (tuple, list)):
        outputs = outputs[0]
    if outputs.numel() == 1:
        score = float(torch.sigmoid(outputs.flatten()[0]))
        label_idx = int(score > 0.5)
        score = score if label_idx else 1 - score
    else:
        probs = torch.softmax(outputs.flatten(), dim=0)
        score, label_idx = float(probs.max()), int(probs.argmax())
    if classes and 0 <= label_idx < len(classes):
        label = classes[label_idx]
    else:
        raise HTTPException(
            status_code=503, detail="Model class mapping is not configured"
        )
    return label, score


def to_response(label: str, score: float):
    return {
        "label": label,
        "confidence": score,
        "severity": "unassessed",
        "description": "Model classification; professional assessment may be needed.",
        "model_version": os.environ.get("MODEL_VERSION", "unversioned"),
    }


async def read_image(file: UploadFile):
    data = await file.read(10 * 1024 * 1024 + 1)
    if len(data) > 10 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Image exceeds 10 MB")
    try:
        with Image.open(io.BytesIO(data)) as image:
            if image.width * image.height > 24000000:
                raise ValueError("Image too large")
            image.verify()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image")
    return data


@app.get("/health", dependencies=[Depends(authenticate)])
def health():
    return {
        "plant_loaded": plant_model is not None,
        "animal_loaded": animal_model is not None,
    }


@app.post("/predict/plant", dependencies=[Depends(authenticate)])
async def predict_plant(file: UploadFile = File(...)):
    data = await read_image(file)
    label, score = predict(
        plant_model,
        data,
        mean=plant_meta["mean"],
        std=plant_meta["std"],
        classes=plant_meta["classes"],
    )
    return to_response(label, score)


@app.post("/predict/animal", dependencies=[Depends(authenticate)])
async def predict_animal(file: UploadFile = File(...)):
    data = await read_image(file)
    label, score = predict(
        animal_model,
        data,
        mean=animal_meta["mean"],
        std=animal_meta["std"],
        classes=animal_meta["classes"],
    )
    return to_response(label, score)


if __name__ == "__main__":  # pragma: no cover
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8001)))
