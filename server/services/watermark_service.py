from firebase_admin import storage
from fastapi import UploadFile

bucket = storage.bucket()

def upload_watermark_images_to_storage(file: UploadFile, file_path: str):
    try:
        file.file.seek(0)
        blob = bucket.blob(f"watermark_images/{file_path}")
        blob.upload_from_file(file.file, content_type=file.content_type)
        return blob.public_url
    except Exception as e:
        raise RuntimeError(f"Failed to upload the watermark image to Firebase Storage: {str(e)}")
    
def upload_image_to_storage(image_bytes: bytes, file_path: str):
    try:
        blob = bucket.blob(f"watermarked_signatures/{file_path}")
        blob.upload_from_string(image_bytes, content_type="image/jpeg")
        return blob.public_url
    except Exception as e:
        raise RuntimeError(f"Failed to upload watermarked signature to Firebase Storage: {str(e)}")
    
def get_image_from_storage(file_path: str):
    try:
        blob = bucket.blob(f"signatures/{file_path}")
        if not blob.exists():
            raise FileNotFoundError("The specified watermarked signature image does not exist in Firebase Storage.")
        return blob.download_as_bytes(), None
    except Exception as e:
        return None, f"Failed to fetch watermarked signature from Firebase Storage: {str(e)}"

def get_image_from_storage_1(file_path: str):
    try:
        blob = bucket.blob(f"watermarked_signatures/{file_path}")
        if not blob.exists():
            raise FileNotFoundError("The specified watermarked signature image does not exist in Firebase Storage.")
        return blob.download_as_bytes(), None
    except Exception as e:
        return None, f"Failed to fetch watermarked signature from Firebase Storage: {str(e)}"