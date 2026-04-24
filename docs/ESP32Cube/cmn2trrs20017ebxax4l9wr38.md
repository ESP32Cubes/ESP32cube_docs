---
title: Deploy to Server with GitHub Actions
slug: deploy-to-server-with-github-actions
id: cmn2trrs20017ebxax4l9wr38
category: tutorial
categorySlug: tutorial
tags:
  - LED
  - AI
  - Web
status: published
excerpt: >-
  This blog shows you how to use GitHub Actions to automatically update your
  server when pushing code. It covers generating SSH keys, configuring the
  server, adding keys to GitHub, creating the workflow, and the final result.
updatedAt: '2026-04-23T18:14:01.640Z'
---

This guide will show you how to set up a GitHub Actions workflow to automatically update your server content whenever you push your code to GitHub.

## Step-by-Step Guide:

1. **Generate SSH Keys**:
   - On your local machine, generate an SSH key pair (if you don't have one) using the command:
     ```bash
     ssh-keygen -t ed25519 -C "your_email@example.com"
     ```
   - This will create a private key (`id_ed25519`) and a public key (`id_ed25519.pub`).

2. **Configure the Server**:
   - Copy the contents of the public key (`id_ed25519.pub`) to the server's `~/.ssh/authorized_keys` file:
     ```bash
     cat id_ed25519.pub >> ~/.ssh/authorized_keys
     ```
   - Ensure the permissions are set correctly:
     ```bash
     chmod 700 ~/.ssh
     chmod 600 ~/.ssh/authorized_keys
     ```

3. **Add Private Key to GitHub**:
   - In your GitHub repository, go to `Settings` → `Secrets and variables` → `Actions`.
   - Click on `New repository secret` to add the SSH private key:
     - **Name**: `SSH_PRIVATE_KEY`
     - **Value**: Paste the contents of your private key (`id_ed25519`).
   - Also, add the following secrets:
     - **Name**: `HOST`, **Value**: Your server's IP address or domain.
     - **Name**: `USERNAME`, **Value**: Your server’s username.

4. **Create GitHub Actions Workflow**:
   - In your GitHub repository, create a directory `.github/workflows` if it doesn't exist.
   - Create a file named `deploy.yml` inside the `.github/workflows` directory with the following content:

```yaml
name: Deploy to Server

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up SSH
        uses: webfactory/ssh-agent@v0.9.0
        with:
          ssh-private-key: ${{ secrets.SSH_PRIVATE_KEY }}

      - name: Copy files to server
        run: |
          ssh -o StrictHostKeyChecking=no ${{ secrets.USERNAME }}@${{ secrets.HOST }} "cd /www/wwwroot/Django_ESP32 && git pull"
```

5. **Push to GitHub**:
   - Whenever you push changes to the `main` branch of your GitHub repository, the GitHub Actions pipeline will trigger.
   - It will check out your code, set up the SSH connection, and execute the command to pull the latest code on your server.

## Result:
Upon each push to the main branch of your repository, the latest code will automatically be pulled onto your specified server directory, keeping your server's content updated with your GitHub repository.

This setup allows for a streamlined deployment process, making it easier to manage code updates without manual intervention.
