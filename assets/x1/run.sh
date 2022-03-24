#!/bin/bash -x
kubectl apply -f assets/x1/api-ingress.yml
kubectl apply -f assets/x1/api-svc.yml
kubectl apply -f assets/x1/api-deploy.yml

kubectl apply -f assets/x1/web-ingress.yml
kubectl apply -f assets/x1/web-svc.yml
kubectl apply -f assets/x1/web-deploy.yml

watch kubectl get pods -l app=fulldemo
