import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# ─── Database URL ─────────────────────────────────────────────────────────────
# Reads from environment variable (set in docker-compose or .env)
# Falls back to SQLite for local development without Docker
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./test.db"  # fallback for local dev
)

# ─── Engine ───────────────────────────────────────────────────────────────────
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(DATABASE_URL)

# ─── Session ──────────────────────────────────────────────────────────────────
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

# ─── Base ─────────────────────────────────────────────────────────────────────
Base = declarative_base()