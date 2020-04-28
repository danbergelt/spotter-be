du:
	docker-compose -f docker-compose.development.yml up --build
dd:
	docker-compose -f docker-compose.development.yml down
dt:
	docker exec db mongo --eval db.getSiblingDB"('spotter')".dropDatabase"()"
	docker-compose -f docker-compose.development.yml run --rm dev_api yarn test
	docker exec db mongo --eval db.getSiblingDB"('spotter')".dropDatabase"()"
dciu:
	docker-compose -f docker-compose.development.yml run --rm dev_api yarn coverage
dcid:
	docker-compose -f docker-compose.development.yml down
depp:
	docker login -u "$(DOCKER_USERNAME)" -p "$(DOCKER_PASSWORD)"
	docker-compose -f docker-compose.production.yml build prod_api
	docker push danbergelt/spotter_prod_api:latest
deps:
	docker login -u "$(DOCKER_USERNAME)" -p "$(DOCKER_PASSWORD)"
	docker-compose -f docker-compose.staging.yml build staging_api
	docker push danbergelt/staging_api:latest