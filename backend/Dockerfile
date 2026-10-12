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
ENV NODE_ENV=production
RUN npm run build

# ---- Production ----
FROM base AS production
ENV NODE_ENV=production
COPY --from=build /opt/app/node_modules ./node_modules
COPY --from=build /opt/app/build ./build
COPY --from=build /opt/app/public ./public
COPY --from=build /opt/app/package.json ./package.json
COPY --from=build /opt/app/favicon.png ./favicon.png

EXPOSE 1337
CMD ["npm", "run", "start"]
