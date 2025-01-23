import firebase_admin
from firebase_admin import credentials, auth
from ..config import settings
from fastapi import HTTPException, status

cred = credentials.Certificate(settings.firebase_service_account_key)
firebase_admin.initialize_app(cred, {
    'storageBucket': 'signify-29c6f.appspot.com'
})
print("Firebase Admin SDK initialized successfully")

def verify_token(token: str):
    try:
        decoded_token = auth.verify_id_token(id_token=token)
        uid = decoded_token['uid']
        return {"message": "Token is valid", "decoded_token": decoded_token}
    except firebase_admin.exceptions.FirebaseError as e:
        # Log the actual FirebaseError to help with debugging
        print(f"FirebaseError: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    except Exception as e:
        # Log any other exceptions
        print(f"Unexpected error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while verifying the token"
        )