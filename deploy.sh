#!/bin/bash
#
git merge -m "Merge master -> develop, choosing develop" -s ours master 
git checkout master
git merge -m "Merge develop -> master" develop
cp .env.heroku .env
cp .gitignore.heroku .gitignore
gulp build:all
git add -A
git commit -m "Heroku Deployment $1"
git push heroku
git push origin
rm .env
git checkout develop
