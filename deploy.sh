git pull
docker build -t vizhub3 .
docker tag vizhub3:latest 638829852636.dkr.ecr.us-east-1.amazonaws.com/vizhub3:latest
docker push 638829852636.dkr.ecr.us-east-1.amazonaws.com/vizhub3:latest
