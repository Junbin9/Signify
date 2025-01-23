from pydantic import BaseModel, HttpUrl

class DocumentBase(BaseModel):
    file_name: str
    file_url: HttpUrl

class Document(DocumentBase):
    file_id: str
    file_path: str
    uploaded_by: str
    signed: bool