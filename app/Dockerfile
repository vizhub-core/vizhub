FROM node:19
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 5173
CMD [ "npm", "run", "serve" ]

