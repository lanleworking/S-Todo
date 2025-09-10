import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { users } from './schema';

export type UserType = InferSelectModel<typeof users>;
export type NewUserType = InferInsertModel<typeof users>;
