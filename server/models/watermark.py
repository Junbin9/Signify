from pydantic import BaseModel

class WatermarkRequest(BaseModel):
    data: str

class WatermarkResponse(BaseModel):
    message: str
    file_url: str

class ExtractResponse(BaseModel):
    message: str
    extracted_image_url: str
    extracted_data: str
