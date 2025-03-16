# Using this to avoid DockerHub rate limit
# https://gallery.ecr.aws/docker/library/node
FROM public.ecr.aws/docker/library/node:21

WORKDIR /usr/src/vizhub3
COPY . .
RUN npm install
RUN npm run build
EXPOSE 5173

CMD [ "npm", "run", "serve" ]