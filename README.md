# Microservices

A collection of microservices, aimed at easing the development of new apps under the microservice architecture(can be used to quick start an app as a monolith using some of its parts).

# What's Included / Services

### Auth micro-service

A complete, and standalone, auth service built using **[Typescript](https://nodejs.org)**, **[Node JS](https://nodejs.org)** and **[Express](https://expressjs.com)**, while using **[MongoDB](https://mongodb.com)** as the database of choice, utilizing **[Mongoose](https://mongoosejs.com/)**, among others.

The service relies on **[JWTs](https://jwt.io)** as its main auth mechanisim, while utilizing cookies for the transport, as well as just sending the JWT for clients if they are unable to use cookies(A mobile app for instance), and sends mails using nodemailer for now.

---

### Kubernetes

> There are a few secrets that should be set, since the manifests relies on them to pass envs to the containers. Those are: `jwt-secrets` and `smtp-secrets`.

All services have at least a depl + srv in a file named `<service_name>-depl.yml`
Some services, who require a database, have an accompaning file named `<service_name>-<db_provider>-depl.yml`

---

### Deployment and CI

The system uses Github actions as a CI solution and Digital Ocean as a Cloud Provider, in order for the actions to function properly, you need to add a few secrets to the repo, those are `DOCKER_USERNAME`, `DOCKER_PASSWORD` and `DIGITALOCEAN_ACCESS_TOKEN`.

##### Steps

- Create a DO cluster:
  - capacity(3 of the standard nodes for 10USD/month each)
  - set a name for the cluster
- use kubectl to connect to the cluster via the context:
  - install doctl
  - generate an access token from the api tab on DO for doctl for both dev and for prod to use on gh action
  - authenticate doctl: `doctl auth init`
  - use `doctl kubernetes cluster kubeconfig save <name>` to set the context
- Set a gh workflow file for each service for tests and deployments
- Setup `ingress-nginx` on DO using its docs for that on the cluster context

##### Notes

- list context: `kubectl config view`
- use context: `kubectl config use-context <name>`
