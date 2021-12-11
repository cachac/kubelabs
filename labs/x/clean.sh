#!/bin/bash -x

terraform destroy \
	-target google_compute_instance.kubemaster01 --auto-approve \
	-target google_compute_instance.kubeworker01 --auto-approve \
	-target google_compute_instance.kubeworker02 --auto-approve

terraform apply --auto-approve
