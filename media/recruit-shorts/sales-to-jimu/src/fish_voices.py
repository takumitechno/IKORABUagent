"""List Fish Audio voice models to pick FISH_VOICE_ID (Japanese by default).

  FISH_API_KEY=... python3 fish_voices.py            # top Japanese voices
  FISH_API_KEY=... python3 fish_voices.py 男性 ナレーション   # filter by title keywords
"""
import json
import os
import sys
import urllib.parse
import urllib.request


def search(title="", language="ja", page_size=30):
    q = {"page_size": page_size, "page_number": 1, "language": language, "sort_by": "score"}
    if title:
        q["title"] = title
    req = urllib.request.Request("https://api.fish.audio/model?" + urllib.parse.urlencode(q),
                                 headers={"Authorization": f"Bearer {os.environ['FISH_API_KEY']}"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.load(r).get("items", [])


if __name__ == "__main__":
    words = sys.argv[1:] or [""]
    seen = set()
    for w in words:
        for m in search(w):
            if m["_id"] in seen:
                continue
            seen.add(m["_id"])
            tags = ",".join(m.get("tags") or [])[:40]
            print(f"{m['_id']}  {m.get('title', '')[:30]:<30}  likes={m.get('like_count', 0):<6} tags={tags}")
