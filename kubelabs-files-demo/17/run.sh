#!/bin/bash -x
kubectl apply -f kubelabs-files-demo/17/headless-svc.yml
kubectl apply -f kubelabs-files-demo/17/local-sc.yml
kubectl apply -f kubelabs-files-demo/17/data-pv.yml
kubectl apply -f kubelabs-files-demo/17/mongoconf-cm.yml
kubectl apply -f kubelabs-files-demo/17/mongodbkey-secret.yml
kubectl apply -f kubelabs-files-demo/17/mongodbadmin-secret.yml
kubectl apply -f kubelabs-files-demo/17/mongodb-sts.yml
# kubectl exec mongodb-2 -- mongo admin -u admin -p admin --eval "rs.status().members.forEach(function(z){printjson(z.name);printjson(z.stateStr);})"
watch kubectl get pods -l app=mongodb
