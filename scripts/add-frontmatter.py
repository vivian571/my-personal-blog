#!/usr/bin/env python3
"""
Add basic frontmatter to markdown files that lack it.
- title: from filename (no ext)
- slug: filename (no ext)
- date: file mtime ISO

Usage:
  python scripts/add-frontmatter.py --dir content/小说 --dry-run
  python scripts/add-frontmatter.py --dir content/小说 --apply
"""
import argparse
from pathlib import Path
import datetime
import sys

HEADER = "---\n{fields}\n---\n\n"

def has_frontmatter(text: str) -> bool:
    s = text.lstrip()
    return s.startswith('---')


def make_frontmatter(title: str, slug: str, date_iso: str) -> str:
    fields = f"title: \"{title}\"\nslug: \"{slug}\"\ndate: \"{date_iso}\""
    return HEADER.format(fields=fields)


def process_file(p: Path, apply: bool) -> bool:
    text = p.read_text(encoding='utf-8')
    if has_frontmatter(text):
        return False
    title = p.stem
    slug = p.stem
    mtime = datetime.datetime.fromtimestamp(p.stat().st_mtime, datetime.timezone.utc).isoformat()
    fm = make_frontmatter(title, slug, mtime)
    new_text = fm + text
    if apply:
        p.write_text(new_text, encoding='utf-8')
    return True


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--dir', default='content/小说', help='Directory to scan')
    parser.add_argument('--apply', action='store_true', help='Actually write changes')
    args = parser.parse_args()

    root = Path(args.dir)
    if not root.exists():
        print(f"Directory not found: {root}")
        sys.exit(1)

    md_files = list(root.rglob('*.md'))
    if not md_files:
        print('No markdown files found.')
        return

    changed = []
    for p in md_files:
        try:
            did = process_file(p, apply=args.apply)
            if did:
                changed.append(str(p))
        except Exception as e:
            print(f"Error processing {p}: {e}")

    if args.apply:
        print(f"Applied frontmatter to {len(changed)} files")
    else:
        print(f"Would apply frontmatter to {len(changed)} files (dry run). Use --apply to write changes)")
    for c in changed[:200]:
        print(' -', c)

if __name__ == '__main__':
    main()
