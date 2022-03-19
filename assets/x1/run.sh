#!/bin/bash -x
kubectl apply -f assets/18/api-ingress.yml
kubectl apply -f assets/18/api-svc.yml
kubectl apply -f assets/18/api-deploy.yml

kubectl apply -f assets/18/web-ingress.yml
kubectl apply -f assets/18/web-svc.yml
kubectl apply -f assets/18/web-deploy.yml

watch kubectl get pods -l app=fulldemo
