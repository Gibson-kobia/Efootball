# SQLite to Postgres Migration Guide

## Status: Phase 1 Complete

### Phase 1: Completed ✅
- [x] Removed `better-sqlite3` from dependencies
- [x] Installed `pg`, `drizzle-orm`, `@types/pg`
- [x] Created `/lib/db.ts` - serverless-friendly Postgres client with connection pooling
- [x] Created `/lib/schema.ts` - Drizzle ORM schema definitions for all 8 tables
- [x] Converted `/api/auth/register` route to Postgres (proof-of-concept)
- [x] Updated `package.json` - removed init-db.js and postinstall scripts

### Phase 2: Remaining Work

#### Phase 2a: Convert All API Routes & Libraries

The following 17 API routes need conversion from `getDb().prepare().get()/.run()` to `query()` / `get()` / `run()` helpers with Postgres SQL:

**Auth Routes (5 files):**
1. `/app/api/auth/login/route.ts` - Replace `db.prepare()` with `query()`, convert `?` to `$1`, use `RETURNING id`
2. `/app/api/auth/approval-status/route.ts` - Simple SELECT, minimal changes
3. `/app/api/auth/forgot-password/route.ts` - UPDATE query
4. `/app/api/auth/me/route.ts` - SELECT from JWT token
5. `/app/api/auth/logout/route.ts` - Stateless, likely no DB changes needed

**Admin Routes (5 files):**
6. `/app/api/admin/users/route.ts` - SELECT all users
7. `/app/api/admin/users/[id]/approve/route.ts` - UPDATE user status
8. `/app/api/admin/users/[id]/reject/route.ts` - UPDATE user status
9. `/app/api/admin/matches/route.ts` - SELECT matches
10. `/app/api/admin/bracket/generate/route.ts` - Complex: INSERT rounds, matches; GET bracket

**Dashboard Routes (3 files):**
11. `/app/api/dashboard/matches/route.ts` - SELECT matches for user
12. `/app/api/dashboard/notifications/route.ts` - SELECT notifications
13. `/app/api/dashboard/notifications/[id]/read/route.ts` - UPDATE notification

**Matches Routes (2 files):**
14. `/app/api/matches/[id]/route.ts` - SELECT match details
15. `/app/api/matches/[id]/result/route.ts` - UPDATE match result

**Bracket Routes (2 files):**
16. `/app/api/bracket/route.ts` - GET bracket data (complex JOIN)

**Library Files (3 files):**
17. `/lib/auth.ts` - `getCurrentUser()` uses `db.prepare().get()`
18. `/lib/tournament.ts` - Complex tournament logic with many queries
19. `/lib/utils.ts` - Utility functions

#### Phase 2b: Remove SQLite Artifacts

1. Delete `/scripts/init-db.js`
2. Delete `/database/` directory
3. Update `/netlify.toml` - remove `node scripts/init-db.js` from build command
4. Remove `db:init` script from `package.json`

### Phase 3: Documentation & Deployment

#### Phase 3a: Postgres Setup & Seed Script

1. Create `/scripts/seed-postgres.js` - Node.js script using `pg` to:
   - Create all tables with exact schema from `lib/schema.ts`
   - Insert default tournament (ID=1, Efootball Showdown 2025)
   - Insert default admin user (admin@efootballshowdown.com / Admin123!)
   - Example:
   ```sql
   CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     email TEXT UNIQUE NOT NULL,
     password TEXT NOT NULL,
     full_name TEXT NOT NULL,
     phone TEXT NOT NULL,
     efootball_id TEXT NOT NULL,
     platform TEXT NOT NULL,
     role TEXT DEFAULT 'player',
     status TEXT DEFAULT 'pending',
     email_verified INTEGER DEFAULT 0,
     phone_verified INTEGER DEFAULT 0,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );
   -- ... etc for all 8 tables
   ```

2. Update `package.json` scripts:
   ```json
   "db:seed": "node scripts/seed-postgres.js"
   ```

#### Phase 3b: Update Documentation

Update `README.md` with:
- **Why the migration?** - better-sqlite3 requires rebuilding native modules on Netlify; Postgres serverless avoids this
- **Setup for local development:**
  ```bash
  # 1. Set DATABASE_URL in .env.local
  export DATABASE_URL="postgresql://user:password@localhost:5432/efootball"
  
  # 2. Create database & run seed
  npm run db:seed
  
  # 3. Start dev server
  npm run dev
  ```
- **Neon Postgres setup (Netlify production):**
  - Create free account at neon.tech
  - Copy connection string: `postgresql://user:password@host:port/dbname`
  - Set `DATABASE_URL` as Netlify environment variable
  - Run seed script once: `psql $DATABASE_URL < schema.sql`
  - Or use Netlify CLI to trigger it

#### Phase 3c: Final Build & Deployment

1. Run `npm run build` - verify no errors
2. Verify no references to `better-sqlite3` remain
3. Commit all changes
4. Push to git
5. Netlify will auto-deploy with DATABASE_URL env var

---

## Conversion Template: SQLite → Postgres

### Before (SQLite):
```typescript
const db = getDb();
const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
const result = db.prepare(
  'INSERT INTO users (email, password) VALUES (?, ?) RETURNING id'
).run(email, hashedPassword);
const id = result.lastInsertRowid;
```

### After (Postgres):
```typescript
import { query, get } from '@/lib/db';

const user = await get(
  'SELECT * FROM users WHERE id = $1',
  [userId]
);
const result = await query(
  'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id',
  [email, hashedPassword]
);
const id = result.rows[0].id;
```

### Key Changes:
1. `import { getDb }` → `import { query, get, run }`
2. `getDb().prepare(sql).get()` → `await get(sql, params)`
3. `getDb().prepare(sql).run()` → `await query(sql, params)` or `await run(sql, params)`
4. `?` parameter placeholders → `$1, $2, ...` (Postgres style)
5. `result.lastInsertRowid` → `result.rows[0].id` (from RETURNING clause)
6. ALL query calls must be `await` (async)

---

## Migration Order (Recommended)

1. **Auth library first** - `/lib/auth.ts` → used by all auth routes
2. **Auth routes** - `/api/auth/*` → core feature, unblocks login/register
3. **Tournament library** - `/lib/tournament.ts` → used by bracket endpoints
4. **Bracket routes** - `/api/bracket/*` and `/api/admin/bracket/*`
5. **Admin routes** - `/api/admin/*` (except bracket)
6. **Dashboard & Match routes** - `/api/dashboard/*`, `/api/matches/*`

---

## Testing Checklist

After each group of route conversions:
- [ ] Run `npm run build` - verify TypeScript compiles
- [ ] Run `npm run lint` - check ESLint
- [ ] Manually test endpoints in Postman/curl or via UI
- [ ] Check Postgres logs for connection/query errors

---

## Neon Setup (Production)

1. Create account at **neon.tech**
2. Create new project (free tier: 3 projects, 10GB)
3. Copy connection string (with password)
4. In Netlify Site Settings → Environment → add `DATABASE_URL=<connection_string>`
5. Deploy and run seed script once:
   ```bash
   # Via Netlify CLI:
   netlify env:set DATABASE_URL "postgresql://..."
   # Or manually via Neon UI SQL editor - copy schema from seed script
   ```

---

## Remaining Known Issues

- None yet - Phase 1 PoC is type-safe and builds

---

## Questions?

Refer to:
- **lib/db.ts** - see `query()`, `get()`, `run()` signatures
- **lib/schema.ts** - all table definitions
- **app/api/auth/register/route.ts** - full PoC example
- **Drizzle docs** - https://orm.drizzle.team/docs
