#!/bin/bash -x

# https://github.com/hidetatz/kubecolor
# brew: https://www.how2shout.com/linux/how-to-install-brew-ubuntu-20-04-lts-linux/
sudo apt-get install -y build-essential
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" \ </dev/null
echo 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"' >> /home/${username}/.profile
brew install gcc
brew install hidetatz/tap/kubecolor
echo 'function kubecolor() { echo "+ kubectl $@">&2; command kubecolor $@; }' >> /home/${username}/.bashrc
runuser -l ${username} -c  'complete -o default -F __start_kubectl kubecolor'
runuser -l ${username} -c  'complete -o default -F __start_kubectl k'
