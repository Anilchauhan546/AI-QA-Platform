from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import SessionLocal

router = APIRouter(prefix="/users", tags=["Users"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/")
def get_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()


@router.post("/")
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    new_user = models.User(**user.dict())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.put("/{id}")
def update_user(id: int, user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == id).first()
    db_user.username = user.username
    db_user.password = user.password
    db_user.role = user.role
    db.commit()
    return db_user


@router.delete("/{id}")
def delete_user(id: int, db: Session = Depends(get_db)):
    db.query(models.User).filter(models.User.id == id).delete()
    db.commit()
    return {"message": "User deleted"}
