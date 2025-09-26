output "instance_id" {
  description = "ID of the EC2 instance"
  value       = aws_instance.web.id
}

output "instance_arn" {
  description = "ARN of the EC2 instance"
  value       = aws_instance.web.arn
}

output "instance_public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_eip.web.public_ip
}

output "instance_private_ip" {
  description = "Private IP address of the EC2 instance"
  value       = aws_instance.web.private_ip
}

output "instance_public_dns" {
  description = "Public DNS name of the EC2 instance"
  value       = aws_instance.web.public_dns
}

output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.main.id
}

output "subnet_id" {
  description = "ID of the public subnet"
  value       = aws_subnet.public.id
}

output "security_group_id" {
  description = "ID of the security group"
  value       = aws_security_group.web.id
}

output "ssh_connection" {
  description = "SSH connection command"
  value       = "ssh -i ~/.ssh/${var.key_pair_name}.pem ubuntu@${aws_eip.web.public_ip}"
}

output "web_url" {
  description = "URL to access the web application"
  value       = "http://${aws_eip.web.public_ip}"
}

output "monitoring_urls" {
  description = "Monitoring dashboard URLs"
  value = {
    prometheus = "http://${aws_eip.web.public_ip}:9090"
    grafana    = "http://${aws_eip.web.public_ip}:3001"
  }
}

output "region" {
  description = "AWS region"
  value       = var.aws_region
}

output "availability_zone" {
  description = "Availability zone of the instance"
  value       = aws_instance.web.availability_zone
}