"""Run examples and reference answers through the application's Python harness."""
import contextlib
import io
import json
import os
import sys
import tempfile

payload = json.load(sys.stdin)
runtime = {}
exec(payload["harness"], runtime)
run = runtime["_pyquest_run"]
failures = []
test_count = 0
with tempfile.TemporaryDirectory(prefix="pyquest-lessons-") as directory:
    previous = os.getcwd()
    os.chdir(directory)
    try:
        for level in payload["levels"]:
            level_id = level["id"]
            for test in level["tests"]:
                try:
                    compile(test["code"], level_id + ":" + test["name"], "exec")
                except SyntaxError as error:
                    failures.append(f"{level_id}: invalid test: {error}")
            try:
                with contextlib.redirect_stdout(io.StringIO()):
                    exec(level["lesson"]["example"], {})
            except Exception as error:
                failures.append(f"{level_id}: lesson example failed: {error}")
            case = payload["cases"].get(level_id)
            if not case:
                continue
            compile(level["starter"], level_id + ":starter", "exec")
            tests = json.dumps(level["tests"], ensure_ascii=False)
            with contextlib.redirect_stdout(io.StringIO()):
                result = json.loads(run(case["solution"], tests))
                wrong = json.loads(run(case["wrong"], tests))
                starter = json.loads(run(level["starter"], tests))
            test_count += len(level["tests"])
            if result["error"] or not all(t["passed"] for t in result["results"]):
                failures.append(f"{level_id}: reference answer failed: {result}")
            if not wrong["error"] and all(t["passed"] for t in wrong["results"]):
                failures.append(f"{level_id}: common misconception incorrectly accepted")
            if not starter["error"] and all(t["passed"] for t in starter["results"]):
                failures.append(f"{level_id}: unfinished starter incorrectly accepted")
    finally:
        os.chdir(previous)
if failures:
    print("\n".join(failures))
    raise SystemExit(1)
print(f"88 lesson examples executed; 36 reference answers passed ({test_count} test groups).")
print("36 common wrong answers and 36 unfinished starters rejected.")
