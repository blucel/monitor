#!/usr/bin/env sh
###
 # @Description: 
 # @Version: 2.0
 # @Autor: Seven
 # @Date: 2022-02-10 16:48:39
 # @LastEditors: Seven
 # @LastEditTime: 2022-02-10 16:55:16
### 
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
