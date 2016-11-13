# Ceramic
![](https://travis-ci.org/Axodoss/Ceramic.svg)
![](https://david-dm.org/Axodoss/Ceramic.svg)
[![StackShare](http://img.shields.io/badge/tech-stack-0690fa.svg?style=flat)](http://stackshare.io/Axodoss/ceramic)
[![Code Climate](https://codeclimate.com/github/Axodoss/Ceramic/badges/gpa.svg)](https://codeclimate.com/github/Axodoss/Ceramic)
[![Test Coverage](https://codeclimate.com/github/Axodoss/Ceramic/badges/coverage.svg)](https://codeclimate.com/github/Axodoss/Ceramic/coverage)
[![Issue Count](https://codeclimate.com/github/Axodoss/Ceramic/badges/issue_count.svg)](https://codeclimate.com/github/Axodoss/Ceramic)

## Description
TODO

## How to build
##### Setup
* **Node JS and NPM** => https://nodejs.org/
* **MongoDB** => https://www.mongodb.com/
* **Redis** => http://redis.io/
* **Elastic Search** => https://www.elastic.co/
* **SSL** => https://www.openssl.org/

##### Environment Variables
* **SESSION_KEY** = express sesstion
* **FACEBOOK_APP_ID** = facebook app id
* **FACEBOOK_APP_SECRET** = facebook secret id
* **DB_USERNAME** = mongodb user
* **DB_PASSWORD** = mongodb password

* **PUBLISH_URL** = Gulp SSH deploy task, URL
* **PUBLISH_USER** =  Gulp SSH deploy task, Username
* **PUBLISH_PASSWORD** =  Gulp SSH deploy task, Passwrod
* **PUBLISH_PATH** = Path to the file should be put

* **SESSION_KEY** = ???

##### Develop
TODO

To start the application run the following commands in separate windows:
`start-mongo`
`start-redis` (if not run as a service)
`gulp watch`
`gulp batch`
`gulp serve`

##### Build
'gulp deploy' = Full build process including git tag and version bump, production
'gulp build' = Full build process, for continues integration

##### Test
TODO

## How to deploy
TODO

## Data and functions exposed
None

## Branches
All changes should be developed in a new branch created from the `master` branch.

Branches use the following naming conventions:
* `add/{something}` => When you are adding a completely new feature
* `update/{something}` => When you are iterating on an existing feature
* `fix/{something}` => When you are fixing something broken in a feature
* `try/{something}` => When you are trying out an idea and want feedback
* `release/v.{major}.{minor}.{patch}` => When releasing a new version

## Links
* https://developers.facebook.com/