FROM ubuntu:16.04

MAINTAINER Lukas Heise "lukas.heise@gmail.com"

COPY dist/client/ /var/www/html/
COPY dist/server/*.js /var/cv121/
COPY dist/server/*.json /var/cv121/datasets/

# SSL certificates
# config.json

# Setup users
# 
# 
# apt-get update
# apt-get install curl
# apt-get install fail2ban
#
# curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
#
#
# 
# NodeJS and NPM
#
#
# 
# 
# Redis
#
#
# 
# 
# MongoDB 
#
#
# 
# 
# Elasticsearch
#
#
# 
# 
# npm install --production
#
#
# 
# 
# PM2 + modules
# RUN npm install pm2 -g
# 
#
#
# Environment variables
#
#
# 
# 
# Crontab
#
#
# 
# 
# Register and start PM2 tasks
# 
# 

# EXPOSE 80     # will be depricated


# docker build -t cv121 .
# docker run -p 80:80 cv121
# docker run -p 80:80 -v ./dist/client/:/var/www/html/ cv121

# http://pm2.keymetrics.io/docs/usage/docker-pm2-nodejs/

# ENV <key> <value>
# WORKDIR <path>
# USER <uid>
# VOLUME ['/data']  # enable access to a directory from a working container (mount)





