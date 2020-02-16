#! /bin/bash

docker login -u "$DOCKER_USERNAME" -p "$DOCKER_PASSWORD"
echo Building staging API...
docker-compose -f docker-compose.staging.yml build staging_api
docker tag spotter-be_staging_api:latest danbergelt/spotter-be_staging_api:latest
docker push danbergelt/spotter-be_staging_api:latest