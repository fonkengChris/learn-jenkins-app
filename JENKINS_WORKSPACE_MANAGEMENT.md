# Jenkins Workspace Management Guide

## Overview
This guide explains how to access and manage Jenkins workspace files when running Jenkins in Docker containers, particularly when dealing with permission issues.

## Prerequisites
- Jenkins running in Docker container
- Docker installed on host machine
- Access to terminal/command line

## Finding Your Jenkins Container

### List Running Containers
```bash
docker ps
```

Look for your Jenkins container. Common names include:
- `my-jenkins`
- `jenkins`
- `jenkins/jenkins`

Example output:
```
CONTAINER ID   IMAGE         COMMAND                  CREATED        STATUS       PORTS                                                                                          NAMES
4787d16fdca4   my-jenkins    "/usr/bin/tini -- /u…"   18 hours ago   Up 2 hours   0.0.0.0:8080->8080/tcp, [::]:8080->8080/tcp, [::]:50000->50000/tcp   my-jenkins
```

## Accessing Jenkins Workspace as Root

### Method 1: Direct Root Access (Recommended)
```bash
# Access container as root without password
docker exec -it --user root my-jenkins bash
```

### Method 2: Access as Jenkins User First, Then Switch
```bash
# Access as Jenkins user
docker exec -it my-jenkins bash

# Switch to root (may require password)
su - root
```

### Method 3: One-Liner Root Commands
```bash
# Execute single command as root
docker exec -it --user root my-jenkins bash -c "cd /var/jenkins_home/workspace/learn-jenkins-app && ls -la"
```

## Workspace File System Operations

### Navigate to Workspace
```bash
# Once inside container as root
cd /var/jenkins_home/workspace/learn-jenkins-app
```

### List Workspace Contents
```bash
# Basic listing
ls -la

# Detailed listing with file sizes
ls -lah

# Tree view (if tree command available)
tree -L 3
```

### Common Workspace Directories
- `node_modules/` - Node.js dependencies
- `build/` - Build artifacts
- `test-results/` - Test reports
- `playwright-report/` - Playwright test reports
- `src/` - Source code
- `.git/` - Git repository

## Cleaning Workspace Files

### Remove Specific Directories
```bash
# Remove problematic directories
rm -rf node_modules playwright-report build test-results

# Verify cleanup
ls -la
```

### Change File Ownership
```bash
# Change ownership to Jenkins user
chown -R jenkins:jenkins /var/jenkins_home/workspace/learn-jenkins-app

# Change ownership to current user
chown -R $(id -u):$(id -g) /var/jenkins_home/workspace/learn-jenkins-app
```

### Complete Workspace Reset
```bash
# Backup important files
cp package.json package-lock.json Jenkinsfile README.md /tmp/

# Remove entire workspace
rm -rf /var/jenkins_home/workspace/learn-jenkins-app/*

# Restore important files
cp /tmp/* /var/jenkins_home/workspace/learn-jenkins-app/
```

## Permission Issues and Solutions

### Common Permission Errors
- `Permission denied` when deleting files
- `EACCES: permission denied` in npm operations
- Files owned by root instead of Jenkins user

### Fix Permission Issues
```bash
# Method 1: Change ownership
chown -R jenkins:jenkins /var/jenkins_home/workspace/learn-jenkins-app

# Method 2: Change permissions
chmod -R 755 /var/jenkins_home/workspace/learn-jenkins-app

# Method 3: Force cleanup as root
rm -rf node_modules playwright-report build test-results
```

## File System Operations

### Create Files and Directories
```bash
# Create directory
mkdir -p new-directory

# Create file
touch new-file.txt

# Create file with content
echo "Hello World" > hello.txt
```

### Copy and Move Files
```bash
# Copy file
cp source.txt destination.txt

# Move file
mv old-name.txt new-name.txt

# Copy directory
cp -r source-dir destination-dir
```

### Search Files
```bash
# Find files by name
find . -name "*.js"

# Find files by size
find . -size +1M

# Find files by modification time
find . -mtime -1
```

## Monitoring Workspace

### Check Disk Usage
```bash
# Check workspace size
du -sh /var/jenkins_home/workspace/learn-jenkins-app

# Check individual directory sizes
du -sh node_modules build test-results
```

### Monitor File Changes
```bash
# Watch directory for changes
watch -n 1 "ls -la"

# Monitor file modifications
inotifywait -m -r /var/jenkins_home/workspace/learn-jenkins-app
```

## Troubleshooting

### Container Not Running
```bash
# Check container status
docker ps -a

# Start container
docker start my-jenkins

# Check logs
docker logs my-jenkins
```

### Permission Denied Errors
```bash
# Check file ownership
ls -la /var/jenkins_home/workspace/learn-jenkins-app

# Fix ownership
chown -R jenkins:jenkins /var/jenkins_home/workspace/learn-jenkins-app
```

### Workspace Not Found
```bash
# Check if workspace exists
ls -la /var/jenkins_home/workspace/

# Create workspace if missing
mkdir -p /var/jenkins_home/workspace/learn-jenkins-app
```

## Best Practices

### Regular Maintenance
- Clean up `node_modules` after failed builds
- Remove old build artifacts
- Monitor disk usage
- Fix permission issues promptly

### Prevention
- Use proper user permissions in Docker containers
- Implement workspace cleanup in Jenkinsfile
- Monitor build processes for permission issues

### Safety
- Always backup important files before cleanup
- Test changes in non-production environments
- Use version control for important configurations

## Quick Reference Commands

```bash
# Access workspace as root
docker exec -it --user root my-jenkins bash

# Navigate to workspace
cd /var/jenkins_home/workspace/learn-jenkins-app

# Clean workspace
rm -rf node_modules playwright-report build test-results

# Fix permissions
chown -R jenkins:jenkins .

# Check contents
ls -la
```

## Alternative Methods

### Jenkins Script Console
1. Go to **Manage Jenkins** → **Script Console**
2. Run Groovy scripts to manage workspace
3. No direct file system access needed

### Pipeline Scripts
1. Create temporary pipeline for cleanup
2. Use shell commands in pipeline steps
3. Delete pipeline after cleanup

This guide provides comprehensive instructions for managing Jenkins workspace files when running in Docker containers, with a focus on resolving permission issues and maintaining a clean workspace environment.
