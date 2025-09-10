export interface IJWTService {
    sign(payload: any): Promise<string>;
    verify(token: string): Promise<any>;
}

export enum EUserRole {
    USER = 0,
    ADMIN = 1,
}

export interface IUserJwt {
    userId: string;
    role: number;
    expiredTime: number;
}
