/**
 * Drizzle ORM Schema definitions
 * Mirrors the database schema for type-safe queries
 */
import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  jsonb,
  index,
  integer,
  decimal,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users table - synced from Clerk
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clerkId: text("clerk_id").unique().notNull(),
    email: text("email").unique().notNull(),
    firstName: text("first_name"),
    lastName: text("last_name"),
    imageUrl: text("image_url"),
    metadata: jsonb("metadata").default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  }
  // Note: unique constraints on clerk_id and email automatically create indexes
);

// Contact submissions table
export const contactSubmissions = pgTable(
  "contact_submissions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    name: text("name").notNull(),
    email: text("email").notNull(),
    company: text("company"),
    phone: text("phone"),
    serviceType: text("service_type"),
    message: text("message").notNull(),
    status: text("status").default("new"),
    source: text("source").default("website"),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    userIdIdx: index("idx_contact_submissions_user_id").on(table.userId),
    createdAtIdx: index("idx_contact_submissions_created_at").on(table.createdAt),
    statusIdx: index("idx_contact_submissions_status").on(table.status),
    emailIdx: index("idx_contact_submissions_email").on(table.email),
  })
);

// Newsletter subscribers table
export const newsletterSubscribers = pgTable(
  "newsletter_subscribers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").unique().notNull(), // unique constraint creates index
    name: text("name"),
    source: text("source").default("website"),
    metadata: jsonb("metadata"),
    status: text("status").default("active"),
    subscribedAt: timestamp("subscribed_at", { withTimezone: true }).defaultNow(),
    unsubscribedAt: timestamp("unsubscribed_at", { withTimezone: true }),
  },
  (table) => ({
    statusIdx: index("idx_newsletter_subscribers_status").on(table.status),
    subscribedAtIdx: index("idx_newsletter_subscribers_subscribed_at").on(table.subscribedAt),
  })
);

// User preferences table
export const userPreferences = pgTable(
  "user_preferences",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .unique()
      .references(() => users.id, { onDelete: "cascade" }),
    theme: text("theme").default("system"),
    language: text("language").default("en"),
    emailNotifications: boolean("email_notifications").default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    userIdIdx: index("idx_user_preferences_user_id").on(table.userId),
  })
);

// Stripe Customers - maps users to Stripe customer IDs
export const stripeCustomers = pgTable(
  "stripe_customers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .unique()
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    stripeCustomerId: text("stripe_customer_id").unique().notNull(),
    email: text("email").notNull(),
    name: text("name"),
    metadata: jsonb("metadata").default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    stripeCustomerIdIdx: index("idx_stripe_customers_stripe_id").on(table.stripeCustomerId),
  })
);

// Products - synced from Stripe
export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    stripeProductId: text("stripe_product_id").unique().notNull(),
    name: text("name").notNull(),
    description: text("description"),
    active: boolean("active").default(true),
    metadata: jsonb("metadata").default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    stripeProductIdIdx: index("idx_products_stripe_id").on(table.stripeProductId),
    activeIdx: index("idx_products_active").on(table.active),
  })
);

// Prices - synced from Stripe
export const prices = pgTable(
  "prices",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .references(() => products.id, { onDelete: "cascade" })
      .notNull(),
    stripePriceId: text("stripe_price_id").unique().notNull(),
    currency: text("currency").default("usd").notNull(),
    unitAmount: integer("unit_amount").notNull(), // Amount in cents
    interval: text("interval"), // month, year, or null for one-time
    intervalCount: integer("interval_count").default(1),
    active: boolean("active").default(true),
    metadata: jsonb("metadata").default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    stripePriceIdIdx: index("idx_prices_stripe_id").on(table.stripePriceId),
    productIdIdx: index("idx_prices_product_id").on(table.productId),
    activeIdx: index("idx_prices_active").on(table.active),
  })
);

