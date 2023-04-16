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

## Auth0 Setup

Authentication is managed by Auth0.

Auth0 environment variables:

```
export VIZHUB3_AUTH0_SECRET= <random string from `openssl rand -hex 32`>
export VIZHUB3_AUTH0_BASE_URL=
export VIZHUB3_AUTH0_CLIENT_ID=http://localhost:5173
export VIZHUB3_AUTH0_ISSUER_BASE_URL=
```

Use [Caddy](https://caddyserver.com/docs/install#debian-ubuntu-raspbian) for local HTTPS.

In the "Application URIs" config inside the Auth0 UI:

- "Application Login URI" - http://localhost:5173/login
- "Allowed Callback URLs" - http://localhost:5173/login/callback - this is unique as per the GitHub "plugin" thing

### Auth-related Errors

```
OPError: invalid_token
```

Happens when a call to `req.oidc.fetchUserInfo();` doesn't pass the right credentials.

To fix: Remove the `req.oidc.fetchUserInfo();` call, then research credentials (never done).
