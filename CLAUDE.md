# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server at http://localhost:3000
npm run build    # Production build
npm run start    # Run production build
npm run lint     # Run ESLint
```

There is no test runner configured in this project.

## Architecture

This is a **Next.js 16** project using the **App Router** with **React 19**, **TypeScript**, and **Tailwind CSS v4**.

### Key conventions

- **Path alias**: `@/*` resolves to the project root (e.g., `@/app/...`, `@/components/...`)
- **Styling**: Tailwind CSS v4 via `@tailwindcss/postcss`. No `tailwind.config.*` — configuration lives in CSS using `@theme` if needed.
- **Fonts**: Geist Sans and Geist Mono loaded via `next/font/google`, exposed as CSS variables `--font-geist-sans` and `--font-geist-mono`.
- **TypeScript**: Strict mode enabled. Target is ES2017.

### App Router structure

All routes live under `app/`. The root layout (`app/layout.tsx`) wraps all pages with font variables and global styles (`app/globals.css`). Pages are `page.tsx` files within route segments.

### ESLint

Config extends `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript` using the flat config format (`eslint.config.mjs`).
