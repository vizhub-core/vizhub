FROM node:19
WORKDIR /usr/src/vizhub3
COPY . .
RUN npm install
WORKDIR /usr/src/vizhub3/app
RUN npm run build
EXPOSE 5173
CMD [ "npm", "run", "serve" ]