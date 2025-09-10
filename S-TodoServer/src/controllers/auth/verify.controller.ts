import { eq } from 'drizzle-orm';
import { db } from '../../drizzle/db';
import { users } from '../../drizzle/schema';
import { IJWTService } from '../../types/app';
import { EHttpCode, EStatusCodes, ICommonResponse } from '../../types/http';
import { throwResponse } from '../../utils/response';
import { isEmpty } from 'lodash';

async function verify(token: string | undefined, jwt: IJWTService) {
    if (!token) throw throwResponse(EStatusCodes.UNAUTHORIZED, EHttpCode.UNAUTHORIZED, 'Invalid Token');
    const decoded = await jwt.verify(token);
    if (!decoded || !decoded.userId)
        throw throwResponse(EStatusCodes.UNAUTHORIZED, EHttpCode.UNAUTHORIZED, 'Invalid Token');

    const user = await db
        .select({
            userId: users.userId,
            avatarUrl: users.avatarUrl,
            email: users.email,
            role: users.role,
            createdAt: users.createdAt,
            updatedAt: users.updatedAt,
            fullName: users.fullName,
        })
        .from(users)
        .where(eq(users.userId, decoded.userId))
        .limit(1);

    if (isEmpty(user?.[0].userId))
        throw throwResponse(EStatusCodes.UNAUTHORIZED, EHttpCode.UNAUTHORIZED, 'Invalid Token');

    return user[0];
}

export default verify;
