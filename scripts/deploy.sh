#!/bin/sh

# Cron: 0 3 * * * /root/cv121/deploy.sh

DESTINATION=~/cv121
BUILDS=/home/travis/build*.zip
ARCHIEVE=~/builds

APP_BATCH=$DESTINATION/server/batch.js
APP_MAIN=$DESTINATION/server/main.js
CLUSTER_COUNT=1

mkdir -p $DESTINATION

if [ -f "$BUILDS" ];
    # fetch the latest file and check if the build number is higher, only then deploy, else move the file to the archive


    echo "$(date '+%y-%m-%d_%H-%M-%S'): New build found, stopping server..." > /var/logs/deploy.log 2>&1
    pm2 stop all
    echo "$(date '+%y-%m-%d_%H-%M-%S'): Deleting files..." > /var/logs/deploy.log 2>&1
    rm -r $DESTINATION/client
    rm -r $DESTINATION/server
    echo "$(date '+%y-%m-%d_%H-%M-%S'): Unpacking files..." > /var/logs/deploy.log 2>&1
    # deploy the latest file
    ls -t $BUILDS | head -1 | unzip $DESTINATION > /var/logs/deploy.log 2>&1
    cd $DESTINATION
    npm install > /var/logs/deploy.log 2>&1
    cd -
    echo "$(date '+%y-%m-%d_%H-%M-%S'): Starting server..." > /var/logs/deploy.log 2>&1
    pm2 start $APP_BATCH
    pm2 start $APP_MAIN -i $CLUSTER_COUNT
    echo "$(date '+%y-%m-%d_%H-%M-%S'): Archiving build..." > /var/logs/deploy.log 2>&1
    mv $BUILDS $ARCHIEVE
    echo "$(date '+%y-%m-%d_%H-%M-%S'): Process complete" > /var/logs/deploy.log 2>&1
else
    echo "$(date '+%y-%m-%d_%H-%M-%S'): No new build found" > /var/logs/deploy.log 2>&1
fi