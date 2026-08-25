# syntax=docker/dockerfile:1
#
# Dockerfile DÙNG CHUNG cho cả 4 service của Nest monorepo.
# Chọn service cần build qua build-arg SERVICE:
#   api-gateway | user-service | post-service | order-service
#
ARG NODE_IMAGE=node:20-slim

# ─────────────────────── builder ───────────────────────
FROM ${NODE_IMAGE} AS builder
WORKDIR /workspace

# Toolchain để build native module (bcrypt)
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*
RUN npm install -g pnpm@9

# Cài dependencies trước để tận dụng layer cache.
# KHÔNG copy pnpm-workspace.yaml ở bước này: repo dùng tsconfig paths, không dùng
# pnpm workspace packages → tránh lỗi "packages field missing".
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
# build native bcrypt cho môi trường Linux
RUN pnpm rebuild bcrypt

# Build đúng service được chỉ định (Nest CLI tự gộp libs mà nó dùng)
COPY . .
ARG SERVICE
RUN node_modules/.bin/nest build ${SERVICE}

# ─────────────────────── runner ───────────────────────
FROM ${NODE_IMAGE} AS runner
WORKDIR /app
ENV NODE_ENV=production
ARG SERVICE

COPY --from=builder /workspace/node_modules ./node_modules
COPY --from=builder /workspace/dist/apps/${SERVICE} ./dist

# main.js nằm tại dist/main.js (output của nest build <service>)
CMD ["node", "dist/main.js"]
