# College ERP System

A comprehensive Enterprise Resource Planning system for college management built with React, TypeScript, and Supabase.

## Features


- 📚 **Student Management** - Complete student records and profiles
- 🎓 **Admissions** - Application tracking and approval workflow
- 💰 **Fee Management** - Payment tracking and receipt generation
- 🏠 **Hostel Management** - Room allocation and occupancy tracking
- 📝 **Exam Management** - Results and performance analytics
- 👥 **Multi-Role Support** - Admin, Clerk, Faculty, Student, Hostel Manager
- 🔐 **Secure Authentication** - Role-based access control

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI**: Tailwind CSS, Lucide Icons
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Charts**: Recharts
- **PDF**: jsPDF
- **Routing**: React Router v6

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

Follow the detailed setup guide in [SUPABASE_SETUP.md](SUPABASE_SETUP.md)

Quick steps:
1. Create a Supabase project at https://supabase.com
2. Run the SQL schema from `supabase-schema.sql`
3. Update `.env.local` with your credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Run Development Server

```bash
npm run dev
```

## Deployment

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

### Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts
4. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Deploy to Netlify

1. Build: `npm run build`
2. Deploy `dist/` folder to Netlify
3. Add environment variables in Netlify dashboard

The project includes `vercel.json` for automatic Vercel configuration.

Open http://localhost:5174 in your browser.

## Project Structure

```
college_erp_main/
├── src/
│   ├── components/       # Reusable UI components
│   ├── contexts/         # React context providers
│   ├── data/            # Mock data for development
│   ├── lib/             # Supabase client and types
│   ├── pages/           # Page components
│   ├── services/        # API service layers
│   ├── types/           # TypeScript type definitions
│   └── App.tsx          # Main app component
├── supabase-schema.sql  # Database schema
└── .env.local          # Environment variables
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## User Roles

- **Admin** - Full system access
- **Clerk** - Student and admission management
- **Faculty** - Academic and exam management
- **Student** - View own records and results
- **Hostel Manager** - Hostel allocation and management

## Development Mode

The app works in two modes:

1. **With Supabase** - Full backend functionality with real database
2. **Mock Data Mode** - Local storage with mock data (no Supabase needed)

The app automatically detects if Supabase is configured and falls back to mock data if not.

## Support

For issues and questions, check the documentation or create an issue.

## 👨‍💻 Developed By

**Hemant Kumar Dhangar**    
**Mayank Singh**  
**Mrityunjay Singh** 
 
