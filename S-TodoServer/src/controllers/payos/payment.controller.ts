import { CreatePaymentLinkRequest, CreatePaymentLinkResponse, PaymentLink } from '@payos/node';
import { throwResponse } from '../../utils/response';
import { EHttpCode, EStatusCodes, ICommonResponse } from '../../types/http';
import payOS from '../../payos/config';
import { ICreatePaymentLinkPayload } from '../../types/payload';
import { NewLogType, NewPaymentLogType } from '../../drizzle/type';
import { ELogAction } from '../../types/app';
import { db } from '../../drizzle/db';
import { paymentLogs } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

export const createPaymentLink = async (
    payload: ICreatePaymentLinkPayload,
    userId: string,
): Promise<CreatePaymentLinkResponse | undefined> => {
    if (!userId || !payload.todoId || !payload.amount)
        throw throwResponse(EStatusCodes.BAD_REQUEST, EHttpCode.INVALID_PAYLOAD, 'User ID is required');
    const now = Date.now();
    const { todoId, note, ...rest } = payload;
    const modifyPayload: CreatePaymentLinkRequest = {
        ...rest,
        orderCode: now,
        description: `${userId}_${todoId}`,
        cancelUrl: 'https://yourdomain.com/cancel',
        returnUrl: 'https://yourdomain.com/success',
    };

    const paymentLink = await payOS.paymentRequests.create(modifyPayload);
    const paymentLog: NewPaymentLogType = {
        amount: payload.amount,
        createdBy: userId,
        todoId: payload.todoId,
        paymentLinkId: paymentLink.paymentLinkId,
        status: paymentLink.status,
        note: note || '',
        qrCode: paymentLink.qrCode || '',
    };
    await db.insert(paymentLogs).values(paymentLog);

    return paymentLink;
};

export const cancelPaymentLink = async (paymentRequestId: string): Promise<ICommonResponse> => {
    if (!paymentRequestId)
        throw throwResponse(EStatusCodes.BAD_REQUEST, EHttpCode.SERVER_ERROR, 'Payment Request ID is required');
    try {
        await payOS.paymentRequests.cancel(paymentRequestId);
        return {
            message: 'Payment request cancelled successfully',
            code: EHttpCode.DELETED,
            status: EStatusCodes.OK,
        };
    } catch (error) {
        console.log(error);
        throw throwResponse(EStatusCodes.BAD_REQUEST, EHttpCode.SERVER_ERROR, (error as Error).message);
    }
};

export const getPayment = async (paymentId: string): Promise<PaymentLink> => {
    if (!paymentId) throw throwResponse(EStatusCodes.BAD_REQUEST, EHttpCode.INVALID_PAYLOAD, 'Payment ID is required');
    const data = await payOS.paymentRequests.get(paymentId);
    const [paymentLogData] = await db
        .select({
            id: paymentLogs.id,
            status: paymentLogs.status,
        })
        .from(paymentLogs)
        .where(eq(paymentLogs.paymentLinkId, paymentId))
        .limit(1);
    if (paymentLogData && paymentLogData.status !== data.status) {
        await db.update(paymentLogs).set({ status: data.status }).where(eq(paymentLogs.id, paymentLogData.id));
    }
    return data;
};
