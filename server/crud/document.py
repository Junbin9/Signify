import uuid
from fastapi import UploadFile, HTTPException
from typing import List
from ..models.document import Document
from ..services.document_service import (
    upload_document_to_storage, 
    delete_document_from_storage,
    get_all_document_metadata,
    get_document_metadata
    )
from firebase_admin import firestore

db = firestore.client()

async def create_document(file: UploadFile, user_id: str) -> Document:
    # if file.content_type not in ("image/png", "image/jpeg", "image/jpg", "image/svg+xml"):
    #     raise HTTPException(status_code=400, detail="Invalid file format")
    
    file_id = str(uuid.uuid4())
    file_path = f"{user_id}/{file_id}/{file.filename}"
    file_url = upload_document_to_storage(file, file_path)

    if file.filename.startswith("[signed]"):
        signed = True
    else:
        signed = False
    
    document_metadata = Document(
        file_name=file.filename,
        file_url=file_url,
        file_id=file_id,
        file_path=file_path,
        uploaded_by=user_id,
        signed=signed
    )

    metadata = {
        "file_id": file_id,
        "file_name": file.filename,
        "file_path": file_path,
        "file_url": file_url,
        "uploaded_by": user_id,
        "signed": signed
    }
    
    db.collection("users").document(user_id).collection("documents").document(file_id).set(metadata)
    
    return document_metadata

async def read_documents(user_id: str) -> List[Document]:
    docs = get_all_document_metadata(user_id)
    documents_metadata = []

    for doc in docs:
        file_metadata = doc.to_dict()
        documents_metadata.append(file_metadata)

    return documents_metadata

async def read_document(document_id: str, user_id: str) -> Document:
    doc = get_document_metadata(user_id, document_id)
    if not doc or doc.get("uploaded_by") != user_id:
        return None
    return doc

async def update_document(document_id: str, file: UploadFile, user_id: str) -> Document:
    deleted = await delete_document(document_id, user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Document not found")
    else:
        return await create_document(file, user_id)

async def delete_document(document_id: str, user_id: str) -> bool:
    document = await read_document(document_id, user_id)
    if not document:
        return False
    
    file_path = document.get("file_path")
    delete_document_from_storage(file_path)

    db.collection("users").document(user_id).collection("documents").document(document_id).delete()
    
    return True