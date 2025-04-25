#!/bin/sh
ROOT=$1
echo "root $ROOT"

if [ $ROOT ] ; then
	cd ..
fi

sed -i -e 's|loadEnv(.*|loadEnv(".env.local")|' api/main.go

echo "Building Codepush Server..."
/bin/sh -ec 'cd ./api && go build -o ../bin/codepush-server && \
echo executable file \"codepush-server\" saved in ../bin/codepush-server && \
cd .. && ./bin/codepush-server --env-path .env.local && $SHELL'