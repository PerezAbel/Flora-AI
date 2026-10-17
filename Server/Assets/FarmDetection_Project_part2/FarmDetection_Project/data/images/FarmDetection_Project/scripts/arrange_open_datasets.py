"""
Copies images from downloaded open datasets into data/images/<ID>_<name>/
using the mapping in dataset_mapping.py, then refreshes the CSV.

Usage (from the project folder):
  python scripts/arrange_open_datasets.py --plantvillage PATH/raw/color --plantdoc PATH/PlantDoc-Dataset

Images are resized so the longest side is at most 512 px (keeps the folder small;
models train at 224-380 px anyway) and saved as JPEG.
"""
import argparse, csv, os, sys
csv.field_size_limit(min(sys.maxsize, 2**31 - 1))
from PIL import Image, ImageOps

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from dataset_mapping import PLANTVILLAGE, PLANTDOC
import update_images

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG_DIR = os.path.join(ROOT, "data", "images")
MAX_SIDE = 512


def folder_for(record_id):
    with open(os.path.join(ROOT, "data", "farm_detection_dataset.csv"), encoding="utf-8") as f:
        for r in csv.DictReader(f):
            if r["id"] == record_id:
                return os.path.join(IMG_DIR, r["image_folder"])
    raise KeyError(record_id)


def next_number(folder, record_id, source):
    prefix = f"{record_id}_{source}_"
    nums = [int(f[len(prefix):len(prefix) + 4]) for f in os.listdir(folder)
            if f.startswith(prefix) and f[len(prefix):len(prefix) + 4].isdigit()]
    return max(nums, default=0) + 1


def save_image(src, dst):
    try:
        with Image.open(src) as im:
            im = ImageOps.exif_transpose(im).convert("RGB")
            im.thumbnail((MAX_SIDE, MAX_SIDE))
            im.save(dst, "JPEG", quality=90)
        return True
    except Exception as e:  # corrupt or unreadable file
        print("  skipped unreadable image:", src, e)
        return False


def add_images(paths, record_id, source):
    folder = folder_for(record_id)
    os.makedirs(folder, exist_ok=True)
    n = next_number(folder, record_id, source)
    added = 0
    for p in sorted(paths):
        if save_image(p, os.path.join(folder, f"{record_id}_{source}_{n:04d}.jpg")):
            n += 1
            added += 1
    return added


def list_images(d):
    return [os.path.join(d, f) for f in os.listdir(d)
            if f.lower().endswith((".jpg", ".jpeg", ".png", ".webp"))]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--plantvillage", help="path to PlantVillage raw/color folder")
    ap.add_argument("--plantdoc", help="path to PlantDoc-Dataset folder (has train/ and test/)")
    a = ap.parse_args()

    if a.plantvillage:
        for cls, rid in PLANTVILLAGE.items():
            d = os.path.join(a.plantvillage, cls)
            if os.path.isdir(d):
                print(f"PlantVillage {cls} -> {rid}: {add_images(list_images(d), rid, 'plantvillage')}")
    if a.plantdoc:
        for cls, rid in PLANTDOC.items():
            paths = []
            for part in ("train", "test"):
                d = os.path.join(a.plantdoc, part, cls)
                if os.path.isdir(d):
                    paths += list_images(d)
            if paths:
                print(f"PlantDoc {cls} -> {rid}: {add_images(paths, rid, 'plantdoc')}")
    update_images.run()


if __name__ == "__main__":
    main()
