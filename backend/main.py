from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from health_checks.validator import validate_record
from confidence.scorer import calculate_record_confidence
from models.schemas import EXPECTED_SCHEMA
from self_heal.trigger import trigger_rerun
from self_heal.diff import compare_records
from db.database import init_db, save_event, get_recent_events, get_collector_stats

app = FastAPI(title="Scraper Health Monitor API")

init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "Scraper Health Monitor API running"}

@app.post("/check/{collector_name}")
def check_records(collector_name: str, records: list[dict]):
    if collector_name not in EXPECTED_SCHEMA:
        return {"error": f"No schema defined for collector: {collector_name}"}

    schema = EXPECTED_SCHEMA[collector_name]
    results = []

    for record in records:
        issues = validate_record(record, schema)
        confidence = calculate_record_confidence(record, schema)

        display_name = record.get("product_name") or record.get("book_title") or "unknown"
        result = {
            "product_name": display_name,
            "issues": issues,
            "confidence": confidence,
        }
        
        results.append(result)
        save_event(collector_name, result["product_name"], result["confidence"]["overall_confidence"], result["issues"])

    avg_confidence = sum(r["confidence"]["overall_confidence"] for r in results) / len(results) if results else 0

    return {
        "collector": collector_name,
        "records_checked": len(results),
        "average_confidence": round(avg_confidence, 2),
        "results": results,
    }

@app.post("/heal/{collector_id}")
def heal_collector(collector_id: str, url: str, old_records: list[dict]):
    rerun_result = trigger_rerun(collector_id, url)

    if not rerun_result["success"]:
        return {"status": "failed", "error": rerun_result["error"]}

    new_records = rerun_result["output"]

    diff = compare_records(old_records[0], new_records[0]) if old_records and new_records else []

    return {
        "status": "healed",
        "collector_id": collector_id,
        "diff": diff,
        "new_records": new_records
    }

@app.get("/events")
def get_events():
    return {"events": get_recent_events()}

@app.get("/stats/{collector_name}")
def get_stats(collector_name: str):
    return get_collector_stats(collector_name)