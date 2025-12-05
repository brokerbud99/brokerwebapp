# BrokerBud Web Application

A modern Next.js web application for mortgage brokerage management, featuring AI-powered tools for lead management, loan applications, document processing, and voice analysis.

## Quick Start

1. **Install dependencies**:
```bash
npm install
```

2. **Set up Supabase** (see [SUPABASE_SETUP.md](SUPABASE_SETUP.md)):
```bash
cp .env.local.example .env.local
# Add your Supabase credentials to .env.local
```

3. **Run the development server**:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Features

- **Landing Page**: Professional marketing site with features, benefits, and testimonials
- **Dashboard**: Complete broker management system with:
  - Lead Management
  - Task/Todo Management
  - Loan Application Tracking
  - Voice AI (Call Recording & Analysis)
  - Documents AI (Intelligent Document Processing)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React

## Project Structure

```
src/
├── app/
│   ├── page.tsx         # Landing page
│   ├── dashboard/       # Dashboard routes
│   └── api/             # API routes (Supabase integration)
│       ├── auth/        # Authentication endpoints
│       └── leads/       # Leads CRUD endpoints
├── components/ui/       # shadcn/ui components
└── lib/
    ├── supabase/        # Supabase clients (client & server)
    └── api/             # API helper functions
```

## Adding UI Components

This project uses shadcn/ui. Add components as needed:

```bash
npx shadcn@latest add [component-name]
```

Examples:
```bash
npx shadcn@latest add dialog
npx shadcn@latest add input
npx shadcn@latest add table
```

## Documentation

- **[SETUP.md](SETUP.md)** - Detailed setup and customization guide
- **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)** - Supabase backend setup & database schema
- **[API_REFERENCE.md](API_REFERENCE.md)** - API usage and examples

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Run production server
- `npm run lint` - Run ESLint

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
