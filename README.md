# vizhub3

VizHub Platform V3

## Docker

See also [Dockerizing a Node.js web app](https://nodejs.org/en/docs/guides/nodejs-docker-webapp)

How to use Docker to verify locally:

```
docker build -t vizhub3-app .
docker images
docker rmi <id>
docker run -p 5173:5173 -d vizhub3-app
docker ps
docker logs <id>
docker stop <id>
```

## Production Deployment

Production deployment uses:

- AWS AppRunner
- MongoDB Atlas
- Auth0

## Environment Variables

To enable use of MongoDB in development:
`export VIZHUB3_MONGO_LOCAL=true`

MongoDB variables:

```
VIZHUB3_MONGO_USERNAME
VIZHUB3_MONGO_PASSWORD
VIZHUB3_MONGO_DATABASE
```

Auth0 environment variables

```
export VIZHUB3_AUTH0_SECRET= <random string from `openssl rand -hex 32`>
export VIZHUB3_AUTH0_BASE_URL=
export VIZHUB3_AUTH0_CLIENT_ID=http://localhost:5173
export VIZHUB3_AUTH0_ISSUER_BASE_URL=
```
