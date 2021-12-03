#!/bin/bash -x
kubectl apply -f kubelabs-files-demo/18/api-ingress.yml
kubectl apply -f kubelabs-files-demo/18/api-svc.yml
kubectl apply -f kubelabs-files-demo/18/api-deploy.yml

kubectl apply -f kubelabs-files-demo/18/web-ingress.yml
kubectl apply -f kubelabs-files-demo/18/web-svc.yml
kubectl apply -f kubelabs-files-demo/18/web-deploy.yml

watch kubectl get pods -l app=fulldemo
