# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
WORKDIR /opt/app

# ---- Dépendances ----
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ---- Build ----
FROM base AS build
COPY --from=deps /opt/app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# URL publique (derrière Nginx) embarquée dans le bundle client
ARG NEXT_PUBLIC_STRAPI_URL=http://localhost
ENV NEXT_PUBLIC_STRAPI_URL=$NEXT_PUBLIC_STRAPI_URL
# URL interne au réseau Docker pour les appels serveur (écrasable au runtime)
ENV STRAPI_INTERNAL_URL=http://backend:1337
RUN npm run build

# ---- Production (standalone) ----
FROM node:22-alpine AS production
WORKDIR /opt/app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
COPY --from=build /opt/app/.next/standalone ./
COPY --from=build /opt/app/.next/static ./.next/static
COPY --from=build /opt/app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
