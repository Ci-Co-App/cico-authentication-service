# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first (for efficient caching)
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy the rest of the application files
COPY . .

# Ensure Cloud Run uses the correct port
ENV PORT=8080

# Expose the required port
EXPOSE 8080

# Start the application
CMD ["node", "src/server.js"]
