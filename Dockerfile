# ----- Stage 1: Dependencies -----
FROM node:20-slim AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# ----- Stage 2: Runner -----
FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production
# Tạo user không phải root (bảo mật hơn)
RUN useradd -m appuser
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Cổng app (sửa nếu app bạn khác cổng)
EXPOSE 3000
USER appuser
CMD ["node", "server.js"]
docker run -d --name serverapi \ 
  -p 3000:3000 \
  --env MONGO_URL="mongodb://host.docker.internal:27017/chat" \ 
  mynodeapp:1.0
