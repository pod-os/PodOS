from pathlib import Path
import yaml


def _parse_post(path):
    _, frontmatter, body = path.read_text(encoding="utf-8").split("---", 2)
    meta = yaml.safe_load(frontmatter) or {}
    date = meta.get("date")
    created = date.get("created") if isinstance(date, dict) else date
    if not created:
        return None
    title = next((l.lstrip("# ") for l in body.splitlines() if l.startswith("# ")), path.stem)
    return {"title": title.strip(), "date": str(created)}


def on_config(config):
    posts_dir = Path(config["docs_dir"]) / "blog" / "posts"
    posts = filter(None, (_parse_post(p) for p in posts_dir.rglob("*.md")))
    latest = max(posts, key=lambda p: p["date"], default=None)
    config.setdefault("extra", {})["latest_blog_post"] = latest
