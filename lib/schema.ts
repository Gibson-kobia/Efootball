import {
  pgTable,
  serial,
  text,
  integer,
  decimal,
  timestamp,
  date,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';

export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    fullName: text('full_name').notNull(),
    phone: text('phone').notNull(),
    efootballId: text('efootball_id').notNull(),
    platform: text('platform').notNull(),
    role: text('role').default('player').notNull(), // 'player' | 'admin'
    status: text('status').default('pending').notNull(), // 'pending' | 'approved' | 'rejected'
    emailVerified: integer('email_verified').default(0).notNull(),
    phoneVerified: integer('phone_verified').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: index('idx_users_email').on(table.email),
    statusIdx: index('idx_users_status').on(table.status),
  })
);

export const otpCodes = pgTable('otp_codes', {
  id: serial('id').primaryKey(),
  userId: integer('user_id'),
  code: text('code').notNull(),
  type: text('type').notNull(), // 'email' | 'phone' | 'password_reset'
  expiresAt: timestamp('expires_at').notNull(),
  used: integer('used').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const tournaments = pgTable('tournaments', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  registrationDeadline: date('registration_deadline').notNull(),
  maxPlayers: integer('max_players').notNull(),
  format: text('format').notNull(),
  status: text('status').default('registration').notNull(), // 'registration' | 'brackets_generated' | 'in_progress' | 'completed'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const registrations = pgTable(
  'registrations',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull(),
    tournamentId: integer('tournament_id').notNull(),
    paymentStatus: text('payment_status').default('pending').notNull(), // 'pending' | 'paid' | 'refunded'
    paymentMethod: text('payment_method'),
    paymentReference: text('payment_reference'),
    registeredAt: timestamp('registered_at').defaultNow().notNull(),
  },
  (table) => ({
    userTournamentUnique: uniqueIndex('idx_registration_user_tournament').on(
      table.userId,
      table.tournamentId
    ),
  })
);

export const rounds = pgTable(
  'rounds',
  {
    id: serial('id').primaryKey(),
    tournamentId: integer('tournament_id').notNull(),
    roundNumber: integer('round_number').notNull(),
    roundName: text('round_name').notNull(),
    scheduledDate: date('scheduled_date'),
    status: text('status').default('pending').notNull(), // 'pending' | 'in_progress' | 'completed'
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    tournamentRoundUnique: uniqueIndex('idx_round_tournament_number').on(
      table.tournamentId,
      table.roundNumber
    ),
  })
);

export const matches = pgTable(
  'matches',
  {
    id: serial('id').primaryKey(),
    tournamentId: integer('tournament_id').notNull(),
    roundId: integer('round_id').notNull(),
    player1Id: integer('player1_id'),
    player2Id: integer('player2_id'),
    matchNumber: integer('match_number').notNull(),
    scheduledTime: timestamp('scheduled_time'),
    status: text('status').default('pending').notNull(), // 'pending' | 'in_progress' | 'completed' | 'forfeit'
    winnerId: integer('winner_id'),
    player1Score: integer('player1_score'),
    player2Score: integer('player2_score'),
    resultScreenshot: text('result_screenshot'),
    resultUploadedBy: integer('result_uploaded_by'),
    resultVerifiedBy: integer('result_verified_by'),
    resultVerifiedAt: timestamp('result_verified_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    tournamentIdx: index('idx_matches_tournament').on(table.tournamentId),
    roundIdx: index('idx_matches_round').on(table.roundId),
    statusIdx: index('idx_matches_status').on(table.status),
  })
);

export const notifications = pgTable(
  'notifications',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull(),
    type: text('type').notNull(), // 'match_assigned' | 'match_result' | 'tournament_update' | 'admin_message' | 'system'
    title: text('title').notNull(),
    message: text('message').notNull(),
    read: integer('read').default(0).notNull(),
    link: text('link'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index('idx_notifications_user').on(table.userId),
    readIdx: index('idx_notifications_read').on(table.read),
  })
);

export const adminMessages = pgTable('admin_messages', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  status: text('status').default('open').notNull(), // 'open' | 'in_progress' | 'resolved'
  adminResponse: text('admin_response'),
  respondedBy: integer('responded_by'),
  respondedAt: timestamp('responded_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  registrationId: integer('registration_id'),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').default('USD').notNull(),
  paymentMethod: text('payment_method').notNull(), // 'stripe' | 'paypal' | 'mpesa' | 'manual'
  paymentReference: text('payment_reference'),
  status: text('status').default('pending').notNull(), // 'pending' | 'completed' | 'failed' | 'refunded'
  metadata: text('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
