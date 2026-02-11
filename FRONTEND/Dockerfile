# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy frontend directory
COPY FRONTEND ../FRONTEND

WORKDIR /app/FRONTEND

# Install dependencies
RUN npm ci

# Build application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install serve to run the frontend
RUN npm install -g serve

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD test -d /app/dist || exit 1

# Start the application
CMD ["serve", "-s", "dist", "-l", "3000"]
