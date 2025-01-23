import firebase_admin
from fastapi import APIRouter, HTTPException, status, Depends
import firebase_admin.exceptions
from ..models.user import User, Token
from ..dependencies.firebase import verify_token, auth
from ..dependencies.auth import get_current_user

router = APIRouter()

@router.post("/register")
async def register(user_in: User):
    try:
        user = auth.create_user(
            email=user_in.email, 
            password=user_in.password
        )
        return {"message": "User registered successfully", "user_id": user.uid, "email": user.email}
    except auth.EmailAlreadyExistsError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The email address is already in use by another account"
        )
    except firebase_admin.exceptions.FirebaseError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Firebase error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred during user registration"
        )

@router.post("/login")
async def login(user_in: User):
    try:
        user = auth.get_user_by_email(user_in.email)
        # Firebase Authentication does not directly support password authentication.
        # The client should authenticate and get a Firebase ID token.
        user_token = auth.create_custom_token(user.uid)
        return {"token": user_token}
    except auth.UserNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    except firebase_admin.exceptions.FirebaseError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Firebase error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred during user login"
        )
    
@router.post("/verify-token")
async def verify_token_route(token_data: Token):
    try:
        decoded_token = verify_token(token_data.token)
        if decoded_token:
            return {"message": "Token is valid", "user_id": decoded_token["uid"]}
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    except HTTPException as e:
        raise e  # Forward the already raised HTTPException
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred during token verification"
        )
    
@router.get("/profile")
async def get_user_profile(current_user: dict = Depends(get_current_user)):
    try:
        # Fetch user data from Firebase, simulate user fetching
        user_id = current_user["uid"]
        return {"message": "User profile", "user_id": user_id}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while retrieving the user profile"
        )