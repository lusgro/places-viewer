# Places Viewer

A modern web interface for displaying Google Places data with multiple view modes.

## Features

- **Cards View**: Visual grid of business cards with ratings, opening hours, and contact info
- **Table View**: Sortable, filterable data table with pagination
- **Map View**: Interactive map with markers for all locations
- **Search & Filter**: Search by name/address, filter by category and neighborhood

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Build for Production

```bash
# Build static export
npm run build

# The output will be in the `out` directory
```

## Deploy

The `out` directory contains static HTML/CSS/JS files that can be deployed anywhere:

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify
1. Drag and drop the `out` folder to [netlify.com/drop](https://app.netlify.com/drop)

### GitHub Pages
1. Push the `out` folder contents to a `gh-pages` branch
2. Enable GitHub Pages in repository settings

### Any Static Host
Upload the contents of the `out` directory to:
- Amazon S3
- Cloudflare Pages
- Firebase Hosting
- Any web server (Apache, Nginx, etc.)

## Updating Data

Replace `src/data/places.json` with your new Google Places data and rebuild:

```bash
cp your-new-data.json src/data/places.json
npm run build
```

## Tech Stack

- **Next.js 16** - React framework with static export
- **shadcn/ui** - UI components
- **TanStack Table** - Data table with sorting/filtering
- **React Leaflet** - Interactive maps
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety
