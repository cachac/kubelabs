#!/bin/bash -x

sudo apt update
sudo iptables -P FORWARD ACCEPT
sudo apt install snapd
sudo snap install microk8s --classic --channel=1.22/stable
sudo microk8s status --wait-ready
sudo mkdir /home/${username}/.kube
sudo microk8s kubectl config view --raw > /home/${username}/.kube/config
sudo snap install kubectl --classic
sudo microk8s.enable dns dashboard storage ingress helm
# config
sudo sh -c 'echo "--allow-privileged=true" >> /var/snap/microk8s/current/args/kube-apiserver'
sudo systemctl restart snap.microk8s.daemon-apiserver.service
echo "[ -f ~/.kubectl_aliases ] && source <(cat ~/.kubectl_aliases | sed -r 's/(kubectl.*) --watch/watch \1/g')" >> /home/${username}/.bashrc
echo 'function kubectl() { echo "+ kubectl $@">&2; command kubectl $@; }' >> /home/${username}/.bashrc
echo "source <(kubectl completion bash)" >> /home/${username}/.bashrc
runuser -l ${username} -c  'complete -F __start_kubectl k'

# permisos
sudo usermod -a -G microk8s ${username}
sudo chown -f -R ${username} ~/.kube
# newgrp microk8s
