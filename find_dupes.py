#!/usr/bin/env python3
import os
import hashlib
from collections import defaultdict

skip_dirs = {'.git', 'node_modules', 'public', '.next', 'dist', '__pycache__'}
hash_to_files = defaultdict(list)

for dirpath, dirnames, filenames in os.walk('.'):
    dirnames[:] = [d for d in dirnames if d not in skip_dirs]
    for fn in filenames:
        fp = os.path.join(dirpath, fn)
        try:
            with open(fp, 'rb') as f:
                h = hashlib.sha256(f.read()).hexdigest()
            hash_to_files[h].append(fp)
        except:
            pass

dupes = {h: f for h, f in hash_to_files.items() if len(f) > 1}
print(f'Found {len(dupes)} duplicate content groups\n')

if dupes:
    for i, (_, files) in enumerate(sorted(dupes.items()), 1):
        print(f'Group {i}: ({len(files)} files)')
        for f in sorted(files):
            size = os.path.getsize(f) if os.path.exists(f) else 0
            print(f'  {f} ({size} B)')
        print()
