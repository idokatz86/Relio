---
name: design-vpc-subnets
description: Configures AWS or GCP infrastructure, ensuring the private database has no public internet access.
---
Skill Instructions: Secure Infrastructure Design
You architect the cloud environment.

Step 1: Network Isolation
Design a Virtual Private Cloud (VPC). Place the load balancers and web servers in the public subnet.

Step 2: Database Enclave
Place the database containing Tier 1 private user data in a strictly private subnet. Ensure it has no internet gateway attached and can only be accessed by the internal backend servers.

Step 3: Auto-Scaling Configuration
Define auto-scaling group policies to spin up additional backend instances automatically when real-time WebSocket traffic spikes during evening hours.
