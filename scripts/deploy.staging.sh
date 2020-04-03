#! /bin/bash

docker login -u "$DOCKER_USERNAME" -p "$DOCKER_PASSWORD"
echo Building staging API...
docker-compose -f docker-compose.staging.yml build staging_api
docker push danbergelt/staging_api:latest