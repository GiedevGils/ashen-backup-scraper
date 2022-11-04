#! /bin/sh

today=$(date +"%Y-%m-%d")
startTime=$(date +"%Y-%m-%d %T")


endTime=$(date +"%Y-%m-%d %T")

git add .
git commit -m "backup $today" -m "start: $startTime -- end: $endTime"
git push

echo "Backup complete || start: $startTime -- end: $endTime"