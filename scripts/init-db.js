const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '../database');
if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(dbPath, { recursive: true });
}

const db = new Database(path.join(dbPath, 'tournament.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    efootball_id TEXT NOT NULL,
    platform TEXT NOT NULL,
    role TEXT DEFAULT 'player' CHECK(role IN ('player', 'admin')),
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
    email_verified INTEGER DEFAULT 0,
    phone_verified INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS otp_codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    code TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('email', 'phone', 'password_reset')),
    expires_at DATETIME NOT NULL,
    used INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS tournaments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    registration_deadline DATE NOT NULL,
    max_players INTEGER NOT NULL,
    format TEXT NOT NULL,
    status TEXT DEFAULT 'registration' CHECK(status IN ('registration', 'brackets_generated', 'in_progress', 'completed')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    tournament_id INTEGER NOT NULL,
    payment_status TEXT DEFAULT 'pending' CHECK(payment_status IN ('pending', 'paid', 'refunded')),
    payment_method TEXT,
    payment_reference TEXT,
    registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
    UNIQUE(user_id, tournament_id)
  );

  CREATE TABLE IF NOT EXISTS rounds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tournament_id INTEGER NOT NULL,
    round_number INTEGER NOT NULL,
    round_name TEXT NOT NULL,
    scheduled_date DATE,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'in_progress', 'completed')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
    UNIQUE(tournament_id, round_number)
  );

  CREATE TABLE IF NOT EXISTS matches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tournament_id INTEGER NOT NULL,
    round_id INTEGER NOT NULL,
    player1_id INTEGER,
    player2_id INTEGER,
    match_number INTEGER NOT NULL,
    scheduled_time DATETIME,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'in_progress', 'completed', 'forfeit')),
    winner_id INTEGER,
    player1_score INTEGER,
    player2_score INTEGER,
    result_screenshot TEXT,
    result_uploaded_by INTEGER,
    result_verified_by INTEGER,
    result_verified_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
    FOREIGN KEY (round_id) REFERENCES rounds(id) ON DELETE CASCADE,
    FOREIGN KEY (player1_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (player2_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (winner_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (result_uploaded_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (result_verified_by) REFERENCES users(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('match_assigned', 'match_result', 'tournament_update', 'admin_message', 'system')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read INTEGER DEFAULT 0,
    link TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS admin_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'open' CHECK(status IN ('open', 'in_progress', 'resolved')),
    admin_response TEXT,
    responded_by INTEGER,
    responded_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (responded_by) REFERENCES users(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    registration_id INTEGER,
    amount DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    payment_method TEXT NOT NULL CHECK(payment_method IN ('stripe', 'paypal', 'mpesa', 'manual')),
    payment_reference TEXT,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'completed', 'failed', 'refunded')),
    metadata TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (registration_id) REFERENCES registrations(id) ON DELETE SET NULL
  );

  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
  CREATE INDEX IF NOT EXISTS idx_matches_tournament ON matches(tournament_id);
  CREATE INDEX IF NOT EXISTS idx_matches_round ON matches(round_id);
  CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);
  CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
  CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
`);

// Create default tournament
const tournament = db.prepare(`
  INSERT OR IGNORE INTO tournaments (id, name, start_date, end_date, registration_deadline, max_players, format, status)
  VALUES (1, 'Efootball Showdown 2025', '2025-12-10', '2025-12-13', '2025-12-05', 1000, 'single-elimination', 'registration')
`).run();

// Create default admin user
const adminPassword = bcrypt.hashSync('Admin123!', 10);
const admin = db.prepare(`
  INSERT OR IGNORE INTO users (email, password, full_name, phone, efootball_id, platform, role, status, email_verified, phone_verified)
  VALUES ('admin@efootballshowdown.com', ?, 'Tournament Admin', '+1234567890', 'ADMIN001', 'all', 'admin', 'approved', 1, 1)
`).run(adminPassword);

console.log('✅ Database initialized successfully!');
console.log('📧 Default admin account:');
console.log('   Email: admin@efootballshowdown.com');
console.log('   Password: Admin123!');
console.log('   ⚠️  Please change the password immediately!');

db.close();

