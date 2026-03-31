ARG BASE_IMAGE=node:22-slim
FROM ${BASE_IMAGE}
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --production
COPY server.js index.html ./
EXPOSE 3000
CMD ["node", "server.js"]
