import { Elysia } from 'elysia';
import { pool } from './drizzle/db';
import setupRoutes from './routes';
import cors from '@elysiajs/cors';
import staticPlugin from '@elysiajs/static';

// init app
const app = new Elysia();
app.use(staticPlugin()).use(
    cors({
        credentials: true,
    }),
);
// routes
const routes = await setupRoutes();
app.use(routes);

// db
pool.connect()
    .then(() => {
        console.log('🏓 | Connected to the database');
    })
    .catch((err: any) => {
        console.error('Error connecting to the database:', err);
        process.exit(1);
    });
app.listen(process.env.PORT!);
console.log(`🦊 Elysia is running at ${process.env._ENV}`);
console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
