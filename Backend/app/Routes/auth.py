import os
import traceback
from datetime import datetime, timedelta, timezone
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel

from ..database import SessionLocal
from .. import models

router = APIRouter()

# ─── Config ───────────────────────────────────────────────────────────────────
SECRET_KEY = os.getenv("SECRET_KEY", "fallback-dev-key-change-in-prod")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# ─── Valid Roles ──────────────────────────────────────────────────────────────
VALID_ROLES = ["Admin", "QA_Manager", "Tester", "user"]


# ─── Schemas ──────────────────────────────────────────────────────────────────
class RegisterRequest(BaseModel):
    username: str
    password: str
    role: Literal["Admin", "QA_Manager", "Tester", "user"] = "user"  # ← role dropdown in Swagger


# ─── DB ───────────────────────────────────────────────────────────────────────
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ─── Password ─────────────────────────────────────────────────────────────────
def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


# ─── Token ────────────────────────────────────────────────────────────────────
def create_token(data: dict) -> str:
    payload = data.copy()
    payload["exp"] = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


# ─── Current User ─────────────────────────────────────────────────────────────
def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        role: str = payload.get("role")

        if username is None or role is None:
            raise HTTPException(status_code=401, detail="Invalid token payload")

        return {"username": username, "role": role}

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


# ─── RBAC ─────────────────────────────────────────────────────────────────────
def require_role(roles: list):
    def role_checker(user: dict = Depends(get_current_user)):
        if user["role"] not in roles:
            raise HTTPException(status_code=403, detail="Access Denied")
        return user
    return role_checker


# ─── Register ─────────────────────────────────────────────────────────────────
@router.post("/register", status_code=201)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    try:
        existing = db.query(models.User).filter(
            models.User.username == payload.username
        ).first()

        if existing:
            raise HTTPException(status_code=400, detail="Username already exists")

        user = models.User(
            username=payload.username,
            password=hash_password(payload.password),
            role=payload.role   # ← now uses role from request
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        return {"msg": f"User created successfully with role: {payload.role}"}

    except HTTPException:
        raise
    except Exception:
        traceback.print_exc()
        db.rollback()
        raise HTTPException(status_code=500, detail="Registration failed. Check server logs.")


# ─── Login ────────────────────────────────────────────────────────────────────
@router.post("/login")
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    try:
        user = db.query(models.User).filter(
            models.User.username == form.username
        ).first()

        if not user or not verify_password(form.password, user.password):
            raise HTTPException(status_code=401, detail="Invalid credentials")

        token = create_token({
            "sub": user.username,
            "role": user.role
        })

        return {
            "access_token": token,
            "token_type": "bearer",
            "role": user.role       # ← also return role so you know what you logged in as
        }

    except HTTPException:
        raise
    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Login failed. Check server logs.")