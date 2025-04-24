FROM node:23-alpine@sha256:86703151a18fcd06258e013073508c4afea8e19cd7ed451554221dd00aea83fc AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm config set legacy-peer-deps true
RUN npm i --verbose


FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package-lock.json ./
COPY @types ./@types
COPY public ./public
COPY src ./src
COPY ./.env ./.env
# COPY next-env.d.ts ./
COPY next.config.ts ./
COPY eslint.config.mjs ./
COPY package.json ./
COPY postcss.config.mjs ./
COPY tailwind.config.js ./
COPY tsconfig.json ./

RUN npm run build


FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3004

ENV PORT=3004

CMD HOSTNAME="0.0.0.0" node server.js

# FROM gcr.io/distroless/nodejs20-debian11
# COPY /.next /.next
# COPY /package.json /package.json
# COPY /package.json /package.json
# COPY /package-lock.json /package-lock.json
# COPY --from=build /node_modules /node_modules

# CMD ["npm", "run", "start"]

# ARG WEB_VERSION=0.12
# ENV ASD_ASD asdsada
# RUN echo ${ASD_ASD}
# RUN echo ${WEB_VERSION}
# RUN echo ${NODE_ENV}