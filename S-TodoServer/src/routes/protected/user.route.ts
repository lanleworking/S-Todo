import jwt from '@elysiajs/jwt';
import Elysia from 'elysia';

import { catchResponse } from '../../utils/response';
import { ICommonResponse } from '../../types/http';
import { getUserController } from '../../controllers';

const userRoute = new Elysia({
    prefix: '/user',
}).get('/options', async ({ set }) => {
    try {
        const res = await getUserController.getAllUserOptions();
        return res;
    } catch (error) {
        return catchResponse(set, error as ICommonResponse);
    }
});

export default userRoute;
