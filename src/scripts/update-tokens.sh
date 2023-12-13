#!/bin/bash
# update figma tokens
bun run update;

# evaluate script output
changes=$(echo $(<./temp/output.json) | jq ".changes");
GITHUB_OUTPUT;

if (( $changes == "false" ))
then
  # no commit or publish needed
  echo "changes=false" >> $GITHUB_OUTPUT;
else
  # new changes have been generated
  echo "changes=true" >> $GITHUB_OUTPUT;
  message=$(echo $(<./temp/output.json) | jq ".message")
  version=$(echo $(<./temp/output.json) | jq ".version")
  echo "message=$message" >> $GITHUB_OUTPUT;
  echo "version=$version" >> $GITHUB_OUTPUT;
fi