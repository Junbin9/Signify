import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    firebase_service_account_key: str = os.getenv("FIREBASE_SERVICE_ACCOUNT_KEY")

settings = Settings()
