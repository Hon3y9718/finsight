# --- Build stage ---
FROM node:20-alpine AS builder

WORKDIR /app
RUN apk add --no-cache libc6-compat

# Copy package manifests
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build Next.js
RUN npm run build

# --- Production stage ---
FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache libc6-compat

ENV NODE_ENV=production

# Copy only necessary files for running the app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.* ./
COPY --from=builder /app/public ./public

# Use non-root user
RUN addgroup -S nextgroup && adduser -S nextuser -G nextgroup
USER nextuser

EXPOSE 3000

# Start Next.js server
CMD ["npm", "start"]
