FROM node:20-alpine

WORKDIR /app

# Copy the entire project for shared types
COPY ui/package*.json ./ui/
COPY backend/package*.json ./backend/

# Install backend dependencies
WORKDIR /app/backend
RUN npm ci

# Copy source files
WORKDIR /app
COPY backend ./backend

# Expose the port the app runs on
EXPOSE 3000

# Set working directory to backend
WORKDIR /app/backend

# Start the development server with hot-reloading
CMD ["npm", "run", "dev"]
