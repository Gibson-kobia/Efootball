# Efootball Showdown 2025

Premium, futuristic tournament management platform for eFootball 2025 single-elimination tournament.

## Features

- 🔐 Complete authentication system (registration, login, password reset)
- 🎮 Player dashboard with match tracking and result uploads
- 🏆 Automatic bracket generation and match pairing
- 📊 Real-time tournament bracket visualization
- 💰 Payment integration support (M-Pesa, Stripe, PayPal)
- 🔔 Notification system (email/SMS/dashboard)
- 👨‍💼 Admin panel for tournament management
- 🎨 Premium futuristic UI with esports-inspired design

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite (better-sqlite3)
- **Authentication**: JWT with bcrypt
- **File Upload**: Multer

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Initialize the database:
```bash
npm run db:init
```

3. Set up environment variables:
Create a `.env.local` file:
```
JWT_SECRET=your-secret-key-here
DATABASE_PATH=./database/tournament.db
NODE_ENV=development

# Email configuration (for OTP and notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Payment providers (optional)
STRIPE_SECRET_KEY=
PAYPAL_CLIENT_ID=
MPESA_CONSUMER_KEY=
MPESA_CONSUMER_SECRET=
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Tournament Details

- **Dates**: December 10th – December 13th, 2025
- **Registration Deadline**: December 5th, 2025
- **Max Players**: 1,000
- **Format**: Single-Elimination Bracket
- **Platform**: eFootball 2025 (cross-platform)

## Default Admin Account

After running `npm run db:init`, you can log in with:
- Email: admin@efootballshowdown.com
- Password: Admin123! (change immediately)

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── (auth)/            # Authentication pages
│   ├── dashboard/         # Player dashboard
│   ├── admin/             # Admin panel
│   └── ...                # Other pages
├── components/            # React components
├── lib/                   # Utilities and database
├── database/              # Database files
├── public/                # Static assets
└── scripts/               # Database initialization
```

## License

Private - Efootball Showdown 2025

