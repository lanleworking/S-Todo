import jwt from '@elysiajs/jwt';
import Elysia, { t } from 'elysia';
import {
    createTodoController,
    deleteTodoController,
    getAllTodoController,
    updateTodoController,
} from '../../controllers';
import { catchResponse } from '../../utils/response';
import { ICommonResponse } from '../../types/http';
import { IUserJwt } from '../../types/app';
import { getTodoById } from '../../controllers/todo/get.controller';

const todoRoute = new Elysia({
    prefix: '/todo',
})
    .use(
        jwt({
            name: 'jwt',
            secret: process.env.SECRET_KEY!,
        }),
    )
    .derive(async ({ cookie, jwt }) => {
        const user = (await jwt.verify(cookie.token.value)) as unknown as IUserJwt;
        return { user };
    })
    .post('/create', async ({ body, set, user }) => {
        try {
            const res = await createTodoController(body as any, user.userId);
            return res;
        } catch (error) {
            return catchResponse(set, error as ICommonResponse);
        }
    })
    .get('/all', async ({ set, user }) => {
        try {
            const res = await getAllTodoController.getAllOnwer(user.userId);
            return res;
        } catch (error) {
            return catchResponse(set, error as ICommonResponse);
        }
    })
    .put('/update/manage', async ({ body, set, user }) => {
        try {
            const res = await updateTodoController.updateManageTodo(body as any, user.userId);
            return res;
        } catch (error) {
            return catchResponse(set, error as ICommonResponse);
        }
    })
    .get('/list', async ({ set, user }) => {
        try {
            const res = await getAllTodoController.getListTodo(user.userId);
            return res;
        } catch (error) {
            return catchResponse(set, error as ICommonResponse);
        }
    })
    .delete(
        '/delete',
        async ({ body, set, user }) => {
            try {
                const res = await deleteTodoController(body.todoId, user.userId);
                return res;
            } catch (error) {
                return catchResponse(set, error as ICommonResponse);
            }
        },
        {
            body: t.Object({
                todoId: t.Array(t.Number()),
            }),
        },
    )
    .get('/:todoId', async ({ params, set, user }) => {
        const { todoId } = params;
        try {
            const res = await getTodoById(Number(todoId), user.userId);
            return res;
        } catch (error) {
            return catchResponse(set, error as ICommonResponse);
        }
    });

export default todoRoute;
