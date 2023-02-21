## AWS

Setup for VizHub 3 production deployment:

 * ECS Fargate in VPC "VizHub 3" in subnet us-east-1d
 * CodePipeline setup to automatically deploy Docker image
 * EC2 bastion host inside the same subnet

### Deployment Process

 * SSH into bastion host
 * Build docker image there
 * Transfer into ECR
 * CodePipeline takes over from there and deploys to Fargate

### AWS DocumentDB (MongoDB) Database Setup

Master username: `Administrator`
Password: `letmein!`

Encryption at rest is enabled.

Encryption in transit is enabled.

This works:
```
var client = MongoClient.connect(
'mongodb://Administrator:letmein!@vizhub3proddb.cluster-cb4txtpp8ror.us-east-1.docdb.amazonaws.com:27017/?tls=true&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false',
{
  tlsCAFile: `rds-combined-ca-bundle.pem` //Specify the DocDB; cert
},
```


### AWS MemoryDB (Redis) Setup

Encryption at rest is enabled.

Encryption in transit is enabled.

Redis version compatibility 6.2

us-east-1d NOT a supported availability zone

Uses us-east-1b

This works:

```
redis-cli -h clustercfg.vizhub3.jdocwz.memorydb.us-east-1.amazonaws.com --tls -p 6379 PING
```
