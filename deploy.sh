#! /bin/bash

echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
echo Building production API...
echo docker-compose -f docker-compose.production.yml build prod_api
echo docker tag spotter-be_prod_api:latest danbergelt/spotter-be_prod_api:latest
echo docker push danbergelt/spotter-be_prod_api:latest
