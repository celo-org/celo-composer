# Farcaster Miniapp Setup Guide

This guide will help you set up your Farcaster Miniapp for proper integration with Farcaster clients.

## Prerequisites

- A Farcaster account
- Your app deployed to a public domain (for production) or ngrok (for development)

## Setting Up Account Association

The Farcaster manifest requires a signed account association to verify domain ownership. Here's how to set it up:

### For Development (using ngrok)

1. **Start your development server:**
   ```bash
   pnpm dev
   ```

2. **Expose your local server with ngrok:**
   ```bash
   ngrok http 3000
   ```
   
   Copy the ngrok URL (e.g., `https://abc123.ngrok-free.app`)

3. **Update your environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and update:
   ```
   NEXT_PUBLIC_URL=https://abc123.ngrok-free.app
   ```

4. **Generate account association:**
   - Go to: https://farcaster.xyz/~/developers/mini-apps/manifest?domain=abc123.ngrok-free.app
   - Sign in with your Farcaster account
   - Sign the manifest
   - Copy the generated `header`, `payload`, and `signature` values

5. **Update your .env.local file:**
   ```
   NEXT_PUBLIC_FARCASTER_HEADER=eyJmaWQiOjM2MjEsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHgyY2Q4NWEwOTMyNjFmNTkyNzA4MDRBNkVBNjk3Q2VBNENlQkVjYWZFIn0
   NEXT_PUBLIC_FARCASTER_PAYLOAD=eyJkb21haW4iOiJhYmMxMjMubmdyb2stZnJlZS5hcHAifQ
   NEXT_PUBLIC_FARCASTER_SIGNATURE=MHgwZmJiYWIwODg3YTU2MDFiNDU3MzVkOTQ5MDRjM2Y1NGUxMzVhZTQxOGEzMWQ5ODNhODAzZmZlYWNlZWMyZDYzNWY4ZTFjYWU4M2NhNTAwOTMzM2FmMTc1NDlmMDY2YTVlOWUwNTljNmZiNDUxMzg0Njk1NzBhODNiNjcyZWJjZTFi
   ```

6. **Restart your development server:**
   ```bash
   pnpm dev
   ```

### For Production

1. **Deploy your app to your production domain**

2. **Generate account association for your production domain:**
   - Go to: https://farcaster.xyz/~/developers/mini-apps/manifest?domain=yourdomain.com
   - Sign the manifest with your Farcaster account
   - Copy the generated values

3. **Set environment variables in your deployment platform:**
   ```
   NEXT_PUBLIC_URL=https://yourdomain.com
   NEXT_PUBLIC_FARCASTER_HEADER=your-header-here
   NEXT_PUBLIC_FARCASTER_PAYLOAD=your-payload-here
   NEXT_PUBLIC_FARCASTER_SIGNATURE=your-signature-here
   JWT_SECRET=your-secure-jwt-secret
   ```

## Verifying Your Setup

1. **Check your manifest endpoint:**
   ```bash
   curl https://yourdomain.com/.well-known/farcaster.json
   ```

2. **Verify in Farcaster:**
   - Open Warpcast
   - Go to the embed tool
   - Enter your domain
   - You should see valid account association

## Troubleshooting

### "Account association not configured" error
- Make sure you've set all three environment variables: `NEXT_PUBLIC_FARCASTER_HEADER`, `NEXT_PUBLIC_FARCASTER_PAYLOAD`, and `NEXT_PUBLIC_FARCASTER_SIGNATURE`
- Verify the values are not placeholder text

### "No valid account association" in Warpcast
- Ensure the domain in your signed payload exactly matches your deployed domain
- Check that your manifest endpoint returns a 200 status code
- Verify the JSON structure matches the Farcaster specification

### Domain mismatch errors
- The signed domain must exactly match where your app is hosted, including subdomains
- If using ngrok, make sure the ngrok URL matches the signed domain

## Additional Resources

- [Farcaster Mini Apps Documentation](https://miniapps.farcaster.xyz/)
- [Manifest Specification](https://miniapps.farcaster.xyz/specification/manifest)
- [Account Association Guide](https://farcaster.xyz/~/developers/mini-apps/manifest)
