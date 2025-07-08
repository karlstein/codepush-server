# Get and set env variables
ENVFILE=$1
echo $ENVFILE

while ! [ -f "$ENVFILE" ]; do
    read -p "Invalid ENV File directory, Please make sure your env project"
done

set -a
. $ENVFILE
set +a

UNAME=$(uname)

if [ "$UNAME" == "Linux" ] ; then
	echo "Linux"
elif [ "$UNAME" == "Darwin" ] ; then
	echo "Darwin"
elif [[ "$UNAME" == CYGWIN* || "$UNAME" == MINGW* ]] ; then
	echo "Windows"
  wt -p "Bash Shell" --title code-push-server-api -d ./scripts "%ProgramFiles%\Git\bin\sh.exe" local-run-api.sh ROOT=true
  sleep 1
fi

# build svelte frontend
cd frontend
cp .env.example .env.local

DATABASE_URL="'postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_HOST:$POSTGRES_PORT/$POSTGRES_DB'"
sed -i -e 's|DATABASE_URL=.*|DATABASE_URL='$DATABASE_URL'|' .env.local
sed -i -e 's|NEXT_PUBLIC_GOOGLE_ID=.*|NEXT_PUBLIC_GOOGLE_ID='$NEXT_PUBLIC_GOOGLE_ID'|' .env.local
sed -i -e 's|NEXT_PUBLIC_GOOGLE_SECRET=.*|NEXT_PUBLIC_GOOGLE_SECRET='$NEXT_PUBLIC_GOOGLE_SECRET'|' .env.local
sed -i -e 's|NEXT_PUBLIC_BASE_URL=.*|NEXT_PUBLIC_BASE_URL='$NEXT_PUBLIC_BASE_URL'|' .env.local
sed -i -e 's|NEXTAUTH_URL=.*|NEXTAUTH_URL='$NEXTAUTH_URL'|' .env.local
sed -i -e 's|NEXTAUTH_SECRET=.*|NEXTAUTH_SECRET='$NEXTAUTH_SECRET'|' .env.local
sed -i -e 's|NEXT_PUBLIC_DOMAIN=.*|NEXT_PUBLIC_DOMAIN='$NEXT_PUBLIC_DOMAIN'|' .env.local

pnpm install
pnpm run dev
cd ..

