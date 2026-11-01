#!/bin/bash
cd "$(dirname "$0")"
echo "PyQuest is starting at http://localhost:8765"
echo "Keep this window open while playing. Close it to stop."
open http://localhost:8765
python3 -m http.server 8765
