import { integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { EUserRole } from '../types/app';

export const users = pgTable('users', {
    userId: varchar('user_id', {
        length: 50,
    }).primaryKey(),
    fullName: varchar('full_name', {
        length: 50,
    }),
    email: varchar('email', {
        length: 50,
    }),
    password: varchar('password', {
        length: 100,
    }).notNull(),
    avatarUrl: varchar('avatar_url', { length: 255 }),
    role: integer('role').default(EUserRole.USER),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
