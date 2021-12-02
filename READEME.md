# Welcome to Tharaka's game-data API!!!

## Link ===> https://thar-first-game.herokuapp.com/

## Purpose

This API was built as part of my backend project for Northcoders bootcamp with the purpose of accessing game-data programmatically. The intention here is to mimick the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

This API interacts with a PSQL database using NODE-postgres based on requests made through an express server.

## Setting up test database

### Please Note

- Node.js needs to be at least version 16.11.1
- Postgres needs to be at least version 14.0

### Step 1 - Clone repo

- Open your terminal and navigate to a directory where you want the cloned repo and type the following.

```bash
$ git clone https://github.com/chathu2686/thar_first_game.git
```

### Step 2 - Install NPM packages

- Please type the following command on your terminal to install the dependencies/dev-dependencies.

```bash
$ npm install
$ npm install -D jest jest-sorted supertest nodemon
```

### Step 3 - Setup .env files

-On the repository root directory setup two .env files with the following names and add them to .gitignore as well.

```bash
.env.development
.env.test
```

- Now insert the following inside .env.development file.

```bash
PGDATABASE=nc_games
```

-Also insert the following into .env.test file

```bash
PGDATABASE=nc_games_test
```

### Step 4 - Seed development database

-To seed the development database run the following commands in your terminal.

```bash
$ npm run setup-dbs
$ npm run seed
```

### Step 5 - Testing (Seeding test database)

-In order to run integration tests please run the following command on your terminal from the repo root directory.

```bash
$ npm test __tests__/app.test.js
```
