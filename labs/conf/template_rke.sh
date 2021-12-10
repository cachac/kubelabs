#!/bin/bash -x
export TZ="America/Costa_Rica"
date +%z
date '+%Y/%m/%d %H:%M:%S %z' > /home/${username}/ilog
echo "Instaling Microk8s + Kubectl..." >> /home/${username}/ilog
export DEBIAN_FRONTEND=noninteractive

#
# system
#
sudo usermod -aG sudo ${username}
echo -e "password\npassword\n" | passwd ${username}
sudo mkdir /logs
sudo apt update
sudo ufw disable
# disable swap
sudo swapoff -a
sudo sed -i '/ swap / s/^\(.*\)$/#\1/g' /etc/fstab
# ip tables
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
EOF
sudo sysctl --system
sudo modprobe br_netfilter
sudo sh -c "echo '1' > /proc/sys/net/bridge/bridge-nf-call-iptables"
sudo sh -c "echo '1' > /proc/sys/net/ipv4/ip_forward"

#
# docker
#
if ! command -v docker &> /dev/null
then
    curl -fsSL https://get.docker.com -o get-docker.sh
		sudo sh get-docker.sh
		sudo usermod -aG docker ${username}
		newgrp docker
		echo 'Docker installed!' >> /home/${username}/ilog
else echo 'Docker already installed!' >> /home/${username}/ilog
fi

# kubectl
if ! command -v kubectl &> /dev/null
then
    sudo apt-get update && sudo apt-get install -y apt-transport-https
		curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
		echo "deb https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee -a /etc/apt/sources.list.d/kubernetes.list
		sudo apt-get update
		sudo apt-get install -y kubectl
		#
		echo "[ -f ~/.kubectl_aliases ] && source <(cat ~/.kubectl_aliases | sed -r 's/(kubectl.*) --watch/watch \1/g')" >> /home/${username}/.bashrc
		echo 'function kubectl() { echo "+ kubectl $@">&2; command kubectl $@; }' >> /home/${username}/.bashrc
		echo "source <(kubectl completion bash)" >> /home/${username}/.bashrc
		runuser -l ${username} -c  'complete -F __start_kubectl k'

		echo 'Kubectl installed!' >> /home/${username}/ilog
else echo 'Kubectl already installed!' >> /home/${username}/ilog
fi

#
# brew
#
echo "Instaling Brew + Kubecolor + Stern + Kustomize + RKE ..." >> /home/${username}/ilog
sudo apt-get install -y build-essential
runuser -l ${username} -c '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" \ </dev/null'
echo "Brew!!!" >> /home/${username}/ilog

date '+%Y/%m/%d %H:%M:%S %z' >> /home/${username}/ilog
echo 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"' >> /home/${username}/.bashrc
runuser -l ${username} -c 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"'
runuser -l ${username} -c 'brew install gcc'
# kubecolor
runuser -l ${username} -c 'brew install hidetatz/tap/kubecolor'
echo "Kubecolor!!!" >> /home/${username}/ilog
echo 'function kubecolor() { echo "+ kubectl $@">&2; command kubecolor $@; }' >> /home/${username}/.bashrc
runuser -l ${username} -c  'complete -o default -F __start_kubectl kubecolor'
runuser -l ${username} -c  'complete -o default -F __start_kubectl k'
# Stern
runuser -l ${username} -c 'brew install stern'
echo "Stern!!!" >> /home/${username}/ilog
# Kustomize
runuser -l ${username} -c 'brew install kustomize'
echo "Kustomize!!!" >> /home/${username}/ilog
# rke
runuser -l ${username} -c 'brew install rke'
echo "RKE!!!" >> /home/${username}/ilog


#
# rke config
#

# master node
sudo sed -i "s/MASTER_PUBLIC_IP/${MASTER_PUBLIC_IP}/g" /home/${username}/rke-cluster.yml
sudo sed -i "s/MASTER_PRIVATE_IP/${MASTER_PRIVATE_IP}/g" /home/${username}/rke-cluster.yml
sudo sed -i "s/USERNAME/${username}/g" /home/${username}/rke-cluster.yml
# worker nodes
sudo sed -i "s/WORKER_PUBLIC_IP_01/${WORKER_PUBLIC_IP_01}/g" /home/${username}/rke-cluster.yml
sudo sed -i "s/WORKER_PRIVATE_IP_01/${WORKER_PRIVATE_IP_01}/g" /home/${username}/rke-cluster.yml
sudo sed -i "s/WORKER_PUBLIC_IP_02/${WORKER_PUBLIC_IP_02}/g" /home/${username}/rke-cluster.yml
sudo sed -i "s/WORKER_PRIVATE_IP_02/${WORKER_PRIVATE_IP_02}/g" /home/${username}/rke-cluster.yml


echo "*** FIN ***" >> /home/${username}/ilog
date '+%Y/%m/%d %H:%M:%S %z' >> /home/${username}/ilog


