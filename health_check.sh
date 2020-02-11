#!/bin/bash

while [ true ]
do
  if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; then
    echo "Running tests..."
    sleep 3
else
    break
exit 0
