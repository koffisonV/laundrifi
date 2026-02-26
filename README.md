# LaundriFi - Smart Laundry Room Management System

<div align="center">
  <img src="public/images/laundrifiSS.png" alt="LaundriFi Screenshot" width="600"/>
  
  [![Next.js](https://img.shields.io/badge/Next.js-14.0.0-black?logo=next.js)](https://nextjs.org)
  [![Supabase](https://img.shields.io/badge/Supabase-Latest-3ECF8E?logo=supabase)](https://supabase.com)
  [![Docker](https://img.shields.io/badge/Docker-Latest-2496ED?logo=docker)](https://www.docker.com)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-336791?logo=postgresql)](https://www.postgresql.org)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com)
  [![Cron](https://img.shields.io/badge/Cron-Scheduled-FF6B6B?logo=clockify)](https://crontab.guru)

  [Watch Demo](https://youtu.be/1uK_ddNC_T8) | [Live Site](https://laundrifi.vercel.app)
</div>

LaundriFi is a modern web application designed to streamline the management of apartment complex laundry rooms. It provides real-time machine availability tracking, reservation scheduling, and a user-friendly interface for residents to manage their laundry needs efficiently.

## ✨ Features

- **Real-time Machine Availability**: Live updates showing which machines are available, in use, or out of service
- **Smart Scheduling System**: Users can reserve time slots for laundry machines
- **User Authentication**: Secure login system with email verification
- **Anonymous Demo Mode**: One-click demo access without account creation
- **Reservation Management**: Users can view, modify, and cancel their reservations
- **Apartment Integration**: Links reservations to specific apartment numbers
- **Responsive Design**: Works seamlessly on both desktop and mobile devices
- **Dark Mode Support**: Comfortable viewing experience in any lighting condition

## 🚀 Demo Mode

LaundriFi now includes an **Anonymous Demo Mode** that allows users to experience the full system without creating an account:

- **One-Click Access**: Users can start using the system immediately with a "Try Demo" button
- **Full Functionality**: Demo users can book slots, manage reservations, and explore all features
- **Data Persistence**: Demo data is preserved during the session
- **Easy Conversion**: Users can convert their demo account to a real account by adding an email
- **Automatic Cleanup**: Old demo accounts are automatically cleaned up after a period

### How Demo Mode Works

1. **Anonymous Sign-in**: Uses Supabase's `signInAnonymously()` method
2. **Demo Data Seeding**: Automatically creates sample apartment and 1 reservation data
3. **Session Management**: Demo users get a full authenticated experience
4. **Account Conversion**: Users can add an email to preserve their demo data
5. **Cleanup Process**: Automated cleanup of old demo accounts via cron job

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth (including Anonymous Sign-in)
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel with Cron Jobs

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Vercel account (for deployment)

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Supabase Setup

1. **Enable Anonymous Sign-ins**:
   - Go to your Supabase project dashboard
   - Navigate to Authentication > Settings
   - Enable "Enable anonymous sign-ins"

2. **Configure RLS Policies**:
   - Ensure your RLS policies allow anonymous users to create/read their own data
   - Anonymous users use the `authenticated` role but have `is_anonymous: true` in JWT claims

3. **Database Schema**:
   - The existing `apartments` and `reservations` tables work with demo mode

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/laundrifi.git
cd laundrifi
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📊 Database Schema

The application uses the following main tables:

- `reservations`: Stores laundry machine reservations
- `apartments`: Links users to their apartment numbers


## 🙏 Acknowledgments

- Built with Next.js and Supabase
- Icons from React Icons
- Styling with Tailwind CSS

---

<div align="center">
  Made by KV
</div>
