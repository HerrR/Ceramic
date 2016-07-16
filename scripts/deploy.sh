#!/bin/sh

# Cron: 0 3 * * * /root/cv121/deploy.sh

DESTINATION=~/cv121
BUILDS=/home/travis/build*.zip
ARCHIEVE=~/builds

APP_BATCH=$DESTINATION/server/batch.js
APP_MAIN=$DESTINATION/server/main.js
CLUSTER_COUNT=1

mkdir -p $DESTINATION

if [ -f $BUILDS ]; then
    echo "$(date '+%y-%m-%d_%H-%M-%S'): New build found, stopping server..." > /var/log/deploy.log 2>&1
    pm2 stop all
    echo "$(date '+%y-%m-%d_%H-%M-%S'): Deleting files..." > /var/log/deploy.log 2>&1
    rm -r $DESTINATION/client
    rm -r $DESTINATION/server
    echo "$(date '+%y-%m-%d_%H-%M-%S'): Unpacking files..." > /var/log/deploy.log 2>&1
    # deploy the latest file
    cd $DESTINATION
    BUILD_FILE=$(ls -t $BUILDS | head -1)
    unzip -o $BUILD_FILE > /var/log/deploy.log 2>&1
    chmod 0764 *.sh
    chmod 0766 client
    chmod 0766 server
    rm -r node_modules
    npm install --production > /var/log/deploy.log 2>&1
    cd -
    echo "$(date '+%y-%m-%d_%H-%M-%S'): Starting server..." > /var/log/deploy.log 2>&1
    pm2 start $APP_BATCH
    pm2 start $APP_MAIN -i $CLUSTER_COUNT
    echo "$(date '+%y-%m-%d_%H-%M-%S'): Archiving build..." > /var/log/deploy.log 2>&1
    mv $BUILDS $ARCHIEVE
    echo "$(date '+%y-%m-%d_%H-%M-%S'): Process complete" > /var/log/deploy.log 2>&1
#else
    # echo "$(date '+%y-%m-%d_%H-%M-%S'): No new build found" > /var/log/deploy.log 2>&1
fi