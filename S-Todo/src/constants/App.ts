export enum EAppLanguage {
  EN = 'en',
  VI = 'vi',
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
