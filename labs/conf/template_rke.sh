#!/bin/bash -x
export TZ="America/Costa_Rica"
date +%z
date '+%Y/%m/%d %H:%M:%S %z' > /home/${username}/ilog
echo "Instaling RKE + Kubectl..." >> /home/${username}/ilog
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
# SSH
#
sed -i "s/PasswordAuthentication no/PasswordAuthentication yes/g" /etc/ssh/sshd_config
sed -i 's/#AllowTcpForwarding yes/AllowTcpForwarding yes/g' /etc/ssh/sshd_config
systemctl reload sshd
# copy ssh key's
if ! command -v sshpass &> /dev/null
then
		sudo apt-get install sshpass
		echo 'SSHpass installed!' >> /home/${username}/ilog
else echo 'SSHpass already installed!' >> /home/${username}/ilog
fi

if ! test -f "/home/${username}/.ssh/id_rsa"
then
	runuser -l ${username} -c  "ssh-keygen -b 2048 -t rsa -f /home/${username}/.ssh/id_rsa -C ${username} -q -N ''"
	chmod 600 /home/${username}/.ssh/id_rsa*
	chown ${username}:${username} /home/${username}/.ssh/id_rsa*
	echo 'SSH keys created!' >> /home/${username}/ilog
else echo 'SSH keys already created!' >> /home/${username}/ilog
fi

# agrega llaves ssh localmente
ssh-keygen -f "/home/${username}/.ssh/known_hosts" -R ${NODE_PUBLIC_IP} >> /home/${username}/ilog
runuser -l ${username} -c "sshpass -p 'password' ssh-copy-id -i /home/${username}/.ssh/id_rsa.pub -o StrictHostKeyChecking=no ${username}@${NODE_PUBLIC_IP}" >> /home/${username}/ilog

# Share ssh keys
echo "Finding  nodes..." >> /home/${username}/ilog
for node in "kubeworker01" "kubeworker02"
do
	echo "$node" >> /home/${username}/ilog
	if ping -c 1 $node &> /dev/null
	then
		# conecta al nodo y agrega ssh
		ssh-keygen -f "/home/${username}/.ssh/known_hosts" -R $node >> /home/${username}/ilog
		runuser -l ${username} -c "sshpass -p 'password' ssh-copy-id -i /home/${username}/.ssh/id_rsa.pub -o StrictHostKeyChecking=no ${username}@$node" >> /home/${username}/ilog
		ssh ${username}@$node "ssh-keygen -f "/home/${username}/.ssh/known_hosts" -R ${NODE_PUBLIC_IP}" >> /home/${username}/ilog
		ssh ${username}@$node "sshpass -p 'password' ssh-copy-id -i /home/${username}/.ssh/id_rsa.pub -o StrictHostKeyChecking=no ${username}@${NODE_PUBLIC_IP}" >> /home/${username}/ilog
		echo "$node ok" >> /home/${username}/ilog
	else
		echo "$node offline :(" >> /home/${username}/ilog
	fi
done

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
# echo "Instaling Brew + Kubecolor + Stern + Kustomize + RKE ..." >> /home/${username}/ilog
# sudo apt-get install -y build-essential
# runuser -l ${username} -c '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" \ </dev/null'
# echo "Brew!!!" >> /home/${username}/ilog

# # echo 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"' >> /home/${username}/.bashrc
# # runuser -l ${username} -c 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"'
# # eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"

# test -d ~/.linuxbrew && eval "$(~/.linuxbrew/bin/brew shellenv)"
# test -d /home/linuxbrew/.linuxbrew && eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"
# test -r ~/.bash_profile && echo "eval \"\$($(brew --prefix)/bin/brew shellenv)\"" >>~/.bash_profile
# test -r /home/$username/.bash_profile && echo "eval \"\$($(brew --prefix)/bin/brew shellenv)\"" >>/home/$username/.bash_profile
# echo "eval \"\$($(brew --prefix)/bin/brew shellenv)\"" >>~/.profile
# echo "eval \"\$($(brew --prefix)/bin/brew shellenv)\"" >>/home/$username/.profile



