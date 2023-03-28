# vizhub3
VizHub Platform V3

## Docker
How to use Docker.

At the top level we have:

 * `Dockerfile` - defines a container for the `app` package
 * `deploy.sh` - automates building this package and deploying it to AWS Fargate

To test locally:

```
docker build -t vizhub3-app .
```

## Production Deployment

Production deployment follows the AWS patterns in [Create a CI/CD pipeline to deploy microservices with AWS Fargate and Amazon API Gateway](https://docs.aws.amazon.com/prescriptive-guidance/latest/patterns/create-a-ci-cd-pipeline-to-deploy-microservices-with-aws-fargate-and-amazon-api-gateway.html)
j

