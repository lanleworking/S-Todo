import { Elysia } from 'elysia';
import jwtVerify from '../middlewares/jwtVerify';
import path from 'path';
import jwt from '@elysiajs/jwt';
import { importRoutes } from '../utils/importRoutes';

const routes = new Elysia().get('/', () => 'Hello Elysia');
const setupRoutes = async () => {
    const publicRoutes = await importRoutes(path.join(__dirname, 'public'));
    const protectedRoutes = await importRoutes(path.join(__dirname, 'protected'));

    routes.use(publicRoutes);
    routes
        .use(
            jwt({
                name: 'jwt',
                secret: process.env.SECRET_KEY!,
            }),
        )
        .derive(async ({ cookie: { token }, jwt, set }) => {
            const user = await jwtVerify(token, jwt, set);
            return { user };
        });
    routes.use(protectedRoutes);

    return routes;
};

export default setupRoutes;
