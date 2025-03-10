.SILENT: build-server
build-server:
	@go build -o ./bin/codepush-server
	@echo executable file \"codepush-server\" saved in ./bin/codepush-server
	@./bin/codepush-server --env-path="./.env"

.SILENT: run-server
run-server:
	@./bin/codepush-server --env-path="./.env"