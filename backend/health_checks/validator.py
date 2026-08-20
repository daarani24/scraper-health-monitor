def validate_field(field_name, value, rules):
    issues = []
    if rules.get("required") and (value is None or value == ""):
        issues.append(f"Missing required field: {field_name}")
        return issues  

    if value is None:
        return issues  

    expected_type = rules.get("type")
    if expected_type == "number":
        if not isinstance(value, (int, float)):
            issues.append(f"{field_name} should be a number, got: {type(value).__name__}")
    elif expected_type == "string":
        if not isinstance(value, str):
            issues.append(f"{field_name} should be text, got: {type(value).__name__}")

    if isinstance(value, (int, float)) and "min" in rules:
        if value < rules["min"]:
            issues.append(f"{field_name} value {value} is below minimum {rules['min']}")

    if "allowed_values" in rules and isinstance(value, str):
        if value.strip() not in rules["allowed_values"]:
            issues.append(f"{field_name} has unexpected value: '{value}' (possible garbage/duplicate text)")
    return issues

def validate_record(record, schema):
    all_issues = {}
    for field_name, rules in schema.items():
        value = record.get(field_name)
        field_issues = validate_field(field_name, value, rules)
        if field_issues:
            all_issues[field_name] = field_issues
    return all_issues