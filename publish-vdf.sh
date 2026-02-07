docker build --platform linux/amd64 -t 600944459166.dkr.ecr.eu-central-1.amazonaws.com/octo-central -f docker/DockerfileOcto .
docker push --platform linux/amd64 600944459166.dkr.ecr.eu-central-1.amazonaws.com/octo-central
