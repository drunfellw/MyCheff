FROM node:18-alpine AS base

WORKDIR /app

# Copy package files
COPY package*.json ./

FROM base AS dependencies

# Install dependencies
RUN npm install

# Development stage
FROM dependencies AS development

COPY . .
EXPOSE 3001
CMD ["npm", "run", "start:dev"]

# Build stage
FROM dependencies AS build

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm install --only=production && npm cache clean --force

# Copy built application
COPY --from=build /app/dist ./dist

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Change ownership of the working directory
RUN chown -R nestjs:nodejs /app
USER nestjs

EXPOSE 3001

CMD ["node", "dist/main.js"] 