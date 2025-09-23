import { integer, pgTable, timestamp, varchar, serial, text, boolean } from 'drizzle-orm/pg-core';
import { ETodoPriority, ETodoStatus, ETodoType, EUserRole } from '../types/app';

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
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull(),
});

export const todos = pgTable('todos', {
    id: serial('id').primaryKey(),
    title: varchar('title', {
        length: 100,
    }).notNull(),
    description: text('description'),
    createdby: varchar('created_by', {
        length: 50,
    }).references(() => users.userId, { onDelete: 'cascade', onUpdate: 'cascade' }),
    status: varchar('status', {
        length: 20,
        enum: [ETodoStatus.NEW, ETodoStatus.DOING, ETodoStatus.DONE],
    }).default(ETodoStatus.NEW),
    priority: varchar('priority', {
        length: 20,
        enum: [ETodoPriority.LOW, ETodoPriority.MEDIUM, ETodoPriority.HIGH],
    }).default(ETodoPriority.LOW),
    type: varchar('type', { length: 50, enum: [ETodoType.PERSONAL, ETodoType.FUND] }).notNull(),
    expectedAmount: integer('expected_amount'),
    shared: boolean('shared').default(false),
    startDate: timestamp('start_date', { mode: 'string' }),
    endDate: timestamp('end_date', { mode: 'string' }),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow(),
});

export const todoUsers = pgTable('todo_users', {
    id: serial('id').primaryKey(),
    todoId: integer('todo_id')
        .notNull()
        .references(() => todos.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    userId: varchar('user_id', { length: 50 })
        .notNull()
        .references(() => users.userId, { onDelete: 'cascade', onUpdate: 'cascade' }),
    assignedAt: timestamp('assigned_at', { mode: 'string' }).defaultNow().notNull(),
});

export const todoLogs = pgTable('todo_logs', {
    id: serial('id').primaryKey(),
    todoId: integer('todo_id')
        .notNull()
        .references(() => todos.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    action: varchar('action', { length: 50 }).notNull(), // "Created", "Updated", "Deleted", etc.
    details: varchar('details', { length: 500 }),
    amount: integer('amount'),
    performedBy: varchar('performed_by', { length: 50 })
        .notNull()
        .references(() => users.userId, { onDelete: 'cascade', onUpdate: 'cascade' }),
    performedAt: timestamp('performed_at', { mode: 'string' }).defaultNow(),
});

export const priorityLevels = pgTable('priority_levels', {
    level: varchar('level', {
        length: 20,
        enum: [ETodoPriority.LOW, ETodoPriority.MEDIUM, ETodoPriority.HIGH],
    }).primaryKey(),
    label: varchar('label', { length: 50 }).notNull(),
});

export const todoOrders = pgTable('todo_orders', {
    id: serial('id').primaryKey(),
    order: integer('order').notNull(),
    todoId: integer('todo_id')
        .notNull()
        .references(() => todos.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
});
