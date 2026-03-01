# Airsoft Club Website

A content-heavy website for an airsoft club, built with **Astro** and **Sanity CMS**. Features a tactical/military aesthetic, photo albums, and editable content.

## Features

- **Home** – Hero section, club name, tagline, quick links
- **Info** – Game schedule, rules, club information
- **Photo Album** – Upload and display photos from games/events (full-size display)
- **About Us** – Club history, mission, team info
- **Contact** – Email, phone, address, social links
- **Sanity Studio** – Content management at `/admin`

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Sanity project

1. Go to [sanity.io/manage](https://sanity.io/manage) and create a new project
2. Note your **Project ID** and **Dataset** (usually `production`)

### 3. Configure environment variables

Copy `.env.example` to `.env` and add your Sanity credentials:

```bash
cp .env.example .env
```

Edit `.env` and **replace with your actual values** from [sanity.io/manage](https://sanity.io/manage):

```
PUBLIC_SANITY_PROJECT_ID=abc123xy   # ← Your real project ID, not "your-project-id"
PUBLIC_SANITY_DATASET=production
```

### 4. Sanity Studio at /admin

The CMS is embedded at `/admin`. On first visit, add your dev/production URLs to CORS origins in [Sanity Manage](https://sanity.io/manage) → API → CORS origins.

### 5. Add CORS origins

In [Sanity Manage](https://sanity.io/manage) → your project → API → CORS origins, add:

- `http://localhost:4321` (dev)
- Your production URL (e.g. `https://yoursite.com`)

### 6. Run the dev server

```bash
npm run dev
```

Visit `http://localhost:4321` for the site and `http://localhost:4321/admin` for the CMS.

## Content structure (Sanity)

| Document   | Purpose                                      |
|-----------|-----------------------------------------------|
| Site Info | Club name, tagline, hero image, info content  |
| Photo Album | Albums with title, date, and image uploads  |
| Contact Info | Email, phone, address, social links        |
| About Us  | Page content, mission, founded date           |

## Scripts

- `npm run dev` – Start dev server
- `npm run build` – Build for production
- `npm run preview` – Preview production build

## Tech stack

- **Astro** – Static site generator
- **Sanity** – Headless CMS
- **astro-portabletext** – Rich text rendering
- **@sanity/image-url** – Image URL builder