# runuser -l ${username} -c 'brew install gcc'


# # kubecolor
# runuser -l ${username} -c 'brew install hidetatz/tap/kubecolor'
# echo "Kubecolor!!!" >> /home/${username}/ilog
# echo 'function kubecolor() { echo "+ kubectl $@">&2; command kubecolor $@; }' >> /home/${username}/.bashrc
# runuser -l ${username} -c  'complete -o default -F __start_kubectl kubecolor'
# runuser -l ${username} -c  'complete -o default -F __start_kubectl k'
# # Stern
# runuser -l ${username} -c 'brew install stern'
# echo "Stern!!!" >> /home/${username}/ilog
# # Kustomize
# runuser -l ${username} -c 'brew install kustomize'
# echo "Kustomize!!!" >> /home/${username}/ilog
# # rke
# runuser -l ${username} -c 'brew install rke'
# echo "RKE!!!" >> /home/${username}/ilog

#
# rke config
#

# RKE manual installation
wget https://github.com/rancher/rke/releases/download/v1.2.9/rke_linux-amd64
chmod +x rke_linux-amd64
cp rke_linux-amd64 /usr/local/bin/rke
which rke

# master node
sudo sed -i "s/MASTER_PUBLIC_IP_01/${MASTER_PUBLIC_IP_01}/g" /home/${username}/rke-cluster.yml
sudo sed -i "s/MASTER_PRIVATE_IP_01/${MASTER_PRIVATE_IP_01}/g" /home/${username}/rke-cluster.yml
sudo sed -i "s/USERNAME/${username}/g" /home/${username}/rke-cluster.yml
# worker nodes
sudo sed -i "s/WORKER_PUBLIC_IP_01/${WORKER_PUBLIC_IP_01}/g" /home/${username}/rke-cluster.yml
sudo sed -i "s/WORKER_PRIVATE_IP_01/${WORKER_PRIVATE_IP_01}/g" /home/${username}/rke-cluster.yml
sudo sed -i "s/WORKER_PUBLIC_IP_02/${WORKER_PUBLIC_IP_02}/g" /home/${username}/rke-cluster.yml
sudo sed -i "s/WORKER_PRIVATE_IP_02/${WORKER_PRIVATE_IP_02}/g" /home/${username}/rke-cluster.yml

#
# launch rke
#
runuser -l ${username} -c "rke up --config /home/${username}/rke-cluster.yml" > /home/${username}/rke_log
sleep 60

mkdir /home/${username}/.kube
cp /home/${username}/kube_config_rke-cluster.yml /home/${username}/.kube/config
sudo chown -R ${username}:${username} /home/${username}/.kube

#
# tools
#

# kustomize
sudo snap install kustomize

# argocd
runuser -l ${username} -c "kubectl create namespace argocd"
runuser -l ${username} -c "kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml"
runuser -l ${username} -c "kubectl apply -f /home/${username}/argocd-nodePort.yml"

runuser -l ${username} -c "cat  <<EOF | kubectl apply -f -
"

# helm
# sudo snap install helm --classic
runuser -l ${username} -c "curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3"
runuser -l ${username} -c "chmod 700 get_helm.sh"
runuser -l ${username} -c "./get_helm.sh"
runuser -l ${username} -c "helm repo add bitnami https://charts.bitnami.com/bitnami"

# cert-manager
runuser -l ${username} -c "kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.6.1/cert-manager.yaml"

# metalLB - no es necesario en esta versión
# runuser -l ${username} -c "kubectl apply -f https://raw.githubusercontent.com/metallb/metallb/v0.11.0/manifests/namespace.yaml"
# runuser -l ${username} -c "kubectl apply -f https://raw.githubusercontent.com/metallb/metallb/v0.11.0/manifests/metallb.yaml"


# lets encrypt



# Taint master nodes
# kubectl taint nodes  kubemaster01 node-role.kubernetes.io/master=true:NoSchedule


echo "*** FIN ***" >> /home/${username}/ilog
date '+%Y/%m/%d %H:%M:%S %z' >> /home/${username}/ilog


