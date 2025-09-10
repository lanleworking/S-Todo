import { EHttpCode, EStatusCodes, ICommonResponse } from '../types/http';

export const throwResponse = (status: EStatusCodes, code: EHttpCode, message?: any): ICommonResponse => {
    return {
        status,
        code,
        message: message || 'Server Error',
    };
};

export const catchResponse = (set: any, error: ICommonResponse) => {
    console.error(error);
    set.status = error.status;
    return error;
};
