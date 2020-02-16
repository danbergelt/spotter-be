#! /bin/bash

echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
echo Building staging API...
echo docker-compose -f docker-compose.staging.yml build staging_api
echo docker tag spotter-be_staging_api:latest danbergelt/spotter-be_staging_api:latest
echo docker push danbergelt/spotter-be_prod_api:latest
