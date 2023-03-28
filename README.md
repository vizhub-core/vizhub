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

## Fargate

See also:

- [Getting started with Amazon ECR](https://docs.aws.amazon.com/AmazonECR/latest/userguide/getting-started-console.html).
- [AWS Fargate: From Start to Finish for a NodeJS App](https://medium.com/@arliber/aws-fargate-from-start-to-finish-for-a-nodejs-app-9a0e5fbf6361)

To deploy to Fargate:

- Navigate to AWS Console / Amazon ECR / Repositories / `vizhub3`
- Click "View push commands"
- SSH into the bastion host EC2 instance
- Run the commands
- First time only: create an ELB and Task Definition, associate them
