#!/bin/sh

# if file exist then 
#  1. deploy it
#  2. move the file to archive folder
#  3. rename it to include deploy date and time
#  4. only archive the latest 10 builds, delete the rest