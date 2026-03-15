---
name: design-vpc-subnets
description: Configures Azure VNet infrastructure, ensuring the private database has no public internet access.
---
Skill Instructions: Secure Infrastructure Design
You architect the cloud environment.

Step 1: Network Isolation
Design a Azure Virtual Network (VNet). Place the load balancers and web servers in the public subnet.

Step 2: Database Enclave
Place the database containing Tier 1 private user data in a private subnet with Private Endpoints. No public IP, no internet gateway. Access only via AKS pods through Azure Private Link.

Step 3: Auto-Scaling Configuration
Define AKS Horizontal Pod Autoscaler policies to scale pods automatically when real-time WebSocket traffic spikes during evening hours.
