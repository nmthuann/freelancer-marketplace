# syntax=docker/dockerfile:1.4
FROM node:18-alpine AS builder

WORKDIR /workspace

# Copy toàn bộ source vào container
COPY . .

# Cài dependencies
RUN npm ci

# Build riêng service user (NestJS CLI sẽ chỉ build service đó + libs nó dùng)
RUN npm run build user

FROM node:18-alpine AS runner
WORKDIR /app

# Copy node_modules (chỉ production deps)
COPY --from=builder /workspace/node_modules ./node_modules

# Copy dist riêng của service user
COPY --from=builder /workspace/dist/apps/user ./dist

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "dist/main.js"]
