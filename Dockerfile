FROM maven:3.9.6-amazoncorretto-17-debian AS build
# mkdir directory
WORKDIR /app/MyZing
# copy <source> <dest>
COPY ./MyZing/pom.xml .
# copy src
COPY ./MyZing/src /src
RUN mvn clean package

FROM openjdk:17-ea-oracle

WORKDIR /app/MyZing
COPY --from=build /app/MyZing/target/*.war app.war

CMD ["java", "-jar", "app.war"]

FROM node:22.14.0-alpine
ARG VITE_SERVER_HOST=http://localhost:8081/api/v1

# Set the working directory in the container
WORKDIR /app/MyZingVite

# Copy the package.json and package-lock.json files to the container
COPY /.myzingvite/package.json ./myzingvite/package-lock.json ./

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
CMD [ "npm", "run", "preview" ]