#! /bin/bash

echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
if [ "$STAGING" = "true" ]
then
  echo Building staging API...
  echo docker-compose -f docker-compose.staging.yml build staging_api
  echo docker tag spotter-be_staging_api:latest danbergelt/spotter-be_staging_api:latest
  echo docker push danbergelt/spotter-be_staging_api:latest
else
  echo Building production API...
  echo docker-compose -f docker-compose.production.yml build prod_api
  echo docker tag spotter-be_prod_api:latest danbergelt/spotter-be_prod_api:latest
  echo docker push danbergelt/spotter-be_prod_api:latest
fi