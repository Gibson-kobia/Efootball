# Quick Start Guide - Run Locally

## Step-by-Step Instructions

### 1. Install Dependencies
Open PowerShell or Command Prompt in the project folder and run:
```bash
npm install
```
**Note:** This may take a few minutes. The warnings are normal and can be ignored.

### 2. Create Environment File
Create a file named `.env.local` in the root folder with this content:
```
JWT_SECRET=your-super-secret-key-change-this-12345
DATABASE_PATH=./database/tournament.db
NODE_ENV=development
```

### 3. Initialize Database
Run:
```bash
npm run db:init
```
This creates the database and default admin account.

### 4. Start the Server
Run:
```bash
npm run dev
```

### 5. Open in Browser
Visit: **http://localhost:3000**

## Default Admin Login
- **Email:** admin@efootballshowdown.com
- **Password:** Admin123!

⚠️ **Change the admin password immediately after first login!**

## Troubleshooting

### If `npm install` fails:
- Make sure you have Node.js installed (v18 or higher)
- Try: `npm cache clean --force` then `npm install` again
- On Windows, you may need to run PowerShell as Administrator

### If database init fails:
- Make sure the `database` folder exists
- Check that you have write permissions

### If server won't start:
- Check if port 3000 is already in use
- Make sure `.env.local` file exists
- Try: `npm run dev -- -p 3001` to use a different port

## All Commands in One Go
```bash
npm install
npm run db:init
npm run dev
```

Then open http://localhost:3000 in your browser!

