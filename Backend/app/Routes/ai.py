from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from ..database import SessionLocal
from .. import models
from ..services.ai_engine import (
    analyze_defect,
    generate_test_cases,
    calculate_risk_score,
    predict_severity
)
from ..auth_utils import get_current_user

router = APIRouter(prefix="/ai", tags=["AI Insights"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ─── Schemas ──────────────────────────────────────────────────────────────────
class RequirementInput(BaseModel):
    requirement: str

class DefectInput(BaseModel):
    description: str

class ModuleInput(BaseModel):
    module_name: str

class FeatureInput(BaseModel):
    feature: str


# ─── Generate Test Cases from Requirement ─────────────────────────────────────
@router.post("/generate-testcases")
def generate_testcases(
    payload: RequirementInput,
    user: dict = Depends(get_current_user)
):
    cases = generate_test_cases(payload.requirement)
    return {
        "requirement": payload.requirement,
        "generated_testcases": cases,
        "count": len(cases)
    }


# ─── Analyze Defect ───────────────────────────────────────────────────────────
@router.post("/analyze-defect")
def analyze_defect_route(
    payload: DefectInput,
    user: dict = Depends(get_current_user)
):
    result = analyze_defect(payload.description)
    return {
        "defect_description": payload.description,
        **result
    }


# ─── Risk Analysis — uses real DB data ────────────────────────────────────────
@router.get("/risk-analysis")
def risk_analysis(
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    projects = db.query(models.Project).all()
    results = []

    for project in projects:
        defect_count = db.query(models.Defect).filter(
            models.Defect.project_id == project.id
        ).count()

        test_count = db.query(models.TestCase).filter(
            models.TestCase.project_id == project.id
        ).count()

        risk = calculate_risk_score(project.name, defect_count, test_count)
        results.append(risk)

    results.sort(key=lambda x: x["risk_score"], reverse=True)
    return {"risk_analysis": results}


# ─── Test Summary — uses real DB data ─────────────────────────────────────────
@router.get("/test-summary")
def test_summary(
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    total = db.query(models.TestCase).count()
    total_defects = db.query(models.Defect).count()
    open_defects = db.query(models.Defect).filter(models.Defect.status == "Open").count()
    total_projects = db.query(models.Project).count()

    return {
        "total_testcases": total,
        "total_defects": total_defects,
        "open_defects": open_defects,
        "total_projects": total_projects,
        "health_score": f"{max(0, 100 - (open_defects * 5))}%"
    }


# ─── Defect Patterns ──────────────────────────────────────────────────────────
@router.get("/defect-patterns")
def defect_patterns(
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    defects = db.query(models.Defect).all()

    critical = sum(1 for d in defects if d.severity == "Critical")
    high = sum(1 for d in defects if d.severity == "High")
    medium = sum(1 for d in defects if d.severity == "Medium")
    low = sum(1 for d in defects if d.severity == "Low")
    open_count = sum(1 for d in defects if d.status == "Open")

    patterns = []
    if critical > 0:
        patterns.append(f"{critical} Critical defects need immediate attention")
    if high > 0:
        patterns.append(f"{high} High severity defects detected")
    if open_count > len(defects) * 0.5:
        patterns.append("More than 50% of defects are still open")
    if not patterns:
        patterns.append("No critical patterns detected — system looks healthy!")

    return {
        "total_defects": len(defects),
        "severity_breakdown": {
            "Critical": critical,
            "High": high,
            "Medium": medium,
            "Low": low
        },
        "patterns": patterns
    }


# ─── Recommend Tests ──────────────────────────────────────────────────────────
@router.post("/recommend-tests")
def recommend_tests(
    payload: FeatureInput,
    user: dict = Depends(get_current_user)
):
    tests = generate_test_cases(payload.feature)
    return {
        "feature": payload.feature,
        "recommended_tests": tests
    }