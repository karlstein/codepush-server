# build
FROM golang:1.24.1-bookworm AS build
WORKDIR /app
COPY go.mod ./
COPY go.sum ./
RUN go mod download
COPY . .

RUN CGO_ENABLED=0 go build -ldflags '-extldflags "-static"' -o /codepush-server

# distroless
FROM gcr.io/distroless/static-debian12
WORKDIR /
COPY --from=build /codepush-server /codepush-server
COPY /.env /.env

ENTRYPOINT ["./codepush-server", "--env-path", ".env"]