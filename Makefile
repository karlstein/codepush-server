.SILENT: build
build:
ifdef ISLOCAL
	@echo Build docker with .env.local
	@bash ./scripts/docker-build.sh ./.env.local
else
	@echo Build docker with .env
	@bash ./scripts/docker-build.sh ./.env
endif

.SILENT: build-server
build-server:
	@go build -o ./bin/codepush-server
	@echo executable file \"codepush-server\" saved in ./bin/codepush-server
	@./bin/codepush-server --env-path="./.env"

.SILENT: run-server
run-server:
	@./bin/codepush-server --env-path="./.env"

.SILENT: build-all
build-all:
ifeq ($(ENV),)
	@echo run local build script
	@bash ./scripts/local-build-all.sh ./.env.local
else ifeq ($(ENV),LOCAL)
	@echo run local build script
	@bash ./scripts/local-build-all.sh ./.env.local
else ifeq ($(ENV),DEV)
	@echo run dev build script
	@bash ./scripts/dev-build.sh ./.env
else ifeq ($(ENV),STG)
	@echo run stg build script
	@bash ./scripts/stg-build.sh
else ifeq ($(ENV),PROD)
	@echo run prod build script
	@bash ./scripts/prod-build.sh
endif

.SILENT: run-fe
run-fe:
ifeq ($(ENV),)
	@echo run local run-fe script
	@bash ./scripts/local-run-fe.sh ./.env.local
else ifeq ($(ENV),LOCAL)
	@echo run local run-fe script
	@bash ./scripts/local-run-fe.sh ./.env.local
else ifeq ($(ENV),DEV)
	@echo run dev run-fe script
	@bash ./scripts/dev-run-fe.sh ./.env
else ifeq ($(ENV),STG)
	@echo run stg run-fe script
	@bash ./scripts/stg-run-fe.sh
else ifeq ($(ENV),PROD)
	@echo run prod run-fe script
	@bash ./scripts/prod-run-fe.sh
endif

.SILENT: run-api
run-api:
ifeq ($(ENV),)
	@echo run local run-api script
	@bash ./scripts/local-run-api.sh
else ifeq ($(ENV),LOCAL)
	@echo run local run-api script
	@bash ./scripts/local-run-api.sh
else ifeq ($(ENV),DEV)
	@echo run dev run-api script
	@bash ./scripts/dev-run-api.sh
else ifeq ($(ENV),STG)
	@echo run stg run-api script
	@bash ./scripts/stg-run-api.sh
else ifeq ($(ENV),PROD)
	@echo run prod run-api script
	@bash ./scripts/prod-run-api.sh
endif
