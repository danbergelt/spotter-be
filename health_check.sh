#!/bin/bash
while :; do
  if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; then
    echo "running"
    sleep 3
  else
    break
  fi
done