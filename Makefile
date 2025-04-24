.SILENT: build
build:
ifndef BE_VERSION
	@docker build -t codepush-server/api -f api/Dockerfile --platform=linux/amd64 api/
else
	@docker build -t codepush-server/api:$(BE_VERSION) -f Dockerfile --platform=linux/amd64 api/
endif
ifndef FE_VERSION
	@docker build -t codepush-server/fe -f frontend/Dockerfile --platform=linux/amd64 frontend/
else
	@docker build -t codepush-server/fe:$(FE_VERSION) -f Dockerfile --platform=linux/amd64 frontend/
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
	@bash ./scripts/local-build.sh ./.env
else ifeq ($(ENV),LOCAL)
	@echo run local build script
	@bash ./scripts/local-build.sh ./.env
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
	@bash ./scripts/local-run-fe.sh ./.env
else ifeq ($(ENV),LOCAL)
	@echo run local run-fe script
	@bash ./scripts/local-run-fe.sh ./.env
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
