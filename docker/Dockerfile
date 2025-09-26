FROM node:20-alpine
ENV NODE_ENV=production
ENV PORT=3000
ENV WORKDIR=/app
WORKDIR $WORKDIR
COPY app/package.json ./
RUN npm ci --only=production
COPY app/ $WORKDIR
EXPOSE 3000
USER node
CMD ["npm", "start"]