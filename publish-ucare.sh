docker build --platform linux/amd64 -t europe-docker.pkg.dev/gcp-tc-ucare-global/ucare-docker-hub/octo/ops -f docker/DockerfileOcto .
docker push --platform linux/amd64 europe-docker.pkg.dev/gcp-tc-ucare-global/ucare-docker-hub/octo/ops
