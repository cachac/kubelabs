name: CI

on:
  push:
    # Publish `main` branch as Docker `latest` image.....
    branches:
      - main
    tags:
      - "v*"
  # Run tests for any PRs.
  # pull_request:

env:
  IMAGE_NAME: kube_webapp_ci

jobs:
  # TODO Run tests.
  # Push image to GitHub Packages.
  build:
    runs-on: ubuntu-latest
    if: github.event_name == 'push'

    steps:
      - uses: actions/checkout@v2

      - name: Build image
        run: docker build . --file ./dev/frontend/ci.dockerfile --tag image

      - name: Log into registry
        run: echo "${{ secrets.GITHUB_TOKEN }}" | docker login docker.pkg.github.com -u ${{ github.actor }} --password-stdin

      - name: Push image Github Package
        run: |
          IMAGE_ID=docker.pkg.github.com/${{ github.repository }}/$IMAGE_NAME
          # Change all uppercase to lowercase
          IMAGE_ID=$(echo $IMAGE_ID | tr '[A-Z]' '[a-z]')
          # Strip git ref prefix from version
          VERSION=$(echo "${{ github.ref }}" | sed -e 's,.*/\(.*\),\1,')
          # Strip "v" prefix from tag name
          [[ "${{ github.ref }}" == "refs/tags/"* ]] && VERSION=$(echo $VERSION | sed -e 's/^v//')
          echo $VERSION
          # Use Docker `latest` tag convention.
          [ "$VERSION" == "main" ] && VERSION=latest

          echo IMAGE_ID=$IMAGE_ID
          echo VERSION=$VERSION
          docker tag image $IMAGE_ID:$VERSION
          docker push $IMAGE_ID:$VERSION

      - uses: docker/login-action@f054a8b539a109f9f41c372932f1ae047eff08c9
        name: Log in to Docker Hub
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - uses: docker/metadata-action@98669ae865ea3cffbcbaa878cf57c20bbf1c6c38
        name: Extract metadata (tags, labels) for Docker
        id: meta
        with:
          images: cachac/kube_webapp_ci

      # - name: Build and push Docker image
      #   uses: docker/build-push-action@ad44023a93711e3deb337508980b4b5e9bcdc5dc
      #   with:
      #     context: .
      #     push: true
      #     tags: ${{ steps.meta.outputs.tags }}
      #     labels: ${{ steps.meta.outputs.labels }}

      - uses: actions/checkout@master

      - uses: elgohr/Publish-Docker-Github-Action@master
        name: Publish to Registry
        with:
          name: cachac/$IMAGE_NAME
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
          default_branch: main
