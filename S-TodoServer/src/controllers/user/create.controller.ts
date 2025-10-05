import { isEmpty } from 'lodash';
import { db } from '../../drizzle/db';
import { users, userTokens } from '../../drizzle/schema';
import { EHttpCode, EStatusCodes, ICommonResponse } from '../../types/http';
import { throwResponse } from '../../utils/response';
import { eq } from 'drizzle-orm';

export const storeFirebaseToken = async (userId: string, payload: { token: string }): Promise<ICommonResponse> => {
    if (!userId || !payload.token)
        throw throwResponse(EStatusCodes.BAD_REQUEST, EHttpCode.INVALID_PAYLOAD, 'User ID and token are required');
    const user = await db.select().from(users).where(eq(users.userId, userId)).limit(1);
    if (isEmpty(user)) throw throwResponse(EStatusCodes.NOT_FOUND, EHttpCode.NOT_FOUND, 'User not found');

    const tokenExist = await db.select().from(userTokens).where(eq(userTokens.userId, userId)).limit(1);
    if (!isEmpty(tokenExist)) {
        await db
            .update(userTokens)
            .set({
                token: payload.token,
                updatedAt: new Date().toISOString(),
            })
            .where(eq(userTokens.userId, userId));
        return {
            status: EStatusCodes.OK,
            code: EHttpCode.CREATE,
            message: 'Token updated successfully',
        };
    } else {
        await db.insert(userTokens).values({
            userId,
            token: payload.token,
        });

        return {
            status: EStatusCodes.OK,
            code: EHttpCode.CREATE,
            message: 'Token stored successfully',
        };
    }
};
