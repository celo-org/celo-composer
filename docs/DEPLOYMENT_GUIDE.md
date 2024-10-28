# Deployment Guide for Celo Composer React/Next App Using Vercel CLI

This document provides step-by-step instructions for deploying your Next.js app to Vercel using the Vercel CLI.

## Prerequisites

1. **Node.js installed**: Ensure Node.js is installed on your system.

## Step 1: Install Vercel CLI

Install Vercel CLI globally using npm or pnpm:

```bash
npm install -g vercel
# OR if using pnpm
pnpm add -g vercel
```

## Step 2: Login to Vercel

Log in to your Vercel account:

```bash
vercel login
```

Follow the on-screen instructions to authenticate your account.

## Step 3: Goto React App

Navigate to the root directory of your Next.js app:

```bash
cd packages/react-app
```

## Step 4: Deploy the App

To deploy your Celo Composer app using Vercel CLI, run:

```bash
vercel
```

> [!NOTE]  
> First-Time Deployment:
>
> - The CLI will ask several questions, including project scope, project name, and framework detection.
>
> Subsequent Deployments:
>
> - Run vercel to deploy the latest changes without additional configuration.

## Step 5: View Deployment Status

After deployment, you’ll receive a preview deployment URL:

```bash
https://<project-name>.vercel.app
```

> [!IMPORTANT]
> Important: This preview deployment is only accessible to the authenticated user (the Vercel account owner). To make your app publicly accessible, you need to deploy to production.

## Step 6: Deploy to Production

To make the app publicly accessible, deploy it to production:

```bash
vercel deploy --prod
```

This command creates a production deployment accessible to everyone.

## Step 8: Configure Environment Variables

If your app uses environment variables, configure them in Vercel:

1. Go to the Vercel Dashboard.
2. Select your project.
3. Go to Settings > Environment Variables.
4. Add variables for Development, Preview, and Production environments.

Alternatively, use Vercel CLI:

```bash
vercel env add <variable-name> <variable-value>
```

## Step 9: Update Deployment

Whenever you make changes to your code, update the deployment:

- Preview deployment: `vercel`
- Production deployment: `vercel --prod`
