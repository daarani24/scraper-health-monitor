def compare_records(old_record: dict, new_record: dict):
    changes = []
    all_keys = set(old_record.keys()) | set(new_record.keys())

    for key in all_keys:
        old_val = old_record.get(key, "MISSING")
        new_val = new_record.get(key, "MISSING")

        if old_val != new_val:
            changes.append({
                "field": key,
                "before": old_val,
                "after": new_val,
                "status": "recovered" if old_val == "MISSING" and new_val != "MISSING"
                          else "broke" if new_val == "MISSING"
                          else "changed"
            })

    return changes