FROM node:24-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install

FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY --from=deps /app/node_modules ./node_modules

COPY . .

ARG DATABASE_URL

ENV DATABASE_URL=$DATABASE_URL

RUN npm run build

FROM node:24-alpine AS runner
WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

RUN npm install --only=production

RUN rm -rf node_modules/prisma node_modules/@prisma/engines

EXPOSE 3000
ENV NODE_ENV=production

CMD ["npm", "run", "start"]
