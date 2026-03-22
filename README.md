# 🧪 AI-Driven QA Management & Analytics Platform

![CI Pipeline](https://github.com/Anilchauhan546/AI-QA-Platform/actions/workflows/ci.yml/badge.svg)
![Python](https://img.shields.io/badge/Python-3.10-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green)
![React](https://img.shields.io/badge/React-18-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)
![Docker](https://img.shields.io/badge/Docker-Compose-blue)

A production-ready full-stack QA management platform enhanced with AI-driven insights. Built as part of the Executive Capstone Project.

---

## 📌 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [API Documentation](#api-documentation)
- [AI Features](#ai-features)
- [CI/CD Pipeline](#cicd-pipeline)
- [Project Structure](#project-structure)

---

## 🎯 Overview

QAMatrix is a centralized QA lifecycle management platform that enables teams to:
- Manage projects, test cases, and defects in one place
- Track test execution and quality metrics in real time
- Leverage AI for risk prediction, test generation, and defect analysis
- Deploy with a single Docker command

---

## ✅ Features

| Module | Description |
|---|---|
| 🔐 Auth & RBAC | JWT-based login with role enforcement (Admin, QA_Manager, Tester, User) |
| 📁 Projects | Create and manage QA projects and test cycles |
| 🧪 Test Cases | Repository with CRUD operations linked to projects |
| 🐛 Defects | Full defect lifecycle — log, track, resolve |
| 🤖 AI Insights | Risk prediction, test generation, defect analysis |
| 👥 Users | Team management with role assignment |
| 📊 Dashboard | Live metrics from real backend data |

---

## 🛠 Tech Stack

**Backend:** Python 3.10, FastAPI, SQLAlchemy, PostgreSQL 15, JWT, Scikit-learn

**Frontend:** React 18 (Vite), Plain CSS, Canvas API

**DevOps:** Docker + Docker Compose, GitHub Actions CI/CD, Pytest

---

## 🚀 Quick Start

### Prerequisites
- Docker Desktop installed and running

### Run with single command

```bash
git clone https://github.com/Anilchauhan546/AI-QA-Platform.git
cd AI-QA-Platform
docker-compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| Swagger Docs | http://localhost:8000/docs |

### First time setup
1. Go to http://localhost:8000/docs
2. Register a user via `/auth/register`
3. Login at http://localhost:5173

---

## 📖 API Documentation

Full API docs available at **http://localhost:8000/docs**

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | /auth/register | Register new user | Public |
| POST | /auth/login | Login & get JWT token | Public |
| GET | /projects/ | Get all projects | Required |
| POST | /projects/ | Create project | Admin/QA_Manager |
| GET | /testcases/ | Get all test cases | Required |
| POST | /testcases/ | Create test case | Admin/QA_Manager/Tester |
| GET | /defects/ | Get all defects | Required |
| POST | /defects/ | Log a defect | Admin/QA_Manager/Tester |
| GET | /ai/risk-analysis | AI risk scores | Required |
| POST | /ai/generate-testcases | Generate test cases | Required |
| POST | /ai/analyze-defect | Analyze defect severity | Required |
| GET | /ai/test-summary | Platform health summary | Required |

---

## 🤖 AI Features

### Risk Prediction
- Calculates risk score per project based on defect/test ratio
- Categorizes as High / Medium / Low with recommendations

### Test Case Generation
- Generates test cases from plain English requirements
- Covers positive, negative, boundary, performance, security scenarios

### Defect Severity Analysis
- Predicts severity (Critical / High / Medium / Low)
- Provides confidence score and remediation suggestions

### Defect Pattern Detection
- Analyzes defect distribution across severity levels
- Platform health score calculation

---

## ⚙️ CI/CD Pipeline

GitHub Actions runs on every push to main:
- ✅ Backend — FastAPI unit tests
- ✅ Frontend — React build check
- ✅ Docker — Build & Compose validation

---

## 📁 Project Structure

```
AI-QA-Platform/
├── docker-compose.yml
├── .github/workflows/ci.yml
├── Backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       ├── main.py
│       ├── database.py
│       ├── models.py
│       ├── schemas.py
│       ├── Routes/
│       │   ├── auth.py
│       │   ├── projects.py
│       │   ├── testcases.py
│       │   ├── defects.py
│       │   ├── users.py
│       │   └── ai.py
│       ├── services/ai_engine.py
│       └── tests/test_main.py
└── frontendd/
    └── src/
        ├── App.jsx
        ├── api/api.js
        ├── components/
        ├── pages/
        └── styles/
```

---

## 👥 Team
Built as part of FDP Capstone Project under the guidance of **Prof. Kishore**

## 📄 License
MIT License
