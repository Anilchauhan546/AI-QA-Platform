import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import Base
from app.Routes.projects import get_db

TEST_DATABASE_URL = "sqlite:///./test_ci.db"
engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base.metadata.create_all(bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

def test_register_user():
    res = client.post("/auth/register", json={"username": "testuser", "password": "test123", "role": "Tester"})
    assert res.status_code == 201

def test_register_duplicate_user():
    client.post("/auth/register", json={"username": "dupuser", "password": "test123", "role": "Tester"})
    res = client.post("/auth/register", json={"username": "dupuser", "password": "test123", "role": "Tester"})
    assert res.status_code == 400

def test_login_success():
    client.post("/auth/register", json={"username": "loginuser", "password": "test123", "role": "Admin"})
    res = client.post("/auth/login", data={"username": "loginuser", "password": "test123"})
    assert res.status_code == 200
    assert "access_token" in res.json()

def test_login_wrong_password():
    res = client.post("/auth/login", data={"username": "loginuser", "password": "wrongpass"})
    assert res.status_code == 401

def get_admin_token():
    client.post("/auth/register", json={"username": "adminuser", "password": "admin123", "role": "Admin"})
    res = client.post("/auth/login", data={"username": "adminuser", "password": "admin123"})
    return res.json()["access_token"]

def test_create_project():
    token = get_admin_token()
    res = client.post("/projects/", json={"name": "Test Project", "description": "A test project"}, headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200
    assert res.json()["name"] == "Test Project"

def test_get_projects():
    token = get_admin_token()
    res = client.get("/projects/", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200
    assert isinstance(res.json(), list)

def test_get_projects_unauthorized():
    res = client.get("/projects/")
    assert res.status_code == 401

def test_ai_generate_testcases():
    token = get_admin_token()
    res = client.post("/ai/generate-testcases", json={"requirement": "user login"}, headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200
    assert "generated_testcases" in res.json()

def test_ai_analyze_defect():
    token = get_admin_token()
    res = client.post("/ai/analyze-defect", json={"description": "App crashes on login"}, headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200
    assert "predicted_severity" in res.json()

def test_ai_risk_analysis():
    token = get_admin_token()
    res = client.get("/ai/risk-analysis", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200
    assert "risk_analysis" in res.json()

def test_ai_test_summary():
    token = get_admin_token()
    res = client.get("/ai/test-summary", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200
    assert "health_score" in res.json()