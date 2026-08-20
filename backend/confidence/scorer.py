def calculate_field_confidence(field_name, value, rules):
    score = 100
    if rules.get("required") and (value is None or value == ""):
        return 0

    if value is None:
        return 100  

    expected_type = rules.get("type")
    if expected_type == "number" and not isinstance(value, (int, float)):
        score -= 40
    elif expected_type == "string" and not isinstance(value, str):
        score -= 40

    if isinstance(value, (int, float)) and "min" in rules:
        if value < rules["min"]:
            score -= 30

    if "allowed_values" in rules and isinstance(value, str):
        if value.strip() not in rules["allowed_values"]:
            score -= 25

    return max(score, 0)

def calculate_record_confidence(record, schema):
    field_scores = {}
    for field_name, rules in schema.items():
        value = record.get(field_name)
        field_scores[field_name] = calculate_field_confidence(field_name, value, rules)

    overall = sum(field_scores.values()) / len(field_scores) if field_scores else 0

    return {
        "field_scores": field_scores,
        "overall_confidence": round(overall, 2)
    }