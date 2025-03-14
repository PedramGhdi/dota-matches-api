# Use a Node.js base image
FROM node:22

# Install required packages
RUN apt-get update && apt-get install -y \
    curl \
    nodejs \
    npm \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install pnpm
RUN npm install -g pnpm

# Set up working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN pnpm install

# Copy all the other files
COPY . .

# Expose port (assuming your app runs on port 3000)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
