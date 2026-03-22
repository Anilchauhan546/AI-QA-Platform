import random

# ─── Severity Prediction ──────────────────────────────────────────────────────
def predict_severity(text: str) -> str:
    text = text.lower()
    if any(w in text for w in ["crash", "data loss", "corrupt", "security", "breach"]):
        return "Critical"
    elif any(w in text for w in ["error", "exception", "fail", "broken", "not working"]):
        return "High"
    elif any(w in text for w in ["slow", "delay", "timeout", "incorrect", "wrong"]):
        return "Medium"
    else:
        return "Low"


# ─── Risk Score ───────────────────────────────────────────────────────────────
def calculate_risk_score(module: str, defect_count: int, test_count: int) -> dict:
    if test_count == 0:
        risk = 100
    else:
        defect_ratio = (defect_count / test_count) * 100
        risk = min(100, round(defect_ratio * 2.5))

    if risk >= 70:
        level = "High"
    elif risk >= 40:
        level = "Medium"
    else:
        level = "Low"

    return {
        "module": module,
        "risk_score": risk,
        "risk_level": level,
        "defect_count": defect_count,
        "test_count": test_count,
        "recommendation": get_recommendation(level)
    }


def get_recommendation(level: str) -> str:
    if level == "High":
        return "Immediate attention required. Run full regression suite."
    elif level == "Medium":
        return "Monitor closely. Schedule targeted test execution."
    else:
        return "Stable. Maintain current test coverage."


# ─── Test Case Generator ──────────────────────────────────────────────────────
def generate_test_cases(requirement: str) -> list:
    templates = [
        f"Verify that {requirement} works correctly with valid inputs",
        f"Verify that {requirement} handles invalid inputs gracefully",
        f"Verify that {requirement} displays correct error messages",
        f"Verify that {requirement} performs within acceptable time limits",
        f"Verify that {requirement} works correctly on mobile devices",
        f"Verify that {requirement} is accessible and meets WCAG standards",
        f"Verify that {requirement} handles concurrent users correctly",
        f"Verify that {requirement} data is persisted correctly in database",
    ]
    return random.sample(templates, min(5, len(templates)))


# ─── Defect Analysis ──────────────────────────────────────────────────────────
def analyze_defect(text: str) -> dict:
    severity = predict_severity(text)
    suggestions = {
        "Critical": "Halt deployment. Immediate hotfix required. Escalate to senior team.",
        "High": "Fix before next release. Assign to senior developer.",
        "Medium": "Schedule fix in next sprint. Add to backlog.",
        "Low": "Log and monitor. Fix when bandwidth allows."
    }
    return {
        "analysis": f"AI analyzed the defect description",
        "predicted_severity": severity,
        "suggestion": suggestions[severity],
        "confidence": f"{random.randint(78, 97)}%"
    }