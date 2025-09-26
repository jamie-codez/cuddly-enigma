project_id   = "jamie-playground"
region       = "us-central1"
zone         = "us-central1-a"
machine_type = "e2-micro"
environment  = "dev"

boot_disk_size = 20
ssh_user       = "devops"

allowed_source_ranges = ["0.0.0.0/0"]

labels = {
  environment = "dev"
  owner       = "devops-team"
  project     = "devops-assessment"
  terraform   = "true"
}