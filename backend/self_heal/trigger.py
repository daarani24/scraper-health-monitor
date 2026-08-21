import subprocess
import json
import platform

def trigger_rerun(collector_id: str, url: str):
    try:
       
        is_windows = platform.system() == "Windows"

        result = subprocess.run(
            ["bdata", "scraper", "run", collector_id, url, "--pretty"],
            capture_output=True,
            text=True,
            timeout=300,
            shell=is_windows 
        )
        if result.returncode == 0:
            return {"success": True, "output": json.loads(result.stdout)}
        else:
            return {"success": False, "error": result.stderr or "Unknown error, non-zero exit code"}
    except json.JSONDecodeError:
        return {"success": False, "error": "Failed to parse scraper output as JSON"}
    except Exception as e:
        return {"success": False, "error": str(e)}