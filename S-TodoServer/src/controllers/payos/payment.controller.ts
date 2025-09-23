import { CreatePaymentLinkRequest, CreatePaymentLinkResponse, PaymentLink } from '@payos/node';
import { throwResponse } from '../../utils/response';
import { EHttpCode, EStatusCodes, ICommonResponse } from '../../types/http';
import payOS from '../../payos/config';
import { ICreatePaymentLinkPayload } from '../../types/payload';

export const createPaymentLink = async (
    payload: ICreatePaymentLinkPayload,
    userId: string,
): Promise<CreatePaymentLinkResponse | undefined> => {
    if (!userId || !payload.todoId || !payload.amount)
        throw throwResponse(EStatusCodes.BAD_REQUEST, EHttpCode.INVALID_PAYLOAD, 'User ID is required');
    const now = Date.now();
    const { todoId, ...rest } = payload;
    const modifyPayload: CreatePaymentLinkRequest = {
        ...rest,
        orderCode: now,
        description: `${userId}_${todoId}`,
        cancelUrl: 'https://yourdomain.com/cancel',
        returnUrl: 'https://yourdomain.com/success',
    };

    try {
        const paymentLink = await payOS.paymentRequests.create(modifyPayload);
        return paymentLink;
    } catch (error) {
        console.log(error);
        throw throwResponse(EStatusCodes.BAD_REQUEST, EHttpCode.SERVER_ERROR, (error as Error).message);
    }
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
    try {
        const data = await payOS.paymentRequests.get(paymentId);
        return data;
    } catch (error) {
        console.log(error);
        throw throwResponse(EStatusCodes.BAD_REQUEST, EHttpCode.SERVER_ERROR, (error as Error).message);
    }
};
