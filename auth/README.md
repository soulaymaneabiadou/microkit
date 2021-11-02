# Auth micro-service

A complete auth service built using **[Typescript](https://nodejs.org)**, **[Node JS](https://nodejs.org)** and **[Express](https://expressjs.com)**, while using **[MongoDB](https://mongodb.com)** as the database of choice, utilizing **[Mongoose](https://mongoosejs.com/)**, among others.

The service relies on **[JWTs](https://jwt.io)** as its main auth mechanisim, while utilizing cookies for the transport, as well as just sending the JWT for clients if they are unable to use cookies(A mobile app for instance).

## Setup

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

## Docs

You can find the api docs at the following link: **[API Docs](https://documenter.getpostman.com/view/7211750/UUxwBU99)**

## Docker

If you like to use docker, we got you covered, just build the image, or use the ~~existing image~~; and then run it while providing an env file, as follows:

```bash
docker run -d --env-file ./.env -p LOCAL_PORT:INTERNAL_PORT {{DOCKER_TAG}}/auth
```

## Kubernetes

> Coming Soon
