# Cloudflare Worker for DuckDuckGo Reverse Proxy

This Cloudflare Worker script acts as a reverse proxy, forwarding requests from your custom domain to DuckDuckGo's servers. It preserves the integrity of the original request headers and methods.

## Features

- **Request Forwarding**: Automatically forwards requests to `html.duckduckgo.com`.
- **Header Management**: Retains and manages headers to simulate requests coming directly from DuckDuckGo.

## Prerequisites

- A Cloudflare account with access to Workers.

## Setup Instructions

### Step 1: Create the Worker

1. Log in to your Cloudflare dashboard.
2. Navigate to the "Workers" section.
3. Click on "Create a Worker".

### Step 2: Deploy the Script

- Copy and paste the provided JavaScript code into the Worker script editor within the Cloudflare dashboard.
- Save and deploy the Worker.

## Deployment

- After editing and saving your worker script in the Cloudflare dashboard, map the worker to your desired route.
- Ensure that the route is configured to handle requests from your custom domain.
