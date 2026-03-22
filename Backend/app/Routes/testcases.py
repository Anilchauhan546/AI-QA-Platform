from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import SessionLocal
from ..auth_utils import get_current_user, require_role

router = APIRouter(prefix="/testcases", tags=["TestCases"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ✅ GET all testcases — any valid token
@router.get("/")
def get_testcases(
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    return db.query(models.TestCase).all()


# ✅ CREATE — Admin, QA_Manager, Tester
@router.post("/")
def create_testcase(
    testcase: schemas.TestCaseCreate,
    db: Session = Depends(get_db),
    user: dict = Depends(require_role(["Admin", "QA_Manager", "Tester"]))
):
    new_testcase = models.TestCase(**testcase.dict())
    db.add(new_testcase)
    db.commit()
    db.refresh(new_testcase)
    return new_testcase


# ✅ UPDATE — Admin, QA_Manager, Tester
@router.put("/{id}")
def update_testcase(
    id: int,
    testcase: schemas.TestCaseCreate,
    db: Session = Depends(get_db),
    user: dict = Depends(require_role(["Admin", "QA_Manager", "Tester"]))
):
    db_tc = db.query(models.TestCase).filter(models.TestCase.id == id).first()
    if not db_tc:
        raise HTTPException(status_code=404, detail="Testcase not found")

    db_tc.title = testcase.title
    db_tc.steps = testcase.steps
    db.commit()
    db.refresh(db_tc)
    return db_tc


# ✅ DELETE — Admin, QA_Manager only
@router.delete("/{id}")
def delete_testcase(
    id: int,
    db: Session = Depends(get_db),
    user: dict = Depends(require_role(["Admin", "QA_Manager"]))
):
    db_tc = db.query(models.TestCase).filter(models.TestCase.id == id).first()
    if not db_tc:
        raise HTTPException(status_code=404, detail="Testcase not found")

    db.delete(db_tc)
    db.commit()
    return {"message": "Testcase deleted"}