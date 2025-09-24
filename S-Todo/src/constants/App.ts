export enum EAppLanguage {
  EN = 'en',
  VI = 'vi',
}

export enum EUserRole {
  USER = 0,
  ADMIN = 1,
}

export enum EResetPasswordMode {
  FORGOT = 'forgot',
  CHANGE = 'change',
}

export const PUBLIC_ROUTES = [
  '/auth/login',
  'auth/register',
  'auth/reset-password',
]

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const NON_WHITESPACE_REGEX = /^\S*$/
