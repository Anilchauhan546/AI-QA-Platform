from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi

from .database import engine
from . import models
from .Routes import auth, projects, testcases, defects, users, ai

# ─── Create Tables ────────────────────────────────────────────────────────────
models.Base.metadata.create_all(bind=engine)

# ─── App ──────────────────────────────────────────────────────────────────────
app = FastAPI(title="AI QA Platform")

# ─── CORS ─────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ──────────────────────────────────────────────────────────────────
app.include_router(auth.router,      prefix="/auth", tags=["Authentication"])
app.include_router(projects.router)
app.include_router(testcases.router)
app.include_router(defects.router)
app.include_router(users.router)
app.include_router(ai.router)


# ─── Home ─────────────────────────────────────────────────────────────────────
@app.get("/")
def home():
    return {"msg": "AI QA Platform Running"}


# ─── Custom OpenAPI ───────────────────────────────────────────────────────────
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title="AI QA Platform",
        version="1.0.0",
        description="API with JWT Bearer Authentication",
        routes=app.routes,
    )

    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
        }
    }

    public_routes = ["/auth/register", "/auth/login", "/"]
    for path, methods in openapi_schema["paths"].items():
        if path not in public_routes:
            for method in methods.values():
                method["security"] = [{"BearerAuth": []}]

    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi