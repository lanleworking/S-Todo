import { Elysia } from 'elysia';
import { pool } from './drizzle/db';
import setupRoutes from './routes';
import cors from '@elysiajs/cors';
import staticPlugin from '@elysiajs/static';
import './firebase/config';
import cron from 'node-cron';
import { dailyNotiChecker } from './utils/dailyNotiChecker';
// init app
const app = new Elysia();
app.use(staticPlugin()).use(
    cors({
        origin: ['http://localhost:3000', 'http://10.0.33.152:3000', 'https://10.0.33.152:3000'],
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

cron.schedule('*/1 * * * *', async () => {
    await dailyNotiChecker();
});

app.listen({
    port: process.env.PORT!,
});
console.log(`🦊 Elysia is running at ${process.env.CODE_ENV}`);
console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
