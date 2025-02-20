# Use the full Node.js image instead of Alpine
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install --omit=dev  # Ensure production dependencies are installed

# Copy the rest of the application
COPY . .

# Ensure the container listens on the correct port
EXPOSE 8080

# Start the app
CMD ["node", "src/server.js"]
