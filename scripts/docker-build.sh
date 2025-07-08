# Get and set env variables
ENVFILE=$1
echo $ENVFILE

while ! [ -f "$ENVFILE" ]; do
    read -p "Invalid ENV File directory, Please make sure your env project"
done

set -a
. $ENVFILE
set +a

# set frontend env variables
cd frontend
cp .env.example .env

DATABASE_URL="'postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_HOST:$POSTGRES_PORT/$POSTGRES_DB'"
sed -i -e 's|DATABASE_URL=.*|DATABASE_URL='$DATABASE_URL'|' .env
sed -i -e 's|NEXT_PUBLIC_GOOGLE_ID=.*|NEXT_PUBLIC_GOOGLE_ID='$NEXT_PUBLIC_GOOGLE_ID'|' .env
sed -i -e 's|NEXT_PUBLIC_GOOGLE_SECRET=.*|NEXT_PUBLIC_GOOGLE_SECRET='$NEXT_PUBLIC_GOOGLE_SECRET'|' .env
sed -i -e 's|NEXT_PUBLIC_BASE_URL=.*|NEXT_PUBLIC_BASE_URL='$NEXT_PUBLIC_BASE_URL'|' .env
sed -i -e 's|NEXTAUTH_URL=.*|NEXTAUTH_URL='$NEXTAUTH_URL'|' .env
sed -i -e 's|NEXTAUTH_SECRET=.*|NEXTAUTH_SECRET='$NEXTAUTH_SECRET'|' .env
sed -i -e 's|NEXT_PUBLIC_DOMAIN=.*|NEXT_PUBLIC_DOMAIN='$NEXTAUTH_SECRET'|' .env

cd ..

# set api env variables
cp .env ./api/.env

echo "Codepush Server FE version $FE_VERSION"
docker build -t codepush-server/fe:$FE_VERSION -f frontend/Dockerfile --platform=linux/amd64 frontend/

echo "Codepush Server API version $BE_VERSION"
docker build -t codepush-server/api:$BE_VERSION -f api/Dockerfile --platform=linux/amd64 api/

