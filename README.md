# Portfolio New

Modern portfolio website built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- ✨ Modern, responsive design with dark mode support
- 📱 Mobile and website project showcase
- 🎯 Filterable project grid (All / Mobile / Website)
- 🚀 Fast performance with Next.js App Router
- 🎨 Beautiful UI with Tailwind CSS
- 📦 Type-safe with TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ or npm/pnpm/yarn

### Installation

```bash
npm install
# or
pnpm install
# or
yarn install
```

### Development

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Vercel will auto-detect Next.js and deploy

Or use Vercel CLI:

```bash
npm i -g vercel
vercel
```

## Project Structure

```
portfolio-new/
├── app/
│   ├── layout.tsx       # Root layout with metadata
│   ├── page.tsx         # Home page
│   └── globals.css      # Global styles
├── components/
│   ├── Hero.tsx         # Hero section with contact links
│   ├── ProjectCard.tsx  # Individual project card
│   └── ProjectGrid.tsx  # Grid with filtering tabs
├── data/
│   └── projects.ts      # Project data source
└── public/              # Static assets
```

## Tech Stack

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** React Icons
- **Deployment:** Vercel

## License

MIT

---

Built by Muchamad Ahfas Fazria
