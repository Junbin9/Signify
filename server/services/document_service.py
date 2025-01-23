from firebase_admin import storage, firestore
from fastapi import UploadFile

db = firestore.client()
bucket = storage.bucket()

def upload_document_to_storage(file: UploadFile, file_path: str) -> str:
    blob = bucket.blob(f"documents/{file_path}")
    blob.upload_from_file(file.file, content_type=file.content_type)
    return blob.public_url

def delete_document_from_storage(file_path: str) -> None:
    blob = bucket.blob(f"documents/{file_path}")
    blob.delete()

def get_document_metadata(user_id: str, file_id: str):
    doc_ref = db.collection("users").document(user_id).collection("documents").document(file_id)
    return doc_ref.get().to_dict()

def get_all_document_metadata(user_id: str):
    doc_ref = db.collection("users").document(user_id).collection("documents")
    return doc_ref.stream()