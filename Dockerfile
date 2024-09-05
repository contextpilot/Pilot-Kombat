# Use node:lts-alpine as the base image
FROM node:lts-alpine

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the application
RUN npm run build

# Expose port 8080
EXPOSE 8080

# Set environment variable for Vite preview port
ENV PORT=8080

# Start the Vite preview server on port 8080
CMD ["npm", "run", "preview"]