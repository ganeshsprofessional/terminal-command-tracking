FROM node:18

# Install dependencies for node-pty
RUN apt-get update && \
    apt-get install -y build-essential python3 g++ libx11-dev && \
    apt-get clean

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install node modules
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

CMD ["node", "server.js"]
