#!/bin/bash -x

kubectl delete -f assets/20/demo/db-app.yml
kubectl delete -f assets/20/demo/apps.yml
kubectl delete all --all -n ci
kubectl delete ingress in-api,in-web -n ci

# kubectl delete all --all
kubectl delete sc local-storage
kubectl delete pvc -l app=mongodb
kubectl delete pv -l type=local
kubectl delete cm mongo-config mongodb-init
kubectl delete secret mongodb-key mongodb-admin

kubectl get all
