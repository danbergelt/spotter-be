#! /bin/bash

docker login -u "$DOCKER_USERNAME" -p "$DOCKER_PASSWORD"
echo Building production API...
docker-compose -f docker-compose.production.yml build prod_api
docker push danbergelt/spotter_prod_api:latest