# vizhub3

VizHub Platform V3


## Getting Started as a VizHub Developer

### UI Development Only

If all you need to do is change UI, that is located in the `components` package:

```
cd vizhub3
npm install
cd components
npm run dev
```

### Full Stack App Development

To develop locally, all you need is:

 * A local instance of MongoDB - see [Install MongoDB Community Edition on Ubuntu](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/#std-label-install-mdb-community-ubuntu)
 * NodeJS

In the root (`vizhub3`) or in the `app` package (`vizhub3/app`), run the following to start the VizHub dev server:

```
npm run dev
```

To see what this script does, look at `package.json` in the `scripts` property.

Note: you only need to run `npm run build` for a production build, not for local development.

### Contribution Guidelines

Please run Prettier on the code for each Pull Request.

 * Suggested workflow: enable VSCode Prettier extension to format the document on save
 * Alternative: run `npm run prettier` to format the code

## Environment Variables

To enable use of MongoDB in development:
`export VIZHUB3_MONGO_LOCAL=true`

MongoDB variables:

```
VIZHUB3_MONGO_USERNAME
VIZHUB3_MONGO_PASSWORD
VIZHUB3_MONGO_DATABASE
```

Authentication is managed by Auth0.

Auth0 environment variables:

```
export VIZHUB3_AUTH0_SECRET= <>
export VIZHUB3_AUTH0_BASE_URL=
export VIZHUB3_AUTH0_CLIENT_ID=
export VIZHUB3_AUTH0_ISSUER_BASE_URL=
```

- VIZHUB3_AUTH0_CLIENT_ID - This is found in the Auth0 UI under "Basic information" and called "Client ID".
- VIZHUB3_AUTH0_SECRET - This is found in the Auth0 UI under "Basic information" and called "Client Secret. It may also be possible to generate this from `openssl rand -hex 32`, not sure.
- VIZHUB3_AUTH0_ISSUER_BASE_URL - This is found in the Auth0 UI under "Basic information" and called "Domain". It probably ends in "us.auth0.com" unless a custom domain has been configured. **Note** you need to put `https://` in front of the value that you copy out of the Auth0 UI.
- export VIZHUB3_AUTH0_BASE_URL - This is the URL for the site, for example `https://beta.vizhub.com`

In the "Application URIs" config inside the Auth0 UI:

- "Application Login URI" - http://localhost:5173/login
- "Allowed Callback URLs" - http://localhost:5173/login/callback - this is unique as per the GitHub "plugin" thing

Example `.bashrc`:

```
export VIZHUB3_MONGO_LOCAL=true
export VIZHUB3_AUTH0_SECRET=7OsDu5GSODQStQhJ9t4ng31v2udKK08L7ZB_YDPlQchMtZQ6aBCeRIZenxp8D_f9n
export VIZHUB3_AUTH0_BASE_URL=http://localhost:5173
export VIZHUB3_AUTH0_CLIENT_ID=faBeeyfQBSm11XbTGT45AMTDjk9noHnJ
export VIZHUB3_AUTH0_ISSUER_BASE_URL=dev-5yxv3gr1hihugt46.us.auth0.com
```

## Demo Database

To populate your local database with sample data for development, run:

```
cd demo
npm run populate
```

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

- AWS CodePipeline, CodeBuild, Fargate
- Continuous deployment for beta.vizhub.com based on `fargate-beta` branch
- MongoDB Atlas
- Auth0

### Auth-related Errors

```
OPError: invalid_token
```

Happens when a call to `req.oidc.fetchUserInfo();` doesn't pass the right credentials.

To fix: Remove the `req.oidc.fetchUserInfo();` call, then research credentials (never done).
