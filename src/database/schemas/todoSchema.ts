import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core"

export const todo = sqliteTable("todos", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  isCompleted: integer("isCompleted").default(0)
})
