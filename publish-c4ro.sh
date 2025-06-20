docker build --platform linux/amd64 -t europe-west1-docker.pkg.dev/gcp-ro-integration-devops-main/gcp-ro-docker-hub/octo/c4ro -f docker/DockerfileOcto .
docker push --platform linux/amd64 europe-west1-docker.pkg.dev/gcp-ro-integration-devops-main/gcp-ro-docker-hub/octo/c4ro
