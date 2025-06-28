FROM node:22.14.0-alpine

ARG VITE_SERVER_HOST

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package.json package-lock.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the project files to the container
COPY . .

RUN echo "VITE_SERVER_HOST=$VITE_SERVER_HOST" > .env

# Build the React app
RUN npm run build

# Expose the port that the server will listen on
EXPOSE 5173

# Start the application
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]