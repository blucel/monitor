#!/usr/bin/env sh 
set -e
echo "Enter release version: "
read VERSION
read -p "Releasing $VERSION - are you sure? (y/n)" -n 1 -r
echo # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo "Releasing $VERSION ..." 
  git add .
  echo "input commit:"
  read commit
  git commit -m "$commit"
  git push origin master
  npm publish
fi
