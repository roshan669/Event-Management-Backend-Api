import { integer, pgTable, primaryKey, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./users.js";
import { eventsTable } from "./event.js";

export const registrationsTable = pgTable(
  "registrations",
  {
    userId: integer()
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),

    eventId: integer()
      .notNull()
      .references(() => eventsTable.id, { onDelete: "cascade" }),

    registeredAt: timestamp("registered_at").notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.eventId] }),
  })
);
