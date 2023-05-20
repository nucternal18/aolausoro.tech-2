# Use the official Node.js 14 image as the base
FROM node:latest

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application files to the container
COPY . .

# Copy the .env file to the container
COPY .env /app/.env
COPY .env.local /app/.env.local

# generate the prisma client
RUN npx prisma generate

# Build the Next.js application
RUN npm run build

# Expose the application port
EXPOSE 3000

# Start the Next.js application using the .env file
CMD ["npm", "run", "start"]