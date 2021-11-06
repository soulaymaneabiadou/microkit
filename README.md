# Microservices

### Docs

You can find the api docs at the following link: **[API Docs](https://documenter.getpostman.com/view/7211750/UUxwBU99)**

---

### Docker

While each directory can be built and deployed independantly, by using the dokcer build and run commands. I advise to use dokcer compose to ease the DX.

In order to use docker compose, create a `.env` file in the project root directory, add all of the needed variables and run:

```bash
docker compose --env-file ./.env up -d
# Use the `--build` flag to rebuild the images
docker compose --env-file ./.env up -d --build
```

### Kubernetes

> Coming Soon

### Deployment and CI

The system uses Github actions as a CI solution, the actions run on each push to main or dev or on pull_request to main, you can customize it to your desire, and in order for the actions to function properly, you need to add two secrets to the repo, those are `DOCKER_ID` and `DOCKER_PASSWORD`.

The CI script has a deploy section, but it empty, so you can set it up with your provider of preference(such as AWS or GCP).

## Auth micro-service

A complete, and standalone, auth service built using **[Typescript](https://nodejs.org)**, **[Node JS](https://nodejs.org)** and **[Express](https://expressjs.com)**, while using **[MongoDB](https://mongodb.com)** as the database of choice, utilizing **[Mongoose](https://mongoosejs.com/)**, among others.

The service relies on **[JWTs](https://jwt.io)** as its main auth mechanisim, while utilizing cookies for the transport, as well as just sending the JWT for clients if they are unable to use cookies(A mobile app for instance).

### Setups

First thing, is creating a `.env` file inside the root directory, by copying the example one or by running

```bash
cp .env.exxmple .env
```

To run the server locally:

```bash
npm install   # to install the dependancies
npm run dev   # to run the dev server
```

To build the app:

```bash
npm run build   # to install the dependancies
npm start     # to start the server
```

---

## Marketplace micro-service

A complete, and standalone, marketplace service built using **[Typescript](https://nodejs.org)**, **[Node JS](https://nodejs.org)** and **[Express](https://expressjs.com)** among others.

The service relies on **[Stripe](https://stripe.com)** as its backbone

### Setups

First thing, is creating a `.env` file inside the root directory, by copying the example one or by running

```bash
cp .env.exxmple .env
```

To run the server locally:

```bash
npm install   # to install the dependancies
npm run dev   # to run the dev server
```

To build the app:

```bash
npm run build   # to install the dependancies
npm start     # to start the server
```
