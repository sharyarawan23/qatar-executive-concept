# Qatar Executive — Unofficial Redesign Concept

A production-ready Next.js static deployment for the cinematic Qatar Executive concept.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Automatic live deployment

Push this repository to the `main` branch. The included GitHub Actions workflow builds the Next.js app and deploys it to GitHub Pages.

In GitHub, open **Settings → Pages** and set **Source** to **GitHub Actions** if it is not already selected.

## Flight request form

The form submits to the connected Supabase Edge Function, so no GitHub secret or environment variable is needed for this concept build.

## Important

This is an unofficial design concept. Qatar Executive trademarks and brand assets require authorization for commercial use.