// Subscriptions - tracks active subscriptions
export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    stripeSubscriptionId: text("stripe_subscription_id").unique().notNull(),
    stripeCustomerId: text("stripe_customer_id").notNull(),
    priceId: uuid("price_id").references(() => prices.id),
    status: text("status").notNull(), // active, canceled, past_due, etc.
    currentPeriodStart: timestamp("current_period_start", { withTimezone: true }),
    currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
    cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
    canceledAt: timestamp("canceled_at", { withTimezone: true }),
    metadata: jsonb("metadata").default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    userIdIdx: index("idx_subscriptions_user_id").on(table.userId),
    stripeSubscriptionIdIdx: index("idx_subscriptions_stripe_id").on(table.stripeSubscriptionId),
    statusIdx: index("idx_subscriptions_status").on(table.status),
  })
);

// Payments - tracks all payments (one-time and subscription)
export const payments = pgTable(
  "payments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    stripePaymentIntentId: text("stripe_payment_intent_id").unique(),
    stripeInvoiceId: text("stripe_invoice_id"),
    stripeCustomerId: text("stripe_customer_id"),
    subscriptionId: uuid("subscription_id").references(() => subscriptions.id, { onDelete: "set null" }),
    amount: integer("amount").notNull(), // Amount in cents
    currency: text("currency").default("usd").notNull(),
    status: text("status").notNull(), // succeeded, pending, failed, refunded
    paymentMethod: text("payment_method"), // card, bank_transfer, etc.
    description: text("description"),
    receiptEmail: text("receipt_email"),
    receiptUrl: text("receipt_url"),
    metadata: jsonb("metadata").default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    userIdIdx: index("idx_payments_user_id").on(table.userId),
    stripePaymentIntentIdIdx: index("idx_payments_stripe_pi_id").on(table.stripePaymentIntentId),
    statusIdx: index("idx_payments_status").on(table.status),
    createdAtIdx: index("idx_payments_created_at").on(table.createdAt),
  })
);

// Define relations
export const usersRelations = relations(users, ({ one, many }) => ({
  preferences: one(userPreferences, {
    fields: [users.id],
    references: [userPreferences.userId],
  }),
  contactSubmissions: many(contactSubmissions),
  stripeCustomer: one(stripeCustomers, {
    fields: [users.id],
    references: [stripeCustomers.userId],
  }),
  subscriptions: many(subscriptions),
  payments: many(payments),
}));

export const contactSubmissionsRelations = relations(contactSubmissions, ({ one }) => ({
  user: one(users, {
    fields: [contactSubmissions.userId],
    references: [users.id],
  }),
}));

export const userPreferencesRelations = relations(userPreferences, ({ one }) => ({
  user: one(users, {
    fields: [userPreferences.userId],
    references: [users.id],
  }),
}));

export const stripeCustomersRelations = relations(stripeCustomers, ({ one }) => ({
  user: one(users, {
    fields: [stripeCustomers.userId],
    references: [users.id],
  }),
}));

export const productsRelations = relations(products, ({ many }) => ({
  prices: many(prices),
}));

export const pricesRelations = relations(prices, ({ one }) => ({
  product: one(products, {
    fields: [prices.productId],
    references: [products.id],
  }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
  price: one(prices, {
    fields: [subscriptions.priceId],
    references: [prices.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, {
    fields: [payments.userId],
    references: [users.id],
  }),
  subscription: one(subscriptions, {
    fields: [payments.subscriptionId],
    references: [subscriptions.id],
  }),
}));

// TypeScript types inferred from schema
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type NewContactSubmission = typeof contactSubmissions.$inferInsert;

export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type NewNewsletterSubscriber = typeof newsletterSubscribers.$inferInsert;

export type UserPreference = typeof userPreferences.$inferSelect;
export type NewUserPreference = typeof userPreferences.$inferInsert;

export type StripeCustomer = typeof stripeCustomers.$inferSelect;
export type NewStripeCustomer = typeof stripeCustomers.$inferInsert;

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type Price = typeof prices.$inferSelect;
export type NewPrice = typeof prices.$inferInsert;

export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
