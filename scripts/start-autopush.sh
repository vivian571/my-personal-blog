#!/bin/bash
# Wrapper script for auto-push watcher

cd /Users/ax/Documents/GitHub/my-personal-blog
npm run auto-push >> /tmp/blog-autopush.log 2>&1
