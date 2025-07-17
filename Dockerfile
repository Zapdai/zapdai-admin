FROM node:20-alpine as builder
WORKDIR /app

COPY package*.json ./
RUN npm install --silent
COPY . .
COPY . .
RUN find . -name "*.spec.ts" -type f -delete
RUN npm run build:ssr
FROM node:20-alpine as runner
WORKDIR /app
COPY --from=builder /app/dist/zapdai /app/dist/zapdai
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package.json .

EXPOSE 4000

CMD ["node", "dist/zapdai/server/server.mjs"]
