# from datetime import timedelta
# import uuid
# from fastapi import UploadFile, HTTPException, BackgroundTasks
# from typing import List
# from ..services.firebase_service import upload_to_storage, delete_from_storage
# from ..models.signature import Signature, SignatureCreate
# from firebase_admin import storage
# import os
# from ..utils.image_processing import apply_watermark

# SIGNATURES = {}  # This will act as our in-memory database

# async def create_signature(file: UploadFile, user_id: str) -> Signature:
#     file_extension = file.filename.split(".")[-1] in ("png", "jpeg", "jpg", "svg")
#     if not file_extension:
#         raise HTTPException(status_code=400, detail="Invalid file format")
    
#     file_id = str(uuid.uuid4())
#     file_url = upload_to_storage(file_id, file)
    
#     signature = Signature(
#         id=file_id,
#         user_id=user_id,
#         filename=file.filename,
#         file_url=file_url,
#     )
    
#     SIGNATURES[file_id] = signature
#     return signature

# async def get_signatures(user_id: str) -> List[Signature]:
#     return [sig for sig in SIGNATURES.values() if sig.user_id == user_id]

# async def get_signature(signature_id: str, user_id: str) -> Signature:
#     signature = SIGNATURES.get(signature_id)
#     if signature and signature.user_id == user_id:
#         return signature
#     return None

# async def update_signature(signature_id: str, file: UploadFile, user_id: str) -> Signature:
#     print(signature_id)
#     signature = SIGNATURES.get(signature_id)
#     print(signature)
#     if not signature or signature.user_id != user_id:
#         return None

#     file_extension = file.filename.split(".")[-1] in ("png", "jpeg", "jpg", "svg")
#     if not file_extension:
#         raise HTTPException(status_code=400, detail="Invalid file format")
    
#     # Delete the old file from storage
#     delete_from_storage(signature_id)
    
#     file_url = upload_to_storage(signature_id, file)
#     signature.filename = file.filename
#     signature.file_url = file_url

#     SIGNATURES[signature_id] = signature
#     return signature

# async def delete_signature(signature_id: str, user_id: str) -> bool:
#     signature = SIGNATURES.get(signature_id)
#     print(signature)
#     if not signature or signature.user_id != user_id:
#         print("Sorry")
#         return False
    
#     # Delete the file from storage
#     delete_from_storage(signature_id)
    
#     del SIGNATURES[signature_id]
#     return True

# async def apply_watermark_to_signature(signature_id: str, watermark: UploadFile):
#     # Ensure the signature_id is in SIGNATURES
#     if signature_id not in SIGNATURES:
#         raise HTTPException(status_code=404, detail="Signature not found")

#     signature_object = SIGNATURES[signature_id]

#     # Download the signature file
#     bucket = storage.bucket('signify-29c6f.appspot.com')
#     signature_blob = bucket.blob(f'signatures/{signature_id}')
#     signature_path = f'{signature_id}.png'
#     signature_blob.download_to_filename(signature_path)

#     # Save watermark image locally
#     watermark_file_path = f'watermark_{signature_id}.png'
#     with open(watermark_file_path, 'wb') as f:
#         f.write(await watermark.read())

#     # Apply watermark using OpenCV
#     output_path = apply_watermark(signature_path, watermark_file_path, signature_id)

#     # Upload watermarked image back to Firebase
#     watermarked_blob = bucket.blob(f'signatures/watermarked_{signature_id}.png')
#     watermarked_blob.upload_from_filename(output_path)
#     watermarked_url = watermarked_blob.generate_signed_url(timedelta(seconds=300), method='GET')

#     # Clean up local files
#     os.remove(signature_path)
#     os.remove(watermark_file_path)
#     os.remove(output_path)

#     # Update the Signature object
#     signature_object.watermarked_url = watermarked_url
#     return {"watermarked_url": watermarked_url}
