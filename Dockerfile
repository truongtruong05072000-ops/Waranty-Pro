# ===================================================================
# Dockerfile: VinFast CarOn Thới An Realtime Backend (N54511)
# Hỗ trợ Deploy mượt mà trên Render / Railway / Fly.io / VPS Docker
# ===================================================================

FROM node:22-alpine

WORKDIR /app

# Copy package definitions và cài đặt thư viện
COPY package*.json ./
RUN npm install --omit=dev

# Copy toàn bộ mã nguồn
COPY . .

# Biên dịch frontend HTML
RUN npm run build

# Render / Railway sẽ tự động truyền cổng qua biến môi trường PORT (mặc định 3001)
ENV PORT=3001
ENV NODE_ENV=production

EXPOSE 3001

# Tự động kiểm tra sức khỏe và chống ngủ
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/api/health || exit 1

# Khởi động Backend Realtime Engine
CMD ["npm", "start"]
