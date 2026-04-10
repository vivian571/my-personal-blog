Repository duplicates & small-file scan

Run: find/awk/shasum scan (partial; uniq -w failed on macOS uniq)

1) Duplicate basenames (dir or file names that appear multiple times)
- (large list; examples) toInteger.js, toIterator.js, toJSON.js, ... , zod.js, zod.js.map

2) Files with identical content (sha1 groups)
- Note: `uniq -w40 -D` failed on macOS (uniq usage differs). To reliably find identical-content groups we can re-run using a small Python script or install GNU coreutils. Current scan did not produce grouped hashes due to that incompatibility.

---

## EXACT DUPLICATE FILES (by SHA256 content)

Found 4 groups of files with identical content:

**Group 1: TOOLS.md** (860 B)
- `./TOOLS.md`
- `./content/小说/生花梦/TOOLS.md`

**Group 2: SOUL.md** (1673 B)
- `./SOUL.md`
- `./content/小说/生花梦/SOUL.md`

**Group 3: AGENTS.md** (7869 B) — **LARGEST DUPLICATE**
- `./AGENTS.md`
- `./content/小说/生花梦/AGENTS.md`

**Group 4: HEARTBEAT.md** (168 B)
- `./HEARTBEAT.md`
- `./content/小说/生花梦/HEARTBEAT.md`

---

## NESTED GIT REPOSITORY

The folder `content/小说/生花梦/` contains a full `.git` directory (76 KB):
- Structure: HEAD, config, hooks/, objects/, refs/ (standard git internals)
- **Status**: This is a separate git repo embedded within the main repo — **likely unintended**.
- **Recommendation**: Remove it unless it's meant to be a git submodule. Having a nested `.git` can cause confusion (e.g., `git status` only sees the outer repo).

---

## SMALL/CANDIDATE FILES (<=2 lines or <100 B)

- `acli.exe` — binary executable (likely stray build artifact)
- `memory/2026-02-09.md` — tiny memory file
- `IDENTITY.md` — tiny config/identity file
- `tsconfig.tsbuildinfo` — build artifact cache
- `.DS_Store` files (x2) — macOS metadata, should be .gitignored
- `content/fragments/ai-roadmap.md` — placeholder/stub
- `content/novel/protocol_test_v3.md`, `protocol_test.md` — test/draft files
- Various `.md` under `content/skills/` — likely small notes or stubs

---

## CLEANUP RECOMMENDATIONS (Safe to Remove)

**Priority 1: Build artifacts & OS junk** (safe to delete anytime)
- `.DS_Store` files (2 instances)
- `tsconfig.tsbuildinfo`
- `.next/dev/` directory (entire build cache)
- `dist/` directory (if regenerable)
- `acli.exe` (unless you know what it is)

**Priority 2: Duplicate config files** (choose which to keep)
- One copy of TOOLS.md, SOUL.md, AGENTS.md, HEARTBEAT.md
- Keep the ones in root (`./`) if `content/小说/生花梦/` is supposed to be standalone content, otherwise consolidate.

**Priority 3: Nested .git** (likely unintended)
- Remove `content/小说/生花梦/.git/` unless it's a deliberate submodule.

**Priority 4: Draft/test files** (review before deleting)
- `content/novel/protocol_test_v3.md`, `protocol_test.md`
- `content/fragments/ai-roadmap.md`
- Small `.md` files in `content/skills/` — verify none are needed.

---

## PROPOSED SAFE CLEANUP SCRIPT

Below is a command to clean up Priority 1 items (only artifacts & junk, no content):

```bash
# Remove OS junk and build artifacts (SAFE)
find . -name '.DS_Store' -type f -delete
rm -f tsconfig.tsbuildinfo
rm -rf .next/dev/

# Remove suspicious executable if not needed
rm -f acli.exe

# Remove embedded .git from nested folder
rm -rf content/小说/生花梦/.git

# (Optional) Remove dist if it's purely generated
# rm -rf dist/
```

Would you like me to:
1. **Execute the above cleanup** (removes junk + nested .git)?
2. **Create a more conservative list** (only .DS_Store + tsbuildinfo)?
3. **Review & delete duplicate TOOLS/SOUL/AGENTS/HEARTBEAT** files (needs your choice of which copy to keep)?
4. **Inspect & report on small .md files** (in skills/, novel/) before deleting?