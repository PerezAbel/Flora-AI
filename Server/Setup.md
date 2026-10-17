# Current Django and inference setup

The current instructions are in [../backend/README.md](../backend/README.md). Start there for Django, PostgreSQL, Redis, Celery, admin, OpenAI, and every API feature.

Model service configuration and remaining external setup: [../backend/docs/INTEGRATIONS.md](../backend/docs/INTEGRATIONS.md).

The notes below are preserved from the previous prototype. Their demo-fallback behavior and port-8000 inference examples are superseded: Django uses 8000; inference uses 8001 and requires an authentication token and validated models.

---

## Flora Inference API

This folder hosts the lightweight FastAPI server that the Expo app calls at:
- `POST /predict/plant`
- `POST /predict/animal`

### Quick start
```bash
cd Server
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

The server listens on `http://localhost:8000` by default. Point the app to it with:
```
EXPO_PUBLIC_INFERENCE_URL=http://localhost:8000 npm start
```

### Model weights
- Set env vars `PLANT_WEIGHTS` and `ANIMAL_WEIGHTS` to your TorchScript/pt paths, or place them at:
  - `Models/plant_model.pt`
  - `Models/animal_model.pt`
- Preprocessing in `main.py` resizes to 224x224 RGB and scales to 0–1. Adjust to match training.

### Exporting your .pth checkpoints to ONNX (for React Native on-device inference)
1) Activate the venv and install deps: `pip install -r requirements.txt`.
2) Convert your state dict or TorchScript to ONNX (example template below).
3) Copy the resulting `.onnx` into the Expo app at `Flora/assets/models/` and commit it.
4) Ensure `metro.config.js` in the Expo app lists `onnx` in `assetExts` (already added).
5) In the app, load with `loadModelSession(require('@/assets/models/plant_disease.onnx'))` from `services/local-onnx.ts`.

Example exporter template (fill in your model class + checkpoint paths):
```python
# Server/export_to_onnx.py
import torch
from model_def import Net  # TODO: import your real model definition

CKPT = 'Models/Models-20260401T123751Z-1-001/Models/poultry_best.pth'
ONNX_OUT = 'poultry_disease.onnx'
INPUT_SHAPE = (1, 3, 224, 224)

def main():
    model = Net()
    state = torch.load(CKPT, map_location='cpu')
    model.load_state_dict(state)
    model.eval()

    dummy = torch.randn(*INPUT_SHAPE)
    torch.onnx.export(
        model,
        dummy,
        ONNX_OUT,
        input_names=['input'],
        output_names=['logits'],
        opset_version=17,
        dynamic_axes=None,
    )
    print(f'Wrote {ONNX_OUT}')

if __name__ == '__main__':
    main()
```

If your `.pth` files are TorchScript already, swap in `model = torch.jit.load(...)` instead of defining `Net`.

### Response contract
The app accepts JSON fields: `label`, `confidence` (0–1 or 0–100), optional `description`, `risk` (`High|Medium|Low`), `recommendation`.

### CORS
Open to all origins for dev. Tighten `allow_origins` in `main.py` before production.
