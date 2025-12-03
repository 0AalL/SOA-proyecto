# Etapa de build: Maven + JDK 21
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copiar pom y bajar dependencias para cache
COPY pom.xml .
RUN mvn -q -DskipTests dependency:go-offline

# Copiar código fuente
COPY src ./src

# Compilar y empaquetar
RUN mvn -q -DskipTests package

# Etapa runtime: JRE 21 ligera
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Crear usuario no root
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copiar jar de la etapa build
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8088

ENV JAVA_OPTS=""
ENV SPRING_PROFILES_ACTIVE=""

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]