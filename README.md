# VizHub

This repository contains the open source core of the VizHub platform.

Tour of the app:

- https://vizhub.com/explore - Explore user generated content
  ![image](https://github.com/user-attachments/assets/297ac688-88ab-42f1-b04c-47e66ac9d153)
- https://vizhub.com/curran - An example Profile Page
  ![image](https://github.com/user-attachments/assets/17a0794d-3f05-46b1-bd4e-e2076a055c39)
- https://vizhub.com/curran/circles-with-d3 - An example Viz Page
  ![image](https://github.com/user-attachments/assets/5bacc288-c407-4a64-8d50-ec0895a62ee6)
- https://vizhub.com/curran/circles-with-d3?edit=files&file=index.js - The Viz Page with editor open ([VZCode](https://github.com/vizhub-core/vzcode)), which lets you edit code in the browser
  ![image](https://github.com/user-attachments/assets/033f129e-cd6f-4dec-92f8-e5359d8875cf)

All code changes are synchronized in real time to remote collaborators. You can use "interactive widgets" using Alt+drag on numbers for truly instant feedback (~60FPS hot reloading for simple examples).

## Getting Started as a VizHub Developer

### UI Development Only

If all you need to do is change UI, that is located in the `components` package:

```
cd vizhub3
npm install
cd components
npm run dev
```

### Full Stack App Development / Self Hosting

To develop locally, all you need is:

- A local instance of MongoDB - see [Install MongoDB Community Edition on Ubuntu](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/#std-label-install-mdb-community-ubuntu), or use `docker compose up` with the provided `docker-compose.yml` file.
- NodeJS latest

```
docker compose up
```

In the root (`vizhub`) or in the `app` package (`vizhub/app`), run the following to start the VizHub dev server:

```
npm run dev
```

To see what this script does, look at `package.json` in the `scripts` property.

## Environment Variables

Use `.env`, see `.env.example` for reference.

To enable use of MongoDB in development:
`export vizhub3_MONGO_LOCAL=true`

MongoDB variables:

```
vizhub3_MONGO_USERNAME
vizhub3_MONGO_PASSWORD
vizhub3_MONGO_DATABASE
```

Authentication is managed by Auth0.

Auth0 environment variables:

```
export vizhub3_AUTH0_SECRET= <>
export vizhub3_AUTH0_BASE_URL=
export vizhub3_AUTH0_CLIENT_ID=
export vizhub3_AUTH0_ISSUER_BASE_URL=
```

- vizhub3_AUTH0_CLIENT_ID - This is found in the Auth0 UI under "Basic information" and called "Client ID".
- vizhub3_AUTH0_SECRET - This is found in the Auth0 UI under "Basic information" and called "Client Secret. It may also be possible to generate this from `openssl rand -hex 32`, not sure.
- vizhub3_AUTH0_ISSUER_BASE_URL - This is found in the Auth0 UI under "Basic information" and called "Domain". It probably ends in "us.auth0.com" unless a custom domain has been configured. **Note** you need to put `https://` in front of the value that you copy out of the Auth0 UI.
- export vizhub3_AUTH0_BASE_URL - This is the URL for the site, for example `https://beta.vizhub.com`

In the "Application URIs" config inside the Auth0 UI:

- "Application Login URI" - http://localhost:5173/login
- "Allowed Callback URLs" - http://localhost:5173/login/callback - this is unique as per the GitHub "plugin" thing

[Screenshot Genie](https://screenshotgenie.com/) API key for thumbnail generation:

```
SCREENSHOT_GENIE_API_KEY=
```

For "Edit with AI":

```
VIZHUB_EDIT_WITH_AI_MODEL_NAME=google/gemini-flash-1.5
VIZHUB_EDIT_WITH_AI_API_KEY=
VIZHUB_EDIT_WITH_AI_BASE_URL=https://openrouter.ai/api/v1
```

## Demo Database

To populate your local database with sample data for development or to seed a self-hosted instance with the "primordial viz", run:

```
cd demo
npm run populate
```

## Testing Premium Features

To make yourself on the Premium plan locally, do this, replacing `myUserName` with your GitHub username:

enter mongo shell

```
docker exec -it mongodb mongosh
```

within mongo shell

```
use vizhub3
db.user.updateOne({ userName: "myUserName" },{ $set: { plan: "premium" } } )
```

restart dev server `npm run dev` (need to restart whenever you change things in Mongo, since ShareDB caches the data in memory sometimes).

### Auth-related Errors

```
OPError: invalid_token
```

Happens when a call to `req.oidc.fetchUserInfo();` doesn't pass the right credentials.

To fix: Remove the `req.oidc.fetchUserInfo();` call, then research credentials (never done).
