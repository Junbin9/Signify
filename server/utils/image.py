from fastapi import UploadFile
import cv2
import numpy as np

def read_image_file(file: UploadFile):
    try:
        file_bytes = np.frombuffer(file.file.read(), np.uint8)
        image = cv2.imdecode(file_bytes, cv2.IMREAD_GRAYSCALE)
        if image is None:
            raise ValueError("Invalid image format")
        return image, None
    except Exception as e:
        return None, f"Error reading image file: {str(e)}"
    
def read_image_bytes(image_bytes: bytes):
    try:
        image = cv2.imdecode(np.frombuffer(image_bytes, np.uint8), cv2.IMREAD_GRAYSCALE)
        if image is None:
            raise ValueError("Invalid image format")
        return image, None
    except Exception as e:
        return None, f"Error reading image file: {str(e)}"