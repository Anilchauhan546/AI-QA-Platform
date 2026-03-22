from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import SessionLocal
from ..auth_utils import get_current_user, require_role

router = APIRouter(prefix="/projects", tags=["Projects"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ✅ GET all projects — any valid token
@router.get("/")
def get_projects(
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    return db.query(models.Project).all()


# ✅ CREATE — Admin, QA_Manager only
@router.post("/")
def create_project(
    project: schemas.ProjectCreate,
    db: Session = Depends(get_db),
    user: dict = Depends(require_role(["Admin", "QA_Manager"]))
):
    new_project = models.Project(**project.dict())
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    return new_project


# ✅ UPDATE — Admin, QA_Manager only
@router.put("/{id}")
def update_project(
    id: int,
    project: schemas.ProjectCreate,
    db: Session = Depends(get_db),
    user: dict = Depends(require_role(["Admin", "QA_Manager"]))
):
    db_project = db.query(models.Project).filter(models.Project.id == id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")

    db_project.name = project.name
    db.commit()
    db.refresh(db_project)
    return db_project


# ✅ DELETE — Admin only
@router.delete("/{id}")
def delete_project(
    id: int,
    db: Session = Depends(get_db),
    user: dict = Depends(require_role(["Admin"]))
):
    project = db.query(models.Project).filter(models.Project.id == id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    db.delete(project)
    db.commit()
    return {"message": "Project deleted"}