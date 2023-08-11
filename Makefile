SHELL=/bin/bash

.PHONY: deploy-dev
deploy-dev:
	yarn build-env-dev && \
	cd deploy && \
	npx cdk deploy --all \
		-c "envtype=dev" \
		-c logRetentionPeriod=7 \
		-c route53ZoneName=spm-dev.com \
		-c simulatorSubdomain=simulator \
		-c hostedZoneId=Z06570963026ZFH5CPQVO

.PHONY: deploy-int
deploy-int:
	yarn build-env-int && \
	cd deploy && \
	npx cdk deploy --all \
		-c "envtype=int" \
		-c logRetentionPeriod=7 \
		-c route53ZoneName=spm-int.com \
		-c simulatorSubdomain=simulator \
		-c hostedZoneId=Z09803913NDCNTBFAAAAY

.PHONY: test-env-validator
test-env-validator: 
	go test -v scripts/envConfigValidator/*.go

# TODO: improve validate-env-config command
.PHONY: validate-env-config
validate-env-config: 
	make test-env-validator && go run scripts/envConfigValidator/validator.go scripts/envConfigValidator/timer.go scripts/envConfigValidator/defaultEnvConfig.go scripts/envConfigValidator/color.go

.PHONY: zip
zip: 
	go run scripts/generateBuild/cmd/main.go
