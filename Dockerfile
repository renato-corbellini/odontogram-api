# ---- Base Stage ----
# Use a specific Node.js LTS version for reproducibility.
# Alpine Linux is used for its small size.
FROM node:20-alpine AS base

# Create a non-root user and group
RUN addgroup -S node && adduser -S node -G node

# Enable pnpm via corepack
RUN corepack enable

# Set the working directory
WORKDIR /usr/src/app

# ---- Builder Stage ----
# This stage installs all dependencies (including devDependencies) and builds the application.
FROM base AS builder

# Copy package.json and the lockfile
COPY package.json pnpm-lock.yaml ./

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application source code
COPY . .

# Build the application
RUN pnpm run build

# ---- Production Stage ----
# This stage creates the final, lightweight image with only production dependencies and the built app.
FROM base AS production

# Change ownership of the app directory
RUN chown -R node:node /usr/src/app

# Switch to the non-root user
USER node

# Copy production dependencies from the builder stage
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./

# Copy the built application from the builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Expose the application port (default for NestJS is 3000)
EXPOSE 3000

# The command to run the application in production mode
CMD ["pnpm", "run", "start:prod"]
