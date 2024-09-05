# Stage 1: Build
FROM node:lts-alpine as build

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

# Stage 2: Serve with Vite Preview
FROM node:lts-alpine

# Set the working directory
WORKDIR /app

# Copy the build output and the package.json file
COPY --from=build /app/dist /app/dist
COPY --from=build /app/package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Expose port 8080
EXPOSE 8080

# Set environment variable for Vite preview port
ENV PORT 8080

# Start the Vite preview server on port 8080
CMD ["npm", "run", "preview", "--", "--port", "8080"]