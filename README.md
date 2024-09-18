# Football League API


This is a RESTful API built using NestJS, TypeORM, and MySQL to manage football leagues, teams, players, and coaches. The API also integrates Swagger for easy testing of the endpoints. This document explains how to run the application locally, set up a MySQL environment, use Docker, and test the API using Swagger.

# Table of Contents
Running the App Locally
Running with Docker
Setting Up the Local MySQL Environment
Testing the API in Swagger
Designing the API Endpoints


# Running the App Locally
Prerequisites
Node.js (v18 or later)
Yarn (or npm, but we use Yarn in this project)
MySQL (locally or using Docker)
MySQL Workbench or any database management tool


Steps
1 Clone the repository:

git clone https://github.com/your-repo/football-league-api.git
cd football-league-api

2 Install dependencies:
 - yarn install

3 Create a .env file in the root of the project based on the .env.example (it will be delivered inside de .zip file)

 Update the MySQL credentials and other environment variables as necessary.

4 Run the app in development mode:
 - yarn start:dev

5 The app should be running on http://localhost:4000.




# Running with Docker
Steps
1 Build and run the Docker containers:

docker-compose up --build

This command will build the Docker image for the NestJS app and create a MySQL container using the configuration in docker-compose.yml.

The application will be available at http://localhost:4000, and the MySQL database will be running on port 3307 (or 3306, depending on your Docker setup).


# Setting Up the Local MySQL Environment
If you prefer to set up MySQL manually using MySQL Workbench or another database tool, follow these steps:

Open MySQL Workbench and create a new connection using the following credentials:

Hostname: localhost
Port: 3306 (or the port specified in .env)
Username: root
Password: your_password
Database Name: import_league (as specified in .env)

After setting up the database, ensure the application is connected by updating the .env file with the correct database credentials:

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=mydb

TypeORM syncronization is activated, so when the app runs, it will create the entities automatically



# Testing the API in Swagger
The API comes with integrated Swagger documentation, allowing you to explore and test the endpoints directly from your browser.

Steps to Access Swagger:
Start the application (either locally or with Docker).

Navigate to http://localhost:4000/api in your browser.

You will see an interactive Swagger UI where you can:

Test the /leagues/importLeague endpoint to import a football league by leagueCode.
Use the /players endpoint to retrieve players for a league (optionally filter by team).
Use the /team endpoint to retrieve team details, with the option to include players or coaches.


# Train of thought
We followed a clean and structured approach to designing the API endpoints:

Import League (POST /leagues/importLeague): This endpoint allows you to import a football league from an external API by providing a leagueCode. The imported data includes the league, teams, and players or coaches. We decided to keep this as a POST request since it modifies the state of the database by importing new data.

Get Players (GET /players): This endpoint retrieves all players associated with a specific league using the leagueCode. It also provides an optional teamName parameter to filter the results by team. If no players are available, it returns the team coaches. This ensures flexibility for different use cases.

Get Team (GET /team): This endpoint returns information about a specific team based on the teamName provided. You can optionally include players or coaches by setting the includePlayers flag. We designed this endpoint to be versatile, returning detailed information about the team, while allowing customization of the response.

# Technology Stack Justification
- NestJS: is a progressive Node.js framework that helps in building efficient, reliable, and scalable server-side applications. We chose NestJS for several reasons:
  - NestJS simplifies managing dependencies across the application, promoting reusable and loosely coupled components.
  - makes it easy to define routing, middleware, and request handling
  - NestJS is built with TypeScript at its core.

- TypeORM:is an ORM (Object-Relational Mapping) library for TypeScript and JavaScript that supports multiple database types, including MySQL.

- MySQL: The project naturally fits into a relational database model, where entities like Leagues, Teams, Players, and Coaches have relationships with each other. MySQL, as a relational database, provides the perfect structure for handling this type of interconnected data.