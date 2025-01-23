# from firebase_admin import storage, firestore
# from fastapi import UploadFile

# db = firestore.client()
# bucket = storage.bucket()

# def upload_signature_to_storage(file: UploadFile, file_path: str) -> str:
#     blob = bucket.blob(f"signatures/{file_path}")
#     blob.upload_from_file(file.file, content_type=file.content_type)
#     return blob.public_url

from firebase_admin import storage, firestore
from fastapi import UploadFile

db = firestore.client()
bucket = storage.bucket()

def upload_signature_to_storage(file: UploadFile, file_path: str) -> str:
    """
    Uploads the signature file to Firebase Storage.

    Args:
        file (UploadFile): The file object to upload.
        file_path (str): The destination path in Firebase Storage.

    Returns:
        str: The publicly accessible URL of the uploaded file.
    """
    blob = bucket.blob(f"signatures/{file_path}")
    
    # Reset the file stream to the beginning
    file.file.seek(0)

    # Upload the file
    blob.upload_from_file(file.file, content_type=file.content_type)

    # Optionally make the file public (uncomment if needed)
    # blob.make_public()

    return blob.public_url

def delete_signature_from_storage(file_path: str) -> None:
    blob = bucket.blob(f"signatures/{file_path}")
    blob.delete()

def get_signature_metadata(user_id: str, file_id: str):
    doc_ref = db.collection("users").document(user_id).collection("signatures").document(file_id)
    return doc_ref.get().to_dict()

def get_all_signature_metadata(user_id: str):
    doc_ref = db.collection("users").document(user_id).collection("signatures")
    return doc_ref.stream()