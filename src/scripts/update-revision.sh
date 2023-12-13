#!/bin/bash
echo "$VERSION"
tmp=$(mktemp);
jq --arg v "$VERSION" '.version = $v' package.json > "$tmp";
mv "$tmp" package.json;
