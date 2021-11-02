# Payments micro-service

A complete payments service built using **[Typescript](https://nodejs.org)**, **[Node JS](https://nodejs.org)** and **[Express](https://expressjs.com)**, while using **[MongoDB](https://mongodb.com)** as the database of choice, utilizing **[Mongoose](https://mongoosejs.com/)**, among others.

The service relies on **[Stripe](https://stripe.com)** as its backbone

## Setup

First thing, is creating a `.env` file inside the root directory, add the following to it

```bash
NODE_ENV=development
PORT=

# Stripe


# For CORS
CLIENT_URL=http://localhost:3000
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
docker run -d --env-file ./.env -p LOCAL_PORT:INTERNAL_PORT {{DOCKER_TAG}}/payments
```

## Kubernetes

> Coming Soon
