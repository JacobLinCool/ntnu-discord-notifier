FROM node:alpine as builder

RUN npm i -g pnpm
WORKDIR /app
COPY . .
RUN pnpm i && pnpm build && pnpm prune --prod

FROM node:alpine as notifier

WORKDIR /app
COPY --from=builder /app .
RUN npm link
WORKDIR /data
ENTRYPOINT ["ntnu-discord-notifier"]
