#!/bin/bash -x

kubectl delete all --all && \
kubectl delete sc local-storage && \
kubectl delete pvc -l app=mongodb && \
kubectl delete pv -l type=local && \
kubectl delete cm mongo-config mongodb-init && \
kubectl delete secret mongodb-key mongodb-admin
