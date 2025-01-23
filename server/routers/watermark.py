from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from ..utils.dwtdct_hybrid import (
    embed_watermark_and_data,
    extract_watermark_and_data
)
from ..utils.image import (
    read_image_bytes,
    read_image_file
)
from ..models.watermark import WatermarkResponse, ExtractResponse
from ..services.watermark_service import (
    upload_watermark_images_to_storage,
    upload_image_to_storage,
    get_image_from_storage,
    get_image_from_storage_1
)
import cv2

from firebase_admin import firestore
db = firestore.client()

import re
from ..crud.signature import calculate_file_hash

router = APIRouter()

from ..dependencies.auth import get_current_user
from ..crud.signature import validate_signature
from fastapi import Depends

# @router.post("/embed", response_model=WatermarkResponse)
# async def embed_watermark(
#     signature_path: str = Form(...),
#     data: str = Form(...),
#     image_file: UploadFile = File(...)
# ):
#     image, error = read_image_file(image_file)
#     if error:
#         raise HTTPException(status_code=400, detail=error)
    
#     signature_image_bytes, error = get_image_from_storage(signature_path)
#     if error:
#         raise HTTPException(status_code=500, detail=error)
    
#     signature_image, error = read_image_bytes(signature_image_bytes)
#     if error:
#         raise HTTPException(status_code=500, detail=error)

#     watermarked_signature, error = embed_watermark_and_data(signature_image, image, data)
#     if error:
#         raise HTTPException(status_code=500, detail=error)

#     _, buffer = cv2.imencode('.jpg', watermarked_signature)
#     watermarked_signature_url = upload_image_to_storage(buffer.tobytes(), signature_path)


#     return WatermarkResponse(message="Watermark and data embedded successfully", file_url=watermarked_signature_url)

@router.post("/embed", response_model=WatermarkResponse)
async def embed_watermark(
    signature_path: str = Form(...),
    data: str = Form(...),
    image_file: UploadFile = File(...),
    user=Depends(get_current_user)
):
    user_id = user['decoded_token']['user_id']

    # Validate signature ownership
    signature_bytes, error = get_image_from_storage(signature_path)
    if error:
        raise HTTPException(status_code=500, detail=error)

    await validate_signature(signature_bytes, user_id)

    # Proceed with watermark embedding
    image, error = read_image_file(image_file)
    if error:
        raise HTTPException(status_code=400, detail=error)
    
    signature_image, error = read_image_bytes(signature_bytes)
    if error:
        raise HTTPException(status_code=500, detail=error)

    watermarked_signature, error = embed_watermark_and_data(signature_image, image, data)
    if error:
        raise HTTPException(status_code=500, detail=error)

    _, buffer = cv2.imencode('.jpg', watermarked_signature)
    watermarked_signature_url = upload_image_to_storage(buffer.tobytes(), signature_path)

    file_hash = calculate_file_hash(buffer.tobytes())
    match = re.search(r'/([^/]+)/', signature_path)
    if match:
        file_id = match.group(1)

    db.collection("users").document(user_id).collection("signatures").document(file_id).update({'watermark_text': data, 'file_hash': file_hash})

    watermark_image_url = upload_watermark_images_to_storage(image_file, signature_path)

    return WatermarkResponse(message="Watermark and data embedded successfully", file_url=watermarked_signature_url)

# @router.post("/extract")
# async def extract_watermark(file: UploadFile = File(...), original_file: UploadFile = File(...), data_length: int = 12):
#     # Read images
#     watermarked_image, error = read_image_file(file)
#     if error:
#         raise HTTPException(status_code=400, detail=error)

#     original_image, error = read_image_file(original_file)
#     if error:
#         raise HTTPException(status_code=400, detail=error)

#     # Extract watermark and data
#     extracted_data, error = extract_watermark_and_data(watermarked_image, original_image, data_length=data_length)
#     if error:
#         raise HTTPException(status_code=500, detail=error)

#     return {"extracted_data": extracted_data}

@router.post("/extract", response_model=ExtractResponse)
async def extract_watermark(
    watermarked_path: str = Form(...),
):
    # Retrieve the watermarked signature file from Firebase
    watermarked_image_bytes, error = get_image_from_storage_1(watermarked_path)
    if error:
        raise HTTPException(status_code=500, detail=error)

    # Read the watermarked image
    watermarked_image, error = read_image_bytes(watermarked_image_bytes)
    if error:
        raise HTTPException(status_code=500, detail=error)

    # Extract watermark and data
    extracted_image, extracted_data, error = extract_watermark_and_data(watermarked_image)
    if error:
        raise HTTPException(status_code=500, detail=error)

    # Encode the extracted watermark image to a URL-friendly format
    _, buffer = cv2.imencode('.jpg', extracted_image)
    extracted_image_url = upload_image_to_storage(buffer.tobytes(), "extracted/watermark.jpg")

    return ExtractResponse(
        message="Watermark and data extracted successfully",
        extracted_image_url=extracted_image_url,
        extracted_data=extracted_data,
    )
