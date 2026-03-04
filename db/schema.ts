import {
  pgTable,
  serial,
  varchar,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const preLaunchSignups = pgTable("pre_launch_signups", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  segment: varchar("segment", { length: 20 }).notNull(), // 'customer' | 'welper' | 'both'
  locale: varchar("locale", { length: 10 }).notNull().default("fr"),
  interestedCustomer: boolean("interested_customer").notNull().default(false),
  interestedWelper: boolean("interested_welper").notNull().default(false),
  comment: text("comment"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type PreLaunchSignup = typeof preLaunchSignups.$inferSelect;
export type NewPreLaunchSignup = typeof preLaunchSignups.$inferInsert;
