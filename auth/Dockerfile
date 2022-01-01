## this is the stage one , also know as the build step
FROM node:16-alpine as Build
WORKDIR /usr/src/app
COPY package*.json tsconfig.json ./
RUN npm install
COPY . .
RUN npm run build

## this is stage two , where the app actually runs
FROM node:16-alpine as Serve
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=prod
COPY --from=Build /usr/src/app/dist ./dist
USER node
EXPOSE 5000

CMD [ "npm", "start" ]