"""
Fills the image columns of data/farm_detection_dataset.csv from the photos
in data/images/<ID>_<name>/ folders.

HOW TO USE
1. Put your own photos into the right folder, e.g. data/images/CP001_fall_armyworm/
   Any file name and format (jpg, png, webp) is fine. The script converts new photos
   to JPEG and renames them CP001_own_0001.jpg ...
   (photos that came from open datasets are already named like CD014_plantvillage_0001.jpg)
2. Run from the project folder:   python scripts/update_images.py
   After uploading images online:  python scripts/update_images.py --base-url https://YOUR-STORAGE/...
3. The CSV image columns are filled. Re-run any time; it never deletes photos.

File names follow  <RECORD_ID>_<source>_<NNNN>.jpg

Train / validation / test split (70 / 15 / 15)
The split of every photo is decided by a fixed rule on its file name (split_of below),
so it is the same every time, on every computer, and adding new photos never moves
old photos to a different split. Records with fewer than 7 photos put all of them
in train. The CSV stores how many photos are in each split; the notebook lists the
actual files from the folders with the same rule.
(Full path lists are NOT stored in the CSV: thousands of paths in one cell break
Excel, which allows max 32,767 characters per cell.)
"""
import argparse, csv, hashlib, os, re, sys
from collections import Counter
from PIL import Image, ImageOps

csv.field_size_limit(min(sys.maxsize, 2**31 - 1))

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV_PATH = os.path.join(ROOT, "data", "farm_detection_dataset.csv")
IMG_DIR = os.path.join(ROOT, "data", "images")
EXTS = (".jpg", ".jpeg", ".png", ".webp")

IMAGE_COLS = ["image_folder", "image_count", "reference_image", "image_sources", "image_licenses",
              "train_count", "validation_count", "test_count"]
OLD_COLS = ["image_files", "train_images", "validation_images", "test_images"]  # removed (too long for Excel)

# Licence notes for each known image source (shown in the CSV)
SOURCE_LICENSES = {
    "plantvillage": "PlantVillage (Mohanty, Hughes & Salathe 2016, doi:10.3389/fpls.2016.01419) - cite when used; confirm terms before commercial use",
    "plantdoc": "PlantDoc (Singh et al. 2020) - CC BY 4.0, attribution required",
    "ibean": "iBean / TFDS beans (Makerere AI Lab) - MIT licence",
    "icassava": "iCassava 2019 / TFDS cassava (Makerere AI Lab) - see TFDS catalog for terms",
    "own": "Own photos - your own rights",
}


def split_of(filename, n_in_record=100):
    """Fixed train/val/test rule from the file name (70/15/15)."""
    if n_in_record < 7:
        return "train"
    h = int(hashlib.md5(os.path.basename(filename).encode()).hexdigest(), 16) % 100
    return "train" if h < 70 else ("val" if h < 85 else "test")


def name_pattern(record_id):
    return re.compile(rf"^{re.escape(record_id)}_([a-z0-9]+)_(\d{{4}})\.(jpg|jpeg|png|webp)$", re.I)


def source_of(filename):
    m = re.search(r"_([a-z0-9]+)_\d{4}\.[a-z]+$", os.path.basename(filename), re.I)
    return m.group(1).lower() if m else "unknown"


def tidy_names(folder, record_id):
    """Convert new photos (any name/format) to JPEG named RECORDID_own_NNNN.jpg."""
    pat = name_pattern(record_id)
    files = sorted(f for f in os.listdir(folder) if f.lower().endswith(EXTS))
    own_used = {int(m.group(2)) for f in files if (m := pat.match(f)) and m.group(1).lower() == "own"}
    n = 1
    for f in files:
        if pat.match(f):
            continue
        while n in own_used:
            n += 1
        src = os.path.join(folder, f)
        dst = os.path.join(folder, f"{record_id}_own_{n:04d}.jpg")
        try:  # upright JPEG, longest side max 1024 px
            with Image.open(src) as im:
                im = ImageOps.exif_transpose(im).convert("RGB")
                im.thumbnail((1024, 1024))
                im.save(dst, "JPEG", quality=92)
            os.remove(src)
        except Exception as e:
            print("  could not read, left as is:", src, e)
            continue
        own_used.add(n)
    return sorted(f for f in os.listdir(folder) if pat.match(f))


def list_record_images(folder, record_id):
    """All correctly named photos of one record with their split."""
    pat = name_pattern(record_id)
    files = sorted(f for f in os.listdir(folder) if pat.match(f)) if os.path.isdir(folder) else []
    return [(f, split_of(f, len(files))) for f in files]


def run(base_url="", quiet=False, **_):
    with open(CSV_PATH, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        fields = [c for c in reader.fieldnames if c not in OLD_COLS]
        rows = [{k: v for k, v in r.items() if k not in OLD_COLS} for r in reader]
    for c in IMAGE_COLS:
        if c not in fields:
            fields.append(c)

    total = 0
    for r in rows:
        folder_name = r.get("image_folder") or r["id"]
        folder = os.path.join(IMG_DIR, folder_name)
        os.makedirs(folder, exist_ok=True)
        tidy_names(folder, r["id"])
        files = list_record_images(folder, r["id"])

        def link(fn):
            rel = f"images/{folder_name}/{fn}"
            return f"{base_url.rstrip('/')}/{rel}" if base_url else rel

        sources = Counter(source_of(f) for f, _ in files)
        splits = Counter(s for _, s in files)
        names = [f for f, _ in files]
        ref = ""
        for pref in ("own", "plantdoc", "icassava", "ibean", "plantvillage"):  # field photos first
            hit = [f for f in names if f"_{pref}_" in f]
            if hit:
                ref = link(hit[0])
                break

        r["image_folder"] = folder_name
        r["image_count"] = str(len(files))
        r["reference_image"] = ref
        r["image_sources"] = ";".join(f"{k}:{v}" for k, v in sorted(sources.items()))
        r["image_licenses"] = " | ".join(SOURCE_LICENSES.get(k, k) for k in sorted(sources))
        r["train_count"] = str(splits.get("train", 0))
        r["validation_count"] = str(splits.get("val", 0))
        r["test_count"] = str(splits.get("test", 0))
        total += len(files)

    with open(CSV_PATH, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fields)
        w.writeheader()
        w.writerows(rows)

    if not quiet:
        with_imgs = [r for r in rows if int(r["image_count"]) > 0]
        print(f"Done: {total} images across {len(with_imgs)} records.")
        print(f"{len(rows) - len(with_imgs)} records still have no photos.")
        few = [r["id"] for r in with_imgs if int(r["image_count"]) < 100]
        if few:
            print(f"Records with fewer than 100 photos (aim for 100-200 before training): {', '.join(few)}")
    return rows


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--base-url", default="", help="Online folder where data/images is uploaded")
    a = ap.parse_args()
    run(a.base_url)
