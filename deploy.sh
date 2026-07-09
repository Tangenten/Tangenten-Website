#!/usr/bin/env bash
set -e
ts=$(date +%s)
sed -i "s/script.js?v=[0-9]*/script.js?v=$ts/" index.html
sed -i "s/style.css?v=[0-9]*/style.css?v=$ts/" index.html
git add -A
git commit -m "deploy $ts" --allow-empty
git push
