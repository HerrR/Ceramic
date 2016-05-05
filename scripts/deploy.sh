#!/bin/sh

DESTINATION=/dest
BUILDS=/build/*.zip
ARCHIEVE=/arch

APP_MAIN=$DESTINATION/main.js
CLUSTER_COUNT=4

mkdir -p $DESTINATION

if [ -f "$BUILDS" ];
    echo "$(date '+%y-%m-%d_%H-%M-%S'): New build found, stopping server..."
    pm2 stop all
    echo "$(date '+%y-%m-%d_%H-%M-%S'): Unpacking files..."
    unzip $BUILDS $DESTINATION
    echo "$(date '+%y-%m-%d_%H-%M-%S'): Starting server..."
    pm2 start $APP_MAIN -i $CLUSTER_COUNT
    echo "$(date '+%y-%m-%d_%H-%M-%S'): Archiving build..."
    mv $BUILDS $ARCHIEVE
    echo "$(date '+%y-%m-%d_%H-%M-%S'): Process complete"
else
    echo "$(date '+%y-%m-%d_%H-%M-%S'): No new build found" >&2
fi