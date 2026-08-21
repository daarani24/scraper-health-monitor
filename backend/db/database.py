import sqlite3
import json
from datetime import datetime

DB_PATH = "health_monitor.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            collector_name TEXT,
            product_name TEXT,
            overall_confidence REAL,
            issues TEXT,
            timestamp TEXT
        )
    """)
    conn.commit()
    conn.close()

def save_event(collector_name, product_name, overall_confidence, issues):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO events (collector_name, product_name, overall_confidence, issues, timestamp)
        VALUES (?, ?, ?, ?, ?)
    """, (collector_name, product_name, overall_confidence, json.dumps(issues), datetime.utcnow().isoformat()))
    conn.commit()
    conn.close()

def get_recent_events(limit=50):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM events ORDER BY id DESC LIMIT ?", (limit,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

def get_collector_stats(collector_name):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        SELECT AVG(overall_confidence), COUNT(*) FROM events WHERE collector_name = ?
    """, (collector_name,))
    avg_confidence, total_checks = cursor.fetchone()
    conn.close()
    return {
        "average_confidence": round(avg_confidence, 2) if avg_confidence else 0,
        "total_checks": total_checks
    }