# Efootball Showdown 2025 - Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Initialize Database
```bash
npm run db:init
```

This will:
- Create the database file at `database/tournament.db`
- Set up all required tables
- Create a default admin account

### 3. Configure Environment
Copy `.env.example` to `.env.local` and update the values:

```env
JWT_SECRET=your-super-secret-jwt-key
DATABASE_PATH=./database/tournament.db
NODE_ENV=development

# Email Configuration (for OTP and notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 4. Start Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Default Admin Account

After running `npm run db:init`, you can log in with:
- **Email**: admin@efootballshowdown.com
- **Password**: Admin123!

⚠️ **IMPORTANT**: Change the admin password immediately after first login!

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── admin/         # Admin endpoints
│   │   ├── dashboard/     # Dashboard endpoints
│   │   └── matches/       # Match endpoints
│   ├── admin/             # Admin panel pages
│   ├── dashboard/          # Player dashboard
│   ├── (auth)/            # Authentication pages
│   └── ...                # Other public pages
├── components/            # React components
│   ├── Navbar.tsx
│   └── Footer.tsx
├── lib/                   # Utilities and database
│   ├── auth.ts            # Authentication utilities
│   ├── db.ts              # Database connection
│   ├── tournament.ts      # Tournament logic
│   ├── validations.ts     # Input validation schemas
│   └── utils.ts           # Helper functions
├── scripts/               # Setup scripts
│   ├── init-db.js         # Database initialization
│   ├── setup.sh           # Linux/Mac setup
│   └── setup.bat          # Windows setup
├── database/              # Database files
└── public/                # Static assets
    └── uploads/           # Match result screenshots
```

## Features Implemented

### ✅ Authentication System
- User registration with validation
- Login/Logout with JWT tokens
- Password reset with OTP (email)
- Role-based access control (player/admin)
- Account approval workflow

### ✅ Tournament Management
- Single-elimination bracket generation
- Automatic match pairing
- Round progression (1,000 → 500 → 250 → ... → Champion)
- Match scheduling
- Result submission with screenshot upload
- Admin result verification

### ✅ Player Dashboard
- View assigned matches
- Upload match results
- View tournament bracket position
- Notifications system
- Profile management

### ✅ Admin Panel
- User registration approval/rejection
- Tournament bracket generation
- Match result verification
- User management
- Tournament statistics

### ✅ Frontend Pages
- Homepage with tournament info
- About page
- Rules & Terms page
- Prize breakdown page
- Registration page
- Login page
- Player dashboard
- Tournament bracket view
- Admin panel

### ✅ Security Features
- Input validation with Zod
- Password hashing with bcrypt
- JWT token authentication
- Duplicate account prevention
- Role-based access control
- Secure file uploads

### ✅ UI/UX
- Premium futuristic design
- Dark blue + neon green theme
- Mobile-responsive
- Smooth animations
- Modern esports aesthetic

## Database Schema

### Tables
- `users` - User accounts
- `tournaments` - Tournament information
- `registrations` - Player registrations
- `rounds` - Tournament rounds
- `matches` - Match data
- `notifications` - User notifications
- `otp_codes` - OTP codes for password reset
- `admin_messages` - Support messages
- `payments` - Payment records (for future use)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Request password reset

### Dashboard
- `GET /api/dashboard/matches` - Get player matches
- `GET /api/dashboard/notifications` - Get notifications
- `POST /api/dashboard/notifications/[id]/read` - Mark notification as read

### Matches
- `GET /api/matches/[id]` - Get match details
- `POST /api/matches/[id]/result` - Submit match result

### Admin
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users/[id]/approve` - Approve user
- `POST /api/admin/users/[id]/reject` - Reject user
- `GET /api/admin/matches` - Get all matches
- `POST /api/admin/bracket/generate` - Generate bracket

### Public
- `GET /api/bracket` - Get tournament bracket

## Tournament Flow

1. **Registration Phase** (Now - Nov 23, 2025)
   - Users register and fill tournament details
   - Accounts appear as "Pending"
   - Admin approves/rejects registrations

2. **Pre-Tournament Phase** (Nov 24 - Nov 30)
   - Admin generates tournament bracket
   - Players notified of first match
   - Bracket visible to all

3. **Tournament Days** (Dec 1 - 4)
   - Day 1: Rounds 1-3
   - Day 2: Rounds 4-6
   - Day 3: Rounds 7-8
   - Day 4: Semi-finals + Final
   - Players upload match results
   - Admin verifies results
   - Bracket updates automatically

## Payment Integration (Future)

The database schema includes payment tables. To integrate:
- Stripe: Use `STRIPE_SECRET_KEY` in `.env.local`
- PayPal: Use `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET`
- M-Pesa: Use `MPESA_CONSUMER_KEY` and `MPESA_CONSUMER_SECRET`

## Production Deployment

### Before deploying:
1. Change `JWT_SECRET` to a strong random string
2. Update admin password
3. Configure production database (consider PostgreSQL)
4. Set up email service (SMTP)
5. Configure file storage (consider cloud storage for uploads)
6. Set `NODE_ENV=production`
7. Enable HTTPS
8. Set up proper backup strategy

### Recommended Hosting:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS/Azure/GCP** with Node.js support

## Troubleshooting

### Database errors
- Ensure `database/` directory exists and is writable
- Run `npm run db:init` to recreate database

### Authentication issues
- Check JWT_SECRET is set in `.env.local`
- Clear browser cookies
- Check user status is "approved"

### File upload issues
- Ensure `public/uploads/` directory exists
- Check file permissions
- Verify file size limits

## Support

For issues or questions, contact: support@efootballshowdown.com

---

**Built with ❤️ for Efootball Showdown 2025**

