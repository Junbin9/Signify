from fastapi import APIRouter, File, HTTPException, UploadFile, Depends
from typing import List
from ..models.signature import Signature, WatermarkedSignatureResponse
from ..crud.signature import (
    create_signature,
    get_signatures,
    get_signature,
    update_signature,
    delete_signature,
    apply_watermark_to_signature,
    validate_signature
)
from ..dependencies.auth import get_current_user

router = APIRouter()

# @router.post("/", response_model=Signature)
# async def upload_signature(file: UploadFile = File(...), user=Depends(get_current_user)):
#     user_id = user['decoded_token']['user_id']
#     return await create_signature(file, user_id)

@router.post("/", response_model=Signature)
async def upload_signature(file: UploadFile = File(...), user=Depends(get_current_user)):
    user_id = user['decoded_token']['user_id']

    # Read file bytes
    file_bytes = await file.read()
    await file.seek(0)  # Reset pointer for subsequent reads

    # Validate the uploaded file
    is_registered = await validate_signature(file_bytes, user_id)

    if is_registered:
        raise HTTPException(
            status_code=400,
            detail="This file is already uploaded by you."
        )

    # If not registered, proceed to create a new signature record
    return await create_signature(file, user_id)

@router.get("/", response_model=List[Signature])
async def read_signatures(user=Depends(get_current_user)):
    user_id = user['decoded_token']['user_id']
    return await get_signatures(user_id)

@router.get("/{signature_id}", response_model=Signature)
async def read_signature(signature_id: str, user=Depends(get_current_user)):
    user_id = user['decoded_token']['user_id']
    signature = await get_signature(signature_id, user_id)
    if not signature:
        raise HTTPException(status_code=404, detail="Signature not found")
    return signature

@router.put("/{signature_id}", response_model=Signature)
async def modify_signature(signature_id: str, file: UploadFile = File(...), user=Depends(get_current_user)):
    user_id = user['decoded_token']['user_id']
    updated_signature = await update_signature(signature_id, file, user_id)
    if not updated_signature:
        raise HTTPException(status_code=404, detail="Signature not found")
    return updated_signature

@router.delete("/{signature_id}")
async def remove_signature(signature_id: str, user=Depends(get_current_user)):
    user_id = user['decoded_token']['user_id']
    deleted = await delete_signature(signature_id, user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Signature not found")
    return {"message": "Signature deleted successfully"}

@router.post("/{signature_id}/watermark", response_model=WatermarkedSignatureResponse)
async def add_watermark(signature_id: str, watermark: UploadFile):
    return await apply_watermark_to_signature(signature_id, watermark)
