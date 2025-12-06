FROM node:20-slim
RUN corepack enable
WORKDIR /workspace
COPY . .
