#!/bin/sh
sshpass -p $PUBLISH_PASSWORD scp -o ChallengeResponseAuthentication=no -o CheckHostIP=no -q build_v*.zip $PUBLISH_USER@$PUBLISH_URL:$PUBLISH_PATH