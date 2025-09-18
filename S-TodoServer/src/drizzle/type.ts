import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { todoOrders, todos, users } from './schema';

export type UserType = InferSelectModel<typeof users>;
export type NewUserType = InferInsertModel<typeof users>;
export type NewTodoType = InferInsertModel<typeof todos>;
export type TodoType = InferSelectModel<typeof todos>;
export type TodoOrderType = InferSelectModel<typeof todoOrders>;
