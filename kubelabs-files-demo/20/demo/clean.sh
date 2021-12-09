#!/bin/bash -x

kubectl delete -f kubelabs-files-demo/20/demo/db-app.yml
kubectl delete -f kubelabs-files-demo/20/demo/apps.yml
kubectl delete all --all
kubectl delete ingress in-api,in-web

chmod +x kubelabs-files-demo/17/clean.sh && ./kubelabs-files-demo/17/clean.sh
