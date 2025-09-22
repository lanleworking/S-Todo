import { and, desc, eq, or } from 'drizzle-orm';
import { db } from '../../drizzle/db';
import { todoOrders, todos, todoUsers, users } from '../../drizzle/schema';
import { EHttpCode, EStatusCodes } from '../../types/http';
import { throwResponse } from '../../utils/response';
import { TodoType } from '../../drizzle/type';

async function getAllOnwer(userId: string) {
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

const getListTodo = async (userId: string) => {
    if (!userId) throw throwResponse(EStatusCodes.FORBIDDEN, EHttpCode.INVALID_PAYLOAD, 'Invalid User');
    const allUserTodos = await db
        .select({
            id: todos.id,
            title: todos.title,
            description: todos.description,
            status: todos.status,
            priority: todos.priority,
            endDate: todos.endDate,
            createdBy: todos.createdby,
            type: todos.type,
            createdAt: todos.createdAt,
            startDate: todos.startDate,
        })
        .from(todoUsers)
        .innerJoin(todos, and(eq(todoUsers.todoId, todos.id), and(eq(todoUsers.userId, userId))))
        .orderBy(desc(todoUsers.assignedAt), desc(todos.createdAt));

    return allUserTodos;
};

const getTodoById = async (
    todoId: number,
    userId: string,
): Promise<
    TodoType & {
        users: {
            userId: string;
            email: string | null;
            fullName: string | null;
            avatarUrl: string | null;
        }[];
    }
> => {
    if (!userId) throw throwResponse(EStatusCodes.FORBIDDEN, EHttpCode.INVALID_PAYLOAD, 'Invalid User');

    const [todo] = await db.select().from(todos).where(eq(todos.id, todoId)).limit(1);

    if (!todo) throw throwResponse(EStatusCodes.NOT_FOUND, EHttpCode.NOT_FOUND, 'Todo Not Exist');

    const userInTodo = await db
        .select({
            userId: users.userId,
            email: users.email,
            fullName: users.fullName,
            avatarUrl: users.avatarUrl,
        })
        .from(users)
        .innerJoin(todoUsers, and(eq(users.userId, todoUsers.userId), and(eq(todoUsers.todoId, todoId))));

    return {
        ...todo,
        users: userInTodo,
    };
};

export { getAllOnwer, getListTodo, getTodoById };
