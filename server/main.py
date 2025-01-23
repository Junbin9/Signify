from fastapi import FastAPI, Depends, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, signature, document, watermark
from .dependencies.auth import get_current_user

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(signature.router, prefix="/signatures", tags=["signatures"])
app.include_router(document.router, prefix="/documents", tags=["documents"])
app.include_router(watermark.router, prefix="/watermarks", tags=["watermarks"])

@app.get("/protected-route")
def protected_route(user=Depends(get_current_user)):
    return {"message": f"Hello, {user}"}

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An unexpected error occurred. Please try again later."}
    )