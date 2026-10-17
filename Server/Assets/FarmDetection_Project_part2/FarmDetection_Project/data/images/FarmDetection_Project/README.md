# Farm Detection Project

Everything needed to train the image model for the farm detection app: the data, the photos,
and the training notebook.

```
FarmDetection_Project/
├── data/
│   ├── farm_detection_dataset.csv     ← THE one CSV: 238 records + image columns
│   └── images/                        ← 238 folders, one per record (e.g. CD014_tomato_late_blight)
├── notebooks/
│   └── farm_detection_training.ipynb  ← preprocessing → training → testing & statistics → export
├── scripts/
│   ├── update_images.py               ← refreshes the CSV image columns after you add photos
│   ├── arrange_open_datasets.py       ← copies open-dataset photos into the record folders
│   └── dataset_mapping.py             ← which open-dataset class = which record ID
├── models/                            ← trained models appear here
└── reports/                           ← metrics, charts and model card appear here
```

## What is in the CSV

One row per record. `category` tells you the type:

| category | rows | ID prefix |
|---|---|---|
| crop_disease | 62 | CD |
| crop_pest | 44 | CP |
| animal_disease | 31 | AD |
| animal_pest | 25 | AP |
| weed | 20 | WD |
| soil_type | 22 | SL |
| crop_requirement (crop growing needs; also the "healthy crop" class) | 34 | CR |

Image columns (filled by `scripts/update_images.py`):

| column | meaning |
|---|---|
| image_folder | folder in `data/images/` for this record |
| image_count | number of photos |
| reference_image | photo to show farmers (your own or a field photo first) |
| image_sources | e.g. `plantdoc:111;plantvillage:1909` |
| image_licenses | licence / citation of each source |
| train_count / validation_count / test_count | photos in each split (70/15/15) |

The split of each photo follows a fixed rule on its file name, so it is the same on every
computer and never changes when you add photos.

## Photos included now (32,713)

| Source | Photos | Type | Licence |
|---|---|---|---|
| PlantVillage | 31,252 | lab photos, single leaf, plain background | cite Mohanty, Hughes & Salathé 2016 (doi:10.3389/fpls.2016.01419); confirm terms before commercial use |
| PlantDoc | 1,461 | real field photos | CC BY 4.0 (attribution required) |

They cover 16 records: CD002, CD003, CD005 (maize leaf blight, grey leaf spot, rust), CD014, CD015,
CD018, CD019, CD020, CD023 (tomato, potato and pepper diseases), CD043 (citrus greening),
CD054 (cucurbit powdery mildew), CP011 (red spider mite), and healthy maize, tomato, potato and
pepper (CR001, CR003, CR004, CR026).

**Added automatically by the notebook on Colab:** iBean (bean angular leaf spot, rust, healthy)
and iCassava (CMD, CBSD, bacterial blight, green mite, healthy). That is 8 more records, about 11,000 photos.

**Not available as open data:** most animal diseases and pests, soils, weeds, and East African pests
like fall armyworm. Fill those folders with your own photos.

## How to train (Google Colab, free GPU)

1. Upload **both** `FarmDetection_Project_part1.zip` and `FarmDetection_Project_part2.zip` to **My Drive**
   in Google Drive (don't unzip them; the notebook does). On your computer, unzip both into the
   same place and they merge into one `FarmDetection_Project` folder.
2. Go to colab.research.google.com → *File → Upload notebook* → choose
   `notebooks/farm_detection_training.ipynb`.
3. *Runtime → Change runtime type → T4 GPU*.
4. *Runtime → Run all* and allow access to Google Drive.
5. Results are saved to `My Drive/FarmDetection_outputs/`.

## Adding your own photos

1. Put photos in the right folder, e.g. `data/images/CP001_fall_armyworm/` (any name or format).
   Only add photos an extension officer or vet has confirmed.
2. Run `python scripts/update_images.py` from this folder (needs Python + Pillow).
3. Zip the folder again as `FarmDetection_Project_part1.zip` (and more parts if over ~500 MB), upload, and re-run the notebook.

Aim for at least 100–200 photos per record. Include healthy plants and animals as well.

## Important
- Treatment advice in the CSV must be reviewed by an agronomist and a vet before launch.
  Chemical products must be PCPB-registered and used per the label.
- The open photos are mostly lab photos. The notebook reports **field-photo accuracy** separately;
  that is the number that matters for farmers.
