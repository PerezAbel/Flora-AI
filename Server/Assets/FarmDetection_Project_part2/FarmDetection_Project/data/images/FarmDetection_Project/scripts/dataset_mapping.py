"""
Which class of each open dataset belongs to which record ID in
data/farm_detection_dataset.csv.

Disease and pest classes map to their CD/CP record.
"Healthy" classes map to the crop's CR (crop_requirement) record, so the
model also learns what a healthy plant of that crop looks like.
Classes that are not in your CSV (e.g. apple, grape) are left out.
"""

# PlantVillage (raw/color folders)  -> record ID
PLANTVILLAGE = {
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot": "CD003",
    "Corn_(maize)___Common_rust_": "CD005",
    "Corn_(maize)___Northern_Leaf_Blight": "CD002",
    "Corn_(maize)___healthy": "CR001",
    "Orange___Haunglongbing_(Citrus_greening)": "CD043",
    "Pepper,_bell___Bacterial_spot": "CD020",
    "Pepper,_bell___healthy": "CR026",
    "Potato___Early_blight": "CD015",   # early blight record covers tomato and potato
    "Potato___Late_blight": "CD023",
    "Potato___healthy": "CR004",
    "Squash___Powdery_mildew": "CD054",
    "Tomato___Bacterial_spot": "CD020",
    "Tomato___Early_blight": "CD015",
    "Tomato___Late_blight": "CD014",
    "Tomato___Septoria_leaf_spot": "CD018",
    "Tomato___Spider_mites Two-spotted_spider_mite": "CP011",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus": "CD019",
    "Tomato___healthy": "CR003",
}

# PlantDoc (train/ and test/ folders) -> record ID
PLANTDOC = {
    "Corn Gray leaf spot": "CD003",
    "Corn leaf blight": "CD002",
    "Corn rust leaf": "CD005",
    "Bell_pepper leaf spot": "CD020",
    "Bell_pepper leaf": "CR026",
    "Potato leaf early blight": "CD015",
    "Potato leaf late blight": "CD023",
    "Squash Powdery mildew leaf": "CD054",
    "Tomato Early blight leaf": "CD015",
    "Tomato Septoria leaf spot": "CD018",
    "Tomato leaf": "CR003",
    "Tomato leaf bacterial spot": "CD020",
    "Tomato leaf late blight": "CD014",
    "Tomato leaf yellow virus": "CD019",
    "Tomato two spotted spider mites leaf": "CP011",
}

# TensorFlow Datasets (downloaded inside the notebook on Colab) -> record ID
TFDS_BEANS = {  # label names in tfds 'beans'
    "angular_leaf_spot": "CD008",
    "bean_rust": "CD009",
    "healthy": "CR002",
}
TFDS_CASSAVA = {  # label names in tfds 'cassava'
    "cbb": "CD028",   # cassava bacterial blight
    "cbsd": "CD027",  # cassava brown streak disease
    "cgm": "CP027",   # cassava green mite
    "cmd": "CD026",   # cassava mosaic disease
    "healthy": "CR005",
}
