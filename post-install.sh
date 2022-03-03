#!/bin/bash -x

sudo usermod -a -G microk8s kube
newgrp microk8s

mkdir .kube
microk8s kubectl config view --raw > ~/.kube/config
sudo chown -f -R kube ~/.kube

# instalar kubectl
sudo snap install kubectl --classic

# habilitar addons
sudo microk8s.enable dns dashboard storage ingress helm


sudo sh -c 'echo "--allow-privileged=true" >> /var/snap/microk8s/current/args/kube-apiserver'
sudo systemctl restart snap.microk8s.daemon-apiserver.service

# alias kubectl (opcional)
echo "[ -f ~/.kubectl_aliases ] && source <(cat ~/.kubectl_aliases | sed -r 's/(kubectl.*) --watch/watch \1/g')" >> ~/.bashrc
echo 'function kubectl() { echo "+ kubectl $@">&2; command kubectl $@; }' >> .bashrc
echo "source <(kubectl completion bash)" >> .bashrc
complete -F __start_kubectl k


# probar instalación
kubectl get nodes
