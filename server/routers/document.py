from fastapi import APIRouter, File, HTTPException, UploadFile, Depends
from typing import List
from ..models.document import Document
from ..crud.document import (
    create_document,
    read_documents,
    read_document,
    update_document,
    delete_document
)
from ..dependencies.auth import get_current_user

router = APIRouter()

@router.post("/", response_model=Document)
async def upload_document(file: UploadFile = File(...), user=Depends(get_current_user)):
    user_id = user['decoded_token']['user_id']
    return await create_document(file, user_id)

@router.get("/", response_model=List[Document])
async def get_documents(user=Depends(get_current_user)):
    user_id = user['decoded_token']['user_id']
    return await read_documents(user_id)

@router.get("/{document_id}", response_model=Document)
async def get_document(document_id: str, user=Depends(get_current_user)):
    user_id = user['decoded_token']['user_id']
    document = await read_document(document_id, user_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    return document

@router.put("/{document_id}", response_model=Document)
async def modify_document(document_id: str, file: UploadFile = File(...), user=Depends(get_current_user)):
    user_id = user['decoded_token']['user_id']
    updated_document = await update_document(document_id, file, user_id)
    if not updated_document:
        raise HTTPException(status_code=404, detail="Document not found")
    return updated_document

@router.delete("/{document_id}")
async def remove_document(document_id: str, user=Depends(get_current_user)):
    user_id = user['decoded_token']['user_id']
    deleted = await delete_document(document_id, user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Document not found")
    return {"message": "Document deleted successfully"}