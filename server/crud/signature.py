import uuid
from fastapi import UploadFile, HTTPException
from typing import List
from ..models.signature import Signature
from ..services.signature_service import (
    upload_signature_to_storage, 
    delete_signature_from_storage,
    get_all_signature_metadata,
    get_signature_metadata
    )
from firebase_admin import firestore
from ..utils.image_processing import apply_watermark
import firebase_admin
from firebase_admin import auth

db = firestore.client()

import hashlib
from fastapi import HTTPException

# Calculate SHA-256 hash of the file
def calculate_file_hash(file_bytes: bytes) -> str:
    return hashlib.sha256(file_bytes).hexdigest()

# Validate the file against Firestore metadata
async def validate_signature(file_bytes: bytes, user_id: str):
    file_hash = calculate_file_hash(file_bytes)
    print(f"File hash during validation: {file_hash}")

    # Query Firestore for matching file hashes
    signatures_query = db.collection_group("signatures").where("file_hash", "==", file_hash).stream()

    for signature_doc in signatures_query:
        data = signature_doc.to_dict()
        print(f"Matched signature: {data}")

        # Check if the file belongs to the same user
        if data["uploaded_by"] == user_id:
            return True

        # If the file belongs to another user, retrieve their email from Firebase Auth
        original_user_id = data["uploaded_by"]
        file_name = data["file_name"]

        try:
            # Fetch user details from Firebase Auth
            user_record = auth.get_user(original_user_id)
            original_user_email = user_record.email

            # Send email notification
            if original_user_email:
                await notify_user_by_email(
                    recipient_email=original_user_email,
                    file_name=file_name,
                    uploaded_by=user_id
                )

        except auth.AuthError as e:
            print(f"Failed to fetch user details from Firebase Auth: {e}")
            raise HTTPException(
                status_code=500,
                detail="Failed to retrieve original user's email address."
            )

        # Raise an exception for the duplicate file
        raise HTTPException(
            status_code=403,
            detail=f"This watermarked signature is already registered to another user: {original_user_id}."
        )

    return False

async def get_signatures(user_id: str) -> List[Signature]:
    docs = get_all_signature_metadata(user_id)
    signatures_metadata = []

    for doc in docs:
        file_metadata = doc.to_dict()
        signatures_metadata.append(file_metadata)

    return signatures_metadata

async def create_signature(file: UploadFile, user_id: str) -> Signature:
    if file.content_type not in ("image/png", "image/jpeg", "image/jpg", "image/svg+xml"):
        raise HTTPException(status_code=400, detail="Invalid file format")
    
    file_bytes = await file.read()
    await file.seek(0)  # Reset pointer for subsequent reads
    file_hash = calculate_file_hash(file_bytes)
    print(f"File hash during creation: {file_hash}")
    
    file_id = str(uuid.uuid4())
    file_path = f"{user_id}/{file_id}/{file.filename}"
    file_url = upload_signature_to_storage(file, file_path)
    
    signature_metadata = Signature(
        file_hash=file_hash,
        file_name=file.filename,
        file_url=file_url,
        file_id=file_id,
        file_path=file_path,
        uploaded_by=user_id,
        watermark_text=""
    )

    metadata = {
        "file_id": file_id,
        "file_name": file.filename,
        "file_path": file_path,
        "file_url": file_url,
        "file_hash": file_hash,  # Store file hash for future validation
        "uploaded_by": user_id,
        "watermark_text": ""
    }

    # Save metadata to Firestore
    db.collection("users").document(user_id).collection("signatures").document(file_id).set(metadata)
    
    return signature_metadata

async def get_signature(signature_id: str, user_id: str) -> Signature:
    doc = get_signature_metadata(user_id, signature_id)
    if not doc or doc.get("uploaded_by") != user_id:
        return None
    return doc

async def update_signature(signature_id: str, file: UploadFile, user_id: str) -> Signature:
    deleted = await delete_signature(signature_id, user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Signature not found")
    else:
        return await create_signature(file, user_id)

async def delete_signature(signature_id: str, user_id: str) -> bool:
    signature = await get_signature(signature_id, user_id)
    if not signature:
        return False
    
    file_path = signature.get("file_path")
    delete_signature_from_storage(file_path)

    db.collection("users").document(user_id).collection("signatures").document(signature_id).delete()
    
    return True

async def apply_watermark_to_signature(signature_id: str, watermark: UploadFile) -> dict:
    signature = await get_signature(signature_id, None)
    if not signature:
        raise HTTPException(status_code=404, detail="Signature not found")

    # Use cloud-based handling for watermarking
    output_path = apply_watermark(signature.file_url, watermark.file.read())

    # Upload watermarked file
    watermarked_blob_name = f'watermarked_{signature_id}.png'
    # watermarked_url = upload_to_storage(watermarked_blob_name, output_path)

    # Update Firestore document
    # signature.watermarked_url = watermarked_url
    # db.collection("signatures").document(signature_id).update({"watermarked_url": watermarked_url})

    # return {"watermarked_url": watermarked_url}

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

async def notify_user_by_email(recipient_email: str, file_name: str, uploaded_by: str):
    sender_email = "junbin147102@gmail.com"  # Replace with your email
    sender_password = "stiv wuls ldur wvyi"  # Replace with your email password

    subject = "File Upload Alert: Duplicate File Detected"
    body = f"""
    Dear User,

    A file named '{file_name}' already registered by you has been attempted to upload by another user ({uploaded_by}). 
    Please ensure that your data remains secure.

    Regards,
    Signify Team
    """

    # Create the email
    msg = MIMEMultipart()
    msg["From"] = sender_email
    msg["To"] = recipient_email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    try:
        # Connect to the SMTP server
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()  # Secure the connection
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, recipient_email, msg.as_string())

        print(f"Email sent to {recipient_email}")
    except Exception as e:
        print(f"Failed to send email: {e}")
