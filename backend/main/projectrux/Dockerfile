# ===== Build Stage =====
# Use Maven with Java 21 to build the Spring Boot app
FROM maven:3.9.6-eclipse-temurin-21 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy only pom.xml first to cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy the source code and build the application
COPY src ./src
RUN mvn clean package -DskipTests

# ===== Runtime Stage =====
# Use Java 21 to run the application
FROM eclipse-temurin:21-jdk

# Set the working directory
WORKDIR /app

# Copy the built JAR file from the build stage
COPY --from=build /app/target/projectrux-0.0.1-SNAPSHOT.jar .

# Run the application
ENTRYPOINT ["java", "-jar", "projectrux-0.0.1-SNAPSHOT.jar"]
