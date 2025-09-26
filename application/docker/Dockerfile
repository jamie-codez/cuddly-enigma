FROM node:20-alpine AS builder
ENV WORKDIR=/app
WORKDIR $WORKDIR
COPY package.json ./
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install
COPY . .
RUN pnpm build
RUN pnpm prune --prod

FROM node:20-alpine as runner
RUN apk --no-cache add curl
ENV WORKDIR /app
WORKDIR $WORKDIR
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
RUN addgroup -S appgroup && adduser -S appuser -G appgroup # Create a non-root user
RUN chown -R appuser:appgroup $WORKDIR
USER appuser
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
CMD curl -f http://localhost:3000/api/v1/health || exit 1
EXPOSE 3000
CMD ["pnpm", "start:prod"]