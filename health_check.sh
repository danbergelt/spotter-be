#!/bin/bash

while :
do
  echo "Running tests..."
  netstat -ln | grep ":$PORT " 2>&1 > /dev/null 
  if [ $? -eq 1 ]; then   
     break
  sleep 3
done
fi
