#!/bin/bash
# create temp
mkdir temp
touch temp/output.json

# update figma tokens
bun run update

# evaluate script output
changes=$(echo $(<./temp/output.json) | jq ".changes")

echo "$changes"
if [[ "$changes" == "false" ]]
then
  echo "no changes"
  # no commit or publish needed
  echo "changes=false" >> $GITHUB_OUTPUT
else
  # new changes have been generated
  # pull message and version from script output
  message=$(echo $(<./temp/output.json) | jq ".message")
  version=$(echo $(<./temp/output.json) | jq ".version")
  echo "$version"
  echo "$message"
  # expose output to further steps
  echo "changes=true" >> $GITHUB_OUTPUT
  echo "message=$message" >> $GITHUB_OUTPUT
  echo "version=$version" >> $GITHUB_OUTPUT
fi