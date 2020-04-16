![Spotter Logo](./media/spotter.png)

[![codecov](https://codecov.io/gh/danbergelt/spotter-be/branch/master/graph/badge.svg)](https://codecov.io/gh/danbergelt/spotter-be) [![Build Status](https://travis-ci.org/danbergelt/spotter-be.svg?branch=master)](https://travis-ci.org/danbergelt/spotter-be) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

a blazing fast, user obsessed, weightlifting focused fitness pal

🔗 https://getspotter.io

## 🤝 pull requests

pull requests welcome!

if you'd like to get in touch, please reach out to 📧 dan@danbergelt.com

## 👨‍💻 requirements

`docker` and `docker-compose`

once pulled down, run `docker-compose -f docker-compose.development.yml up -d` to run a development server

alternatively, if you have node.js installed on your machine and would only like to containerize the database, run `docker-compose -f docker-compose.development.yml up -d db`.

this will give you top-level access to all the scripts found in `package.json`. if you plan on making large amounts of changes, this might be preferable to containerizing every service

## 🌍 env

this app relies on certain environment variables. after pulling down to your local environment, run `touch .env` in the root and add the below variables:

`DB=mongodb://<your database name (db by default)>:27017/spotter`

`PORT=<port for server>`

`NODE_ENV=development`

`JWT_SECRET=<your jsonwebtoken secret`

`JWT_EXPIRE=<your jsonwebtoken expiration time (e.g. 1d)`

`REF_SECRET=<your refresh cookie secret>`

`REF_EXPIRE=<your refresh cookie expiration time (e.g. 10d)>`

`MG_DOMAIN=<your mailgun domain>`

`MG_KEY=<your mailgun api key>`

`CODECOV_TOKEN=<your codecov token>`

## 📜 scripts

#### node

`yarn start` - run your app in production mode

`yarn dev` - run your app in development mode

`yarn staging` - run your app in staging mode

`yarn test` - run tests

`yarn coverage` - run test, collect coverage into `./coverage`

`yarn lint` - lint app for syntax errors

`yarn fix` - lint and fix syntax errors

#### docker

`docker-compose -f docker-compose.development.yml up -d` - run dev server

`docker-compose -f docker-compose.develpment.yml up -d db` - run db only

`docker-compose -f docker-compose.development.yml down` - remove dev server

`docker-compose -f docker-compose.ci.yml up -d` - collect coverage, used during ci (requires codecov env token)

`docker-compose -f docker-compose.test.yml up -d` - run tests

`docker-compose -f docker-compose.staging.yml up -d` - run staging server (will not work for you, so don't run it)

`docker-compose -f docker-compose.production.yml up -d` - run production server (will not work for you, so don't run it)

## ⚙️ tech

`node` - runtime

`express` - services

`mongodb` - persistence/db

`typescript` - static type checking

`mocha` - test runner + unit tests

`chai` - integration tests

`docker/docker-compose` - containerization

`travis ci` - ci

`digital ocean` - deployment
