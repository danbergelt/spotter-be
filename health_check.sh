#!/bin/bash
while :; do
  if lsof -Pi :"$PORT" -sTCP:LISTEN -t >/dev/null ; then
    echo "running"
  else
    break
  fi
done