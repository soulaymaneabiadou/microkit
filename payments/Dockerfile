## this is the stage one , also know as the build step
FROM node:alpine
WORKDIR /usr/src/app
COPY package*.json tsconfig.json ./
RUN npm install
COPY . .
RUN npm run build

## this is stage two , where the app actually runs
FROM node:alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=prod
COPY --from=0 /usr/src/app/dist ./dist
USER node
EXPOSE 5000

CMD [ "npm", "start" ]