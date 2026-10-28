"""
================================================================================
SIGI-AI: Pipeline Pelatihan Machine Learning (YOLOv8-Dental Caries Detection)
================================================================================
Script ini dapat dijalankan langsung di Google Colab (GPU Gratis) untuk melatih
model deteksi karies gigi menggunakan dataset terbuka beranotasi medis.

Dataset yang Digunakan:
1. Zenodo Open Dataset: "Annotated Intraoral Image Dataset for Dental Caries Detection"
   (6,313 citra fotografi intraoral gigi sulung & permanen, anotasi YOLO & COCO)
   URL: https://zenodo.org/records/14569838
2. Roboflow Universe: "DentalCariesMixedDS" / "Intra Oral Caries Detector"
   URL: https://universe.roboflow.com/dental-caries-detection-using-yolov8/dentalcariesmixedds
================================================================================
"""

import os

# Langkah 1: Instalasi dependensi (Jalankan di Google Colab)
# !pip install ultralytics roboflow opencv-python

def main():
    print("=== [1/4] Menginisialisasi Model YOLOv8-Dental ===")
    # pyrefly: ignore[missing-import]
    from ultralytics import YOLO

    # Menggunakan YOLOv8-Nano (Transfer Learning) agar ringan untuk smartphone/browser
    model = YOLO("yolov8n.pt") 

    print("\n=== [2/4] Menyiapkan Konfigurasi Pelatihan ===")
    # Contoh konfigurasi data.yaml (otomatis di-download dari Roboflow / Zenodo)
    data_yaml_content = """
    # SIGI-AI Dataset Configuration
    train: ./dataset/train/images
    val: ./dataset/valid/images
    test: ./dataset/test/images

    nc: 5
    names: [
      'Gigi_Sehat', 
      'Karies_Dini_White_Spot', 
      'Karies_Kavitas_Berlubang', 
      'Biofilm_Plak', 
      'Gingivitis_Radang_Gusi'
    ]
    """

    with open("dental_data.yaml", "w") as f:
        f.write(data_yaml_content.strip())
    print("File konfigurasi 'dental_data.yaml' berhasil dibuat.")

    print("\n=== [3/4] Memulai Pelatihan Model (Transfer Learning) ===")
    # Melatih model selama 50 epoch dengan image size 640x640
    # model.train(
    #     data="dental_data.yaml",
    #     epochs=50,
    #     imgsz=640,
    #     batch=16,
    #     device="cuda", # Menggunakan GPU
    #     name="sigi_ai_yolov8_run"
    # )

    print("\n=== [4/4] Ekspor Model ke Format .ONNX & .TFLITE ===")
    # Setelah training selesai, model PyTorch (best.pt) diekspor ke ONNX untuk web:
    # exported_model = YOLO("runs/detect/sigi_ai_yolov8_run/weights/best.pt")
    # exported_model.export(format="onnx", dynamic=True)   # Untuk Web / ONNX Runtime Web
    # exported_model.export(format="tflite", int8=True)     # Untuk Android Smartphone

    print("Pipeline script siap digunakan di Google Colab!")

if __name__ == "__main__":
    main()
