from fastapi import FastAPI, APIRouter, Query, HTTPException
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware  # Χρησιμοποίησε αυτό το import
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import uuid
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from datetime import datetime, timezone
from seed_data import SECTIONS, MODELS, INTRODUCTION, CONCLUSION

# 1. Φόρτωση ρυθμίσεων
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# 2. Αρχικοποίηση Εφαρμογής (ΜΟΝΟ ΜΙΑ ΦΟΡΑ)
app = FastAPI()

# 3. Ρύθμιση CORS (ΜΟΝΟ ΜΙΑ ΦΟΡΑ)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. Σύνδεση με τη Βάση
mongo_url = os.environ.get('MONGO_URL', 'mongodb://127.0.0.1:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'ai_powered_mind')]

# 5. Router
api_router = APIRouter(prefix="/api")

# ΣΥΝΕΧΙΖΕΙΣ ΜΕ ΤΑ PYDANTIC MODELS ΣΟΥ...


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


# --- 30-Day Challenge Models ---
class ChallengeCreate(BaseModel):
    model_ids: List[str]  # 5 model IDs to practice


class ChallengeOut(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    model_ids: List[str]
    model_titles: List[str]
    model_slugs: List[str]
    model_indices: List[int]
    completed_days: List[int]
    started_at: str
    current_day: int
    streak: int
    is_active: bool


class ChallengeDayComplete(BaseModel):
    day: int
    reflection: Optional[str] = None


class ChallengeLogOut(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    challenge_id: str
    day: int
    reflection: Optional[str] = None
    completed_at: str


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


# ==================== API Routes ====================

@api_router.get("/")
async def root():
    return {"message": "AI-Powered Mind API"}


@api_router.get("/sections", response_model=List[SectionOut])
async def get_sections():
    sections = await db.sections.find({}, {"_id": 0}).sort("index", 1).to_list(100)
    return sections


@api_router.get("/models", response_model=List[MentalModelOut])
async def get_models(
    section: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
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
        raise HTTPException(status_code=404, detail="Model not found")
    return model


@api_router.get("/introduction")
async def get_introduction():
    return INTRODUCTION


@api_router.get("/conclusion")
async def get_conclusion():
    return CONCLUSION


# --- Daily Model ---
@api_router.get("/daily-model", response_model=MentalModelOut)
async def get_daily_model():
    now = datetime.now(timezone.utc)
    day_of_year = now.timetuple().tm_yday
    total = await db.mental_models.count_documents({})
    if total == 0:
        raise HTTPException(status_code=404, detail="No models found")
    # Deterministic daily rotation
    idx = day_of_year % total
    model = await db.mental_models.find({}, {"_id": 0}).sort(
        [("section_index", 1), ("model_index", 1)]
    ).skip(idx).limit(1).to_list(1)
    return model[0]


# --- Related Models ---
@api_router.get("/models/{section_slug}/{model_index}/related", response_model=List[MentalModelOut])
async def get_related_models(section_slug: str, model_index: int):
    model = await db.mental_models.find_one(
        {"section_slug": section_slug, "model_index": model_index}, {"_id": 0}
    )
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    # Find models with similar words in title
    title_words = [w for w in model["title"].split() if len(w) > 3]
    if not title_words:
        title_words = model["title"].split()[:2]
    or_conditions = [{"title": {"$regex": w, "$options": "i"}} for w in title_words[:3]]
    or_conditions.extend([{"explanation": {"$regex": w, "$options": "i"}} for w in title_words[:2]])
    related = await db.mental_models.find(
        {
            "$or": or_conditions,
            "$and": [
                {"$or": [
                    {"section_slug": {"$ne": section_slug}},
                    {"model_index": {"$ne": model_index}}
                ]}
            ]
        },
        {"_id": 0}
    ).limit(5).to_list(5)
    # If not enough, grab random from same section
    if len(related) < 3:
        extras = await db.mental_models.find(
            {"section_slug": section_slug, "model_index": {"$ne": model_index}},
            {"_id": 0}
        ).limit(5).to_list(5)
        existing_ids = {r["id"] for r in related}
        for e in extras:
            if e["id"] not in existing_ids and len(related) < 5:
                related.append(e)
    return related[:5]


# --- Journal ---
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
        raise HTTPException(status_code=404, detail="Entry not found")
    return {"status": "deleted"}


# --- 30-Day Challenge ---
@api_router.post("/challenge", status_code=201)
async def create_challenge(data: ChallengeCreate):
    if len(data.model_ids) != 5:
        raise HTTPException(status_code=400, detail="Exactly 5 models required")
    # Fetch model details
    models_found = await db.mental_models.find(
        {"id": {"$in": data.model_ids}}, {"_id": 0}
    ).to_list(5)
    if len(models_found) != 5:
        raise HTTPException(status_code=400, detail="One or more models not found")
    # Deactivate any existing active challenge
    await db.challenges.update_many({"is_active": True}, {"$set": {"is_active": False}})
    challenge = {
        "id": str(uuid.uuid4()),
        "model_ids": data.model_ids,
        "model_titles": [m["title"] for m in models_found],
        "model_slugs": [m["section_slug"] for m in models_found],
        "model_indices": [m["model_index"] for m in models_found],
        "completed_days": [],
        "started_at": datetime.now(timezone.utc).isoformat(),
        "streak": 0,
        "is_active": True,
    }
    await db.challenges.insert_one({**challenge})
    challenge["current_day"] = 1
    return challenge


@api_router.get("/challenge/active")
async def get_active_challenge():
    challenge = await db.challenges.find_one({"is_active": True}, {"_id": 0})
    if not challenge:
        return None
    # Calculate current day
    started = datetime.fromisoformat(challenge["started_at"])
    now = datetime.now(timezone.utc)
    current_day = min((now - started).days + 1, 30)
    challenge["current_day"] = current_day
    # Calculate streak
    completed = sorted(challenge.get("completed_days", []))
    streak = 0
    for d in range(current_day, 0, -1):
        if d in completed:
            streak += 1
        else:
            break
    challenge["streak"] = streak
    return challenge


@api_router.post("/challenge/complete-day")
async def complete_challenge_day(data: ChallengeDayComplete):
    challenge = await db.challenges.find_one({"is_active": True}, {"_id": 0})
    if not challenge:
        raise HTTPException(status_code=404, detail="No active challenge")
    if data.day < 1 or data.day > 30:
        raise HTTPException(status_code=400, detail="Day must be 1-30")
    completed = challenge.get("completed_days", [])
    if data.day not in completed:
        completed.append(data.day)
        await db.challenges.update_one(
            {"id": challenge["id"]},
            {"$set": {"completed_days": completed}}
        )
    # Save log entry
    log = {
        "id": str(uuid.uuid4()),
        "challenge_id": challenge["id"],
        "day": data.day,
        "reflection": data.reflection,
        "completed_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.challenge_logs.insert_one({**log})
    return {"status": "completed", "day": data.day, "total_completed": len(completed)}


@api_router.get("/challenge/logs")
async def get_challenge_logs(challenge_id: str):
    logs = await db.challenge_logs.find(
        {"challenge_id": challenge_id}, {"_id": 0}
    ).sort("day", 1).to_list(30)
    return logs


@api_router.delete("/challenge/{challenge_id}")
async def delete_challenge(challenge_id: str):
    await db.challenges.delete_one({"id": challenge_id})
    await db.challenge_logs.delete_many({"challenge_id": challenge_id})
    return {"status": "deleted"}


# --- Stats ---
@api_router.get("/stats")
async def get_stats():
    total_models = await db.mental_models.count_documents({})
    total_sections = await db.sections.count_documents({})
    total_journal = await db.journal_entries.count_documents({})
    active_challenge = await db.challenges.find_one({"is_active": True}, {"_id": 0})
    challenge_progress = 0
    if active_challenge:
        challenge_progress = len(active_challenge.get("completed_days", []))
    return {
        "total_models": total_models,
        "total_sections": total_sections,
        "total_journal_entries": total_journal,
        "challenge_progress": challenge_progress,
        "challenge_active": active_challenge is not None,
    }


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
