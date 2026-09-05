import { pgTable, text, integer, timestamp, pgEnum } from 'drizzle-orm/pg-core'
import { customers } from './customers.ts'

export const orderStatusEnum = pgEnum('order_status', [
  'pending',
  'paid',
  'canceled'
])

export const orders = pgTable('orders', {
  id: text().primaryKey(),
  orderId: text().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
})