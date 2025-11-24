# How to Run the Web Application Locally

## Option 1: Use the Batch Script (Easiest - Windows)

1. **Double-click** `run-local.bat` in the project folder
2. Wait for it to complete setup
3. The server will start automatically
4. Open **http://localhost:3000** in your browser

## Option 2: Manual Steps

### Step 1: Open PowerShell or Command Prompt
- Navigate to the project folder: `C:\Users\kobia\Downloads\Efootballshowdown`
- Or right-click in the folder and select "Open PowerShell here"

### Step 2: Install Dependencies
```powershell
npm install
```
**Note:** This takes 2-5 minutes. Warnings are normal.

### Step 3: Create Environment File
Create a file named `.env.local` in the project root with:
```
JWT_SECRET=dev-secret-key-change-in-production-12345
DATABASE_PATH=./database/tournament.db
NODE_ENV=development
```

### Step 4: Initialize Database
```powershell
npm run db:init
```

### Step 5: Start the Server
```powershell
npm run dev
```

### Step 6: Open in Browser
Visit: **http://localhost:3000**

## Default Admin Login
- **Email:** admin@efootballshowdown.com
- **Password:** Admin123!

⚠️ **Change the password immediately after first login!**

## Troubleshooting

### "npm is not recognized"
**Solution:** 
1. Restart your PowerShell/Command Prompt
2. Or reinstall Node.js from https://nodejs.org/
3. Make sure to check "Add to PATH" during installation

### Port 3000 already in use
**Solution:**
```powershell
npm run dev -- -p 3001
```
Then visit http://localhost:3001

### Database errors
**Solution:**
```powershell
npm run db:init
```

### Still having issues?
1. Make sure Node.js is installed: `node --version`
2. Make sure npm is installed: `npm --version`
3. Try restarting your terminal
4. Check that you're in the correct folder

## Quick Commands Reference
```powershell
npm install          # Install dependencies
npm run db:init      # Initialize database
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Run production build
```

