#!/bin/bash -x
date '+%Y/%m/%d %H:%M:%S %z' > /home/${username}/ilog
echo "Instalar Microk8s" >> /home/${username}/ilog
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

# alias
# https://github.com/ahmetb/kubectl-aliases
echo "[ -f ~/.kubectl_aliases ] && source <(cat ~/.kubectl_aliases | sed -r 's/(kubectl.*) --watch/watch \1/g')" >> /home/${username}/.bashrc
echo 'function kubectl() { echo "+ kubectl $@">&2; command kubectl $@; }' >> /home/${username}/.bashrc
# bash completion
# https://kubernetes.io/docs/reference/kubectl/cheatsheet/#bash
runuser -l ${username} -c 'source <(kubectl completion bash)'
echo "source <(kubectl completion bash)" >> /home/${username}/.bashrc
runuser -l ${username} -c  'complete -F __start_kubectl k'

# permisos
sudo usermod -a -G microk8s ${username}
sudo chown -f -R ${username} ~/.kube
runuser -l ${username} -c "newgrp microk8s"

# config remote access to kubectl
echo "external IP ${external_ip}" >> /home/${username}/ilog
# no es necesario editar los certificados. Solo se tiene que agregar el servidor con la ip externa en el cluster (set-cluster)
# sudo sed -e "s/#MOREIPS/IP.3 = ${external_ip}/" /var/snap/microk8s/current/certs/csr.conf.template

sudo microk8s kubectl config set-cluster microk8s-cluster --server=https://${external_ip}:16443 --insecure-skip-tls-verify

# kubecolor
# https://github.com/hidetatz/kubecolor
echo "Kubecolor" >> /home/${username}/ilog
# brew: https://www.how2shout.com/linux/how-to-install-brew-ubuntu-20-04-lts-linux/
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" \ </dev/null
# echo | /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"

echo 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"' >> /home/${username}/.profile
eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"
sudo apt-get install -y build-essential
brew install gcc
brew install hidetatz/tap/kubecolor
runuser -l ${username} -c  'complete -o default -F __start_kubectl kubecolor'
runuser -l ${username} -c  'complete -o default -F __start_kubectl k'

echo "*** FIN ***" >> /home/${username}/ilog
