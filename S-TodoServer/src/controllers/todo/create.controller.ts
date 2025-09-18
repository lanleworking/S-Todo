import { desc, eq } from 'drizzle-orm';
import { db } from '../../drizzle/db';
import { todoOrders, todos } from '../../drizzle/schema';
import { NewTodoType, TodoOrderType, TodoType } from '../../drizzle/type';
import { EHttpCode, EStatusCodes, ICommonResponse } from '../../types/http';
import { throwResponse } from '../../utils/response';
import { ETodoStatus } from '../../types/app';

type CreateTodoResponseType = ICommonResponse & {
    data: TodoType & TodoOrderType;
};

async function create(payload: NewTodoType, userId: string): Promise<CreateTodoResponseType> {
    if (!payload.title || !payload.type || !userId)
        throw throwResponse(EStatusCodes.BAD_REQUEST, EHttpCode.INVALID_PAYLOAD, 'Invalid Payload');
    if (payload?.startDate && payload?.endDate && new Date(payload.startDate) > new Date(payload.endDate))
        throw throwResponse(
            EStatusCodes.BAD_REQUEST,
            EHttpCode.INVALID_PAYLOAD,
            'Start date cannot be greater than end date',
        );
    const processedPayload = {
        ...payload,
        startDate: payload.startDate ? new Date(payload.startDate) : null,
        endDate: payload.endDate ? new Date(payload.endDate) : null,
        createdby: userId,
    };

    const [lastestNewTodo] = await db
        .select({
            order: todoOrders.order,
        })
        .from(todos)
        .innerJoin(todoOrders, eq(todos.id, todoOrders.todoId))
        .where(eq(todos.status, ETodoStatus.NEW))
        .orderBy(desc(todoOrders.order))
        .limit(1);

    const [newTodo] = await db.insert(todos).values(processedPayload).returning();
    const [newTodoOrder] = await db
        .insert(todoOrders)
        .values({
            order: lastestNewTodo?.order ? lastestNewTodo.order + 1 : 1,
            todoId: newTodo.id,
        })
        .returning();

    return {
        status: EStatusCodes.CREATED,
        code: EHttpCode.CREATE,
        message: 'Todo created successfully',
        data: {
            ...newTodo,
            ...newTodoOrder,
        },
    };
}

export default create;
