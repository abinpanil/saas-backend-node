# -------------------------
# Build stage
# -------------------------
FROM node:24-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source (after deps for cache efficiency)
COPY tsconfig.json ./
COPY src ./src

# Build TypeScript
RUN npm run build

# -------------------------
# Production stage
# -------------------------
FROM node:24-alpine

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Create non-root user
RUN addgroup -S app && adduser -S app -G app

# Install production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy built files
COPY --from=builder /app/dist ./dist

# Change ownership
RUN chown -R app:app /app

# Switch to non-root user
USER app

# Expose port
EXPOSE 3000

# Start server (IMPORTANT)
CMD ["node", "dist/server.js"]
