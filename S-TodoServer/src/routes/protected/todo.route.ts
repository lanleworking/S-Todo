import jwt from '@elysiajs/jwt';
import Elysia from 'elysia';
import { createTodoController, getAllTodoController, updateTodoController } from '../../controllers';
import { catchResponse } from '../../utils/response';
import { ICommonResponse } from '../../types/http';
import { IUserJwt } from '../../types/app';

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
            const res = await getAllTodoController(user.userId);
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
    });

export default todoRoute;
