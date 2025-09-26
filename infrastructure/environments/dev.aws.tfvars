aws_region    = "us-west-2"
instance_type = "t3.micro"
key_pair_name = "devops-assessment-dev-key"
environment   = "dev"
project_name  = "devops-assessment"

allowed_cidr_blocks = ["0.0.0.0/0"]
root_volume_size  = 20
enable_monitoring = true

tags = {
  Environment = "dev"
  Owner       = "DevOps Team"
  Project     = "DevOps Assessment"
  Terraform   = "true"
}