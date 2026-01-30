FROM node:20.9.0-bullseye-slim
ENV NODE_ENV=production
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /usr/src/app/dist ./dist

USER node
CMD ["node", "dist/main.js"]
