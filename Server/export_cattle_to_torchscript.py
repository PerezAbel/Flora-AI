"""
Export cattle classifier checkpoint to TorchScript for the mobile app.

Requirements: torch, timm (added to requirements.txt).

Usage (from Server/):
  python export_cattle_to_torchscript.py \
    --ckpt Models/Models-20260401T123751Z-1-001/Models/cattle_best.pth \
    --out Models/animal_model.pt
"""

import argparse
from pathlib import Path

import torch
import timm


def export(ckpt_path: Path, out_path: Path, num_classes: int = 3, dropout: float = 0.4):
    # Model config from cattle_meta.json
    backbone = "efficientnetv2_rw_s"
    model = timm.create_model(
        backbone, pretrained=False, num_classes=num_classes, drop_rate=dropout
    )

    state = torch.load(ckpt_path, map_location="cpu", weights_only=True)
    # Some checkpoints save with a "model" key; handle both raw and nested
    if isinstance(state, dict) and "state_dict" in state:
        state = state["state_dict"]
    if isinstance(state, dict) and any(k.startswith("module.") for k in state):
        # Strip DistributedDataParallel prefixes
        state = {k.replace("module.", "", 1): v for k, v in state.items()}
    model.load_state_dict(state, strict=True)
    model.eval()

    dummy = torch.randn(1, 3, 224, 224)

    scripted = torch.jit.trace(model, dummy)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    scripted.save(str(out_path))
    print(f"Saved TorchScript to {out_path}")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--ckpt", type=Path, required=True, help="Path to cattle checkpoint (.pth)"
    )
    parser.add_argument(
        "--out", type=Path, required=True, help="Output TorchScript path (.pt)"
    )
    args = parser.parse_args()

    export(args.ckpt, args.out)


if __name__ == "__main__":
    main()
