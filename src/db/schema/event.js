import { integer, pgTable, varchar, timestamp } from "drizzle-orm/pg-core";

export const eventsTable = pgTable("events", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  datetime: timestamp("datetime", { mode: "string" }).notNull(),
  location: varchar({ length: 255 }).notNull(),
  capacity: integer().notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
});
