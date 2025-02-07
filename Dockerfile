# Use node version 18 as base image
FROM node:22.11.0

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Run the TypeScript compiler to generate JavaScript files
RUN npm run build

# Expose the port your app will run on
EXPOSE 3000

# Command to run your application
CMD ["npm", "start"]