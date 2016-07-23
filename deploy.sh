#!/bin/bash
#
git merge -s ours master
git checkout master
git checkout develop
cp .env.heroku .env
gulp build:all
git add -A
git commit -m "Heroku Deployment $1"
git push heroku
git push master
git checkout develop
