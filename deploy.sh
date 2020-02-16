#! /bin/bash

docker login -u "$DOCKER_USERNAME" -p "$DOCKER_PASSWORD"
echo Building production API...
docker-compose -f docker-compose.production.yml build prod_api
docker tag spotter-be_prod_api:latest danbergelt/spotter-be_prod_api:latest
docker push danbergelt/spotter-be_prod_api:latest