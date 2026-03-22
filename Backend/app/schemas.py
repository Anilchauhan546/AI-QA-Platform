from pydantic import BaseModel


class UserCreate(BaseModel):
    username: str
    password: str
    role: str


class ProjectCreate(BaseModel):
    name: str
    description: str


class TestCaseCreate(BaseModel):
    title: str
    steps: str
    expected: str
    project_id: int


class DefectCreate(BaseModel):
    title: str
    severity: str
    status: str
    project_id: int
