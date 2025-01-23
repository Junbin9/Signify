from pydantic import BaseModel, Field, HttpUrl
from typing import Optional

class SignatureBase(BaseModel):
    file_name: str
    file_url: HttpUrl

# class SignatureCreate(SignatureBase):
#     pass

class Signature(SignatureBase):
    file_id: str
    file_path: str
    uploaded_by: str
    file_hash: str
    watermark_text: str

class WatermarkedSignatureResponse(BaseModel):
    watermarked_url: HttpUrl
    watermarked_url: Optional[HttpUrl] = None