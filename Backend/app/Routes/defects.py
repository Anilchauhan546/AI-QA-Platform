from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import SessionLocal
from ..auth_utils import get_current_user, require_role

router = APIRouter(prefix="/defects", tags=["Defects"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ✅ GET all defects — any valid token
@router.get("/")
def get_defects(
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    return db.query(models.Defect).all()


# ✅ CREATE — Admin, QA_Manager, Tester
@router.post("/")
def create_defect(
    defect: schemas.DefectCreate,
    db: Session = Depends(get_db),
    user: dict = Depends(require_role(["Admin", "QA_Manager", "Tester"]))
):
    new_defect = models.Defect(**defect.dict())
    db.add(new_defect)
    db.commit()
    db.refresh(new_defect)
    return new_defect


# ✅ UPDATE — Admin, QA_Manager, Tester
@router.put("/{id}")
def update_defect(
    id: int,
    defect: schemas.DefectCreate,
    db: Session = Depends(get_db),
    user: dict = Depends(require_role(["Admin", "QA_Manager", "Tester"]))
):
    db_defect = db.query(models.Defect).filter(models.Defect.id == id).first()
    if not db_defect:
        raise HTTPException(status_code=404, detail="Defect not found")

    db_defect.title = defect.title
    db_defect.description = defect.description
    db.commit()
    db.refresh(db_defect)
    return db_defect


# ✅ DELETE — Admin only
@router.delete("/{id}")
def delete_defect(
    id: int,
    db: Session = Depends(get_db),
    user: dict = Depends(require_role(["Admin"]))
):
    db_defect = db.query(models.Defect).filter(models.Defect.id == id).first()
    if not db_defect:
        raise HTTPException(status_code=404, detail="Defect not found")

    db.delete(db_defect)
    db.commit()
    return {"message": "Defect deleted"}