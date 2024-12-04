FROM openjdk:17

VOLUME /tmp

COPY target/IStudentGames-0.0.1-SNAPSHOT.jar /app/IStudentGames-0.0.1-SNAPSHOT.jar

COPY .env.prod /app/.env

WORKDIR /app

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "IStudentGames-0.0.1-SNAPSHOT.jar"]