import { eq } from 'drizzle-orm';
import { db } from '../../drizzle/db';
import { todoOrders, todos } from '../../drizzle/schema';
import { EHttpCode, EStatusCodes } from '../../types/http';
import { throwResponse } from '../../utils/response';

async function getAll(userId: string) {
    if (!userId) throw throwResponse(EStatusCodes.FORBIDDEN, EHttpCode.INVALID_PAYLOAD, 'Invalid User');
    const allUserTodos = await db
        .select({
            id: todos.id,
            title: todos.title,
            description: todos.description,
            status: todos.status,
            priority: todos.priority,
            endDate: todos.endDate,
            order: todoOrders.order,
            type: todos.type,
        })
        .from(todos)
        .innerJoin(todoOrders, eq(todos.id, todoOrders.todoId))
        .where(eq(todos.createdby, userId));

    const data = allUserTodos.reduce(
        (acc: Record<string, typeof allUserTodos>, todo) => {
            const status = todo.status;
            if (status !== null) {
                if (!acc[status]) acc[status] = [];
                acc[status].push(todo);
            }
            return acc;
        },
        {
            NEW: [],
            DOING: [],
            DONE: [],
        } as Record<string, typeof allUserTodos>,
    );

    return data;
}

export default getAll;
