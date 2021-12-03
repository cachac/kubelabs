#!/bin/bash -x

kubectl delete all --all && \
kubectl delete ingress in-api,in-web
