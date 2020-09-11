<h1 align="center">
  Very useful tools to remember
</h1>

<p align="center">
  <a href="#rocket-technologies">Technologies</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#memo-license">License</a>
</p>

<div align="center">
<a href="https://insomnia.rest/run/?label=VUTTR&uri=https%3A%2F%2Fraw.githubusercontent.com%2Fgreysonmrx%2Fvuttr-backend%2Fmaster%2F.github%2Finsomnia.json" target="_blank"><img src="https://insomnia.rest/images/run.svg" alt="Run in Insomnia"></a>
</div>

## :rocket: Technologies

- **Express** — Fast, unopinionated, minimalist web framework for Node.js.
- **BcryptJS** - Optimized bcrypt in plain JavaScript with zero dependencies.
- **Express Async Errors** - A dead simple ES6 async/await support hack for ExpressJS.
- **Json Web Token** - JsonWebToken implementation for Node.js.
- **Multer** -  Node.js middleware for handling multipart/form-data.
- **Typeorm** -  ORM for TypeScript and JavaScript.
- **Jest** - Delightful JavaScript Testing.
- **Swagger Ui** - Swagger UI is a collection of HTML, JavaScript, and CSS assets that dynamically generate beautiful documentation.
- **Eslint** - Pluggable JavaScript linter.
- **Prettier** - An opinionated code formatter.
- **VS Code** - Code Editing.
- **EditorConfig** - Helps maintain consistent coding styles for multiple developers working on the same project across various editors and IDEs.

## :memo: Getting started

Import the `Insomnia.json` on Insomnia App or click on [Run in Insomnia](#insomniaButton) button

### Requirements

- [Node.js](https://nodejs.org/en/)
- [Yarn](https://classic.yarnpkg.com/) or [npm](https://www.npmjs.com/)
- One instance of [PostgreSQL](https://www.postgresql.org/)

> Obs.: I recommend use docker

**Clone the project and access the folder**

```bash
$ git clone https://github.com/EliasGcf/vuttr-backend.git
$ cd vuttr-backend
```

**Follow the steps below**

```bash
# Install the dependencies
$ yarn

# Make a copy of '.env.example' to '.env'
# and set with YOUR environment variables.
# The aws variables do not need to be filled for dev environment
$ cp .env.example .env

# Create the instance of postgreSQL using docker
$ docker run --name vuttr-postgres -e POSTGRES_USER=postgres \
              -e POSTGRES_DB=vuttr -e POSTGRES_PASSWORD=docker \
              -p 5432:5432 -d postgres

# Once the services are running, run the migrations
$ yarn typeorm migration:run

# Run the tests
$ yarn test

# To finish, run the api service
$ yarn dev:server

# Well done, project is started!
```

To see the **documentation**, click here: [Documentation](http://localhost:3000/docs)<br />

Made with :hearts: by Greyson :wave: [See my linkedin](https://www.linkedin.com/in/greyson-mascarenhas-5a21ab1a2/)
