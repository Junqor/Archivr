FROM node:20-alpine

WORKDIR /app

# Copy package files from both ui and backend (maintaining relative structure)
COPY ui/package*.json ./ui/
COPY backend/package*.json ./backend/
COPY backend/tsconfig.json ./backend/

# Install dependencies for ui
WORKDIR /app/ui
RUN npm ci

# Install dependencies for backend (needed for type imports)
WORKDIR /app/backend
RUN npm ci

# Copy source files (maintaining relative structure so ../backend imports work)
WORKDIR /app
COPY ui/ ./ui/
COPY backend/ ./backend/

# Create symlink from /backend to /app/backend for absolute path compatibility
#RUN ln -s /app/backend /backend

# Set working directory to ui
WORKDIR /app/ui

# Expose the Vite dev server port
EXPOSE 5173

# Start the development server with host flag to allow external connections
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
