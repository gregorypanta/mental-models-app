from fastapi import FastAPI, APIRouter, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from seed_data import SECTIONS, MODELS, INTRODUCTION, CONCLUSION

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")


# Pydantic models
class SectionOut(BaseModel):
    model_config = ConfigDict(extra="ignore")
    index: int
    name: str
    slug: str
    short_name: str
    description: str
    icon: str
    model_count: int


class MentalModelOut(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    section_index: int
    section_slug: str
    section_name: str
    model_index: int
    title: str
    explanation: str
    example: str
    ai_prompt: str


class JournalEntry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    content: str
    model_title: Optional[str] = None
    section_slug: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class JournalEntryCreate(BaseModel):
    content: str
    model_title: Optional[str] = None
    section_slug: Optional[str] = None


# Seed database on startup
@app.on_event("startup")
async def seed_database():
    count = await db.mental_models.count_documents({})
    if count == 0:
        logging.info("Seeding mental models...")
        section_map = {s["index"]: s for s in SECTIONS}
        docs = []
        for m in MODELS:
            sec = section_map[m["section_index"]]
            docs.append({
                "id": str(uuid.uuid4()),
                "section_index": m["section_index"],
                "section_slug": sec["slug"],
                "section_name": sec["short_name"],
                "model_index": m["model_index"],
                "title": m["title"],
                "explanation": m["explanation"],
                "example": m["example"],
                "ai_prompt": m["ai_prompt"],
            })
        await db.mental_models.insert_many(docs)
        logging.info(f"Seeded {len(docs)} mental models.")

    sec_count = await db.sections.count_documents({})
    if sec_count == 0:
        logging.info("Seeding sections...")
        await db.sections.insert_many([{**s} for s in SECTIONS])
        logging.info(f"Seeded {len(SECTIONS)} sections.")


# API Routes
@api_router.get("/")
async def root():
    return {"message": "AI-Powered Mind API"}


@api_router.get("/sections", response_model=List[SectionOut])
async def get_sections():
    sections = await db.sections.find({}, {"_id": 0}).sort("index", 1).to_list(100)
    return sections


@api_router.get("/models", response_model=List[MentalModelOut])
async def get_models(
    section: Optional[str] = Query(None, description="Filter by section slug"),
    search: Optional[str] = Query(None, description="Search query"),
    limit: int = Query(300, ge=1, le=500),
):
    query = {}
    if section:
        query["section_slug"] = section
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"explanation": {"$regex": search, "$options": "i"}},
            {"example": {"$regex": search, "$options": "i"}},
        ]
    models = await db.mental_models.find(query, {"_id": 0}).sort(
        [("section_index", 1), ("model_index", 1)]
    ).to_list(limit)
    return models


@api_router.get("/models/{section_slug}/{model_index}", response_model=MentalModelOut)
async def get_model(section_slug: str, model_index: int):
    model = await db.mental_models.find_one(
        {"section_slug": section_slug, "model_index": model_index}, {"_id": 0}
    )
    if not model:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Model not found")
    return model


@api_router.get("/introduction")
async def get_introduction():
    return INTRODUCTION


@api_router.get("/conclusion")
async def get_conclusion():
    return CONCLUSION


@api_router.get("/journal", response_model=List[JournalEntry])
async def get_journal_entries():
    entries = await db.journal_entries.find({}, {"_id": 0}).sort("created_at", -1).to_list(200)
    return entries


@api_router.post("/journal", response_model=JournalEntry, status_code=201)
async def create_journal_entry(entry: JournalEntryCreate):
    journal = JournalEntry(**entry.model_dump())
    doc = journal.model_dump()
    await db.journal_entries.insert_one(doc)
    return journal


@api_router.delete("/journal/{entry_id}")
async def delete_journal_entry(entry_id: str):
    result = await db.journal_entries.delete_one({"id": entry_id})
    if result.deleted_count == 0:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Entry not found")
    return {"status": "deleted"}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
