# Web Project Setup

This is a standalone Next.js 14 project (not part of a monorepo).

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (automatically managed)
- **Icons**: Lucide React

## Getting Started

1. **Install dependencies**:
```bash
npm install
```

2. **Run the development server**:
```bash
npm run dev
```

3. **Open your browser**:
Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
web/
├── src/
│   ├── app/                      # Next.js app directory
│   │   ├── page.tsx             # Landing page
│   │   ├── layout.tsx           # Root layout
│   │   ├── globals.css          # Global styles with shadcn variables
│   │   └── dashboard/           # Dashboard routes
│   │       ├── layout.tsx       # Dashboard layout with sidebar
│   │       ├── page.tsx         # Dashboard home
│   │       ├── leads/           # Leads management
│   │       ├── todo/            # Task management
│   │       ├── loan-application/ # Loan applications
│   │       ├── voice-ai/        # Voice AI features
│   │       └── documents-ai/    # Document AI features
│   ├── components/
│   │   └── ui/                  # shadcn/ui components (auto-generated)
│   └── lib/
│       └── utils.ts             # Utility functions
├── components.json              # shadcn/ui configuration
├── tailwind.config.ts           # Tailwind configuration
└── package.json
```

## UI Components

This project uses **shadcn/ui** for component management. Components are installed on-demand and can be customized.

### Adding New Components

To add a new shadcn/ui component:

```bash
npx shadcn@latest add [component-name]
```

Example:
```bash
npx shadcn@latest add dialog
npx shadcn@latest add input
npx shadcn@latest add table
```

### Available Components

Currently installed:
- Button
- Card
- Badge

See all available components at: https://ui.shadcn.com/docs/components

## Features

### Landing Page
- Professional landing page for BrokerBud mortgage brokerage
- Responsive design with features, benefits, and testimonials
- Call-to-action sections

### Dashboard
- Sidebar navigation (responsive, mobile-friendly)
- Multiple dashboard pages:
  - **Dashboard Home**: Overview with metrics and quick access
  - **Leads**: Lead management with status tracking
  - **To Do**: Task management system
  - **Loan Applications**: Application tracking with progress bars
  - **Voice AI**: Call recording and sentiment analysis
  - **Documents AI**: Document processing with AI extraction

## Customization

### Colors

The color scheme is defined in [tailwind.config.ts](tailwind.config.ts) and [src/app/globals.css](src/app/globals.css).

Primary colors:
- Primary: Blue (#3b82f6 / hsl(221.2 83.2% 53.3%))
- Secondary: Indigo (#6366f1 / hsl(243.4 75.4% 58.6%))

To customize colors, edit the CSS variables in `src/app/globals.css`:

```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --secondary: 243.4 75.4% 58.6%;
  /* ... other colors */
}
```

### Fonts

Default font is set in `globals.css`. To change:

```css
body {
  font-family: 'Your Font', Arial, Helvetica, sans-serif;
}
```

## Building for Production

```bash
npm run build
npm start
```

## Notes

- This is a **standalone project**, not a monorepo
- UI components are managed by shadcn/ui (not manually created)
- All dashboard pages use dummy data (replace with API calls)
- No authentication is implemented yet (dashboard is publicly accessible)
