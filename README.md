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

Production deployment follows the AWS patterns in [YouTube: AWS DevOps CI CD Pipeline With NodeJS + ECS + CodePipeline + ECR](https://www.youtube.com/watch?v=Iem8ZI517L4)
