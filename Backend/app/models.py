from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String,unique=True)
    password = Column(String)
    role = Column(String)


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)

    testcases = relationship("TestCase", back_populates="project")
    defects = relationship("Defect", back_populates="project")


class TestCase(Base):
    __tablename__ = "testcases"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    steps = Column(String)
    expected = Column(String)

    project_id = Column(Integer, ForeignKey("projects.id"))

    project = relationship("Project", back_populates="testcases")


class Defect(Base):
    __tablename__ = "defects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    severity = Column(String)
    status = Column(String)

    project_id = Column(Integer, ForeignKey("projects.id"))

    project = relationship("Project", back_populates="defects")
