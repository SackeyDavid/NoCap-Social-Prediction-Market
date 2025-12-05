import { pgTable, uuid, text, timestamp, integer, decimal, boolean, jsonb, pgEnum } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Enums
export const marketStatusEnum = pgEnum('market_status', ['open', 'closed', 'settled']);
export const betStatusEnum = pgEnum('bet_status', ['pending', 'won', 'lost', 'void']);
export const transactionTypeEnum = pgEnum('transaction_type', ['deposit', 'withdrawal', 'bet_placed', 'bet_won', 'adjustment']);
export const aiTopicStatusEnum = pgEnum('ai_topic_status', ['draft', 'published', 'rejected']);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  email: text('email').unique().notNull(),
  displayName: text('display_name'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const wallets = pgTable('wallets', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid('user_id').references(() => users.id).notNull(),
  balanceCents: integer('balance_cents').default(0).notNull(),
  currency: text('currency').default('GHS').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const markets = pgTable('markets', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  title: text('title').notNull(),
  slug: text('slug').unique().notNull(),
  category: text('category').notNull(),
  sourceType: text('source_type').notNull(), // 'ai_generated' | 'manual'
  status: marketStatusEnum('status').default('open').notNull(),
  closesAt: timestamp('closes_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const marketOptions = pgTable('market_options', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  marketId: uuid('market_id').references(() => markets.id).notNull(),
  label: text('label').notNull(), // Yes/No
  houseLiquidityCents: integer('house_liquidity_cents').default(0), // For pools
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const bets = pgTable('bets', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid('user_id').references(() => users.id).notNull(),
  stakeCents: integer('stake_cents').notNull(),
  potentialPayoutCents: integer('potential_payout_cents').notNull(),
  status: betStatusEnum('status').default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const betItems = pgTable('bet_items', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  betId: uuid('bet_id').references(() => bets.id).notNull(),
  marketId: uuid('market_id').references(() => markets.id).notNull(),
  marketOptionId: uuid('market_option_id').references(() => marketOptions.id).notNull(),
  oddsMultiplier: decimal('odds_multiplier').notNull(), // Store as string/decimal in DB
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid('user_id').references(() => users.id).notNull(),
  type: transactionTypeEnum('type').notNull(),
  amountCents: integer('amount_cents').notNull(),
  balanceAfterCents: integer('balance_after_cents').notNull(),
  meta: jsonb('meta'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const aiGeneratedTopics = pgTable('ai_generated_topics', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  rawSource: jsonb('raw_source'),
  generatedTitle: text('generated_title').notNull(),
  category: text('category'),
  createdMarketId: uuid('created_market_id').references(() => markets.id),
  status: aiTopicStatusEnum('status').default('draft').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

