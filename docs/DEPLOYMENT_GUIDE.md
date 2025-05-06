# **Deployment Guide for Celo Composer React/Next.js App Using Vercel CLI**  

This document provides step-by-step instructions for deploying your Next.js app to Vercel using the Vercel CLI.  

## **Prerequisites**  

1. **Node.js installed**: Ensure that Node.js is installed on your system.  

## **Step 1: Install Vercel CLI**  

Install the Vercel CLI globally using npm or pnpm:  

```bash
npm install -g vercel
# OR if using pnpm
pnpm add -g vercel
```  

## **Step 2: Log in to Vercel**  

Log in to your Vercel account:  

```bash
vercel login
```  

Follow the on-screen instructions to authenticate your account.  

## **Step 3: Navigate to the React App Directory**  

Move to the root directory of your Next.js app:  

```bash
cd packages/react-app
```  

## **Step 4: Deploy the App**  

To deploy your Celo Composer app using the Vercel CLI, run:  

```bash
vercel
```  

> **Note:**  
> **First-Time Deployment:**  
> - The CLI will ask several questions, including project scope, project name, and framework detection.  
>  
> **Subsequent Deployments:**  
> - Run `vercel` to deploy the latest changes without additional configuration.  

## **Step 5: View Deployment Status**  

After deployment, you’ll receive a preview deployment URL:  

```bash
https://<project-name>.vercel.app
```  

> **Important:**  
> This preview deployment is only accessible to the authenticated user (the Vercel account owner). To make your app publicly accessible, you need to deploy it to production.  

## **Step 6: Deploy to Production**  

To make the app publicly accessible, deploy it to production:  

```bash
vercel deploy --prod
```  

This command creates a production deployment that is accessible to everyone.  

## **Step 7: Configure Environment Variables**  

If your app uses environment variables, configure them in Vercel:  

1. Go to the **Vercel Dashboard**.  
2. Select your project.  
3. Navigate to **Settings > Environment Variables**.  
4. Add variables for Development, Preview, and Production environments.  

Alternatively, you can set environment variables using the Vercel CLI:  

```bash
vercel env add <variable-name> <variable-value>
```  

## **Step 8: Update Deployment**  

Whenever you make changes to your code, update the deployment:  

- **For a preview deployment:**  
  ```bash
  vercel
  ```  
- **For a production deployment:**  
  ```bash
  vercel --prod
  ```  