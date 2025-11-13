import { EMAIL_REGEX, NON_WHITESPACE_REGEX } from '@/constants/App'
type ValidateOptionsType = {
  minLength?: number
  maxLength?: number

  /**
   * Required field
   * @default true
   */
  required?: boolean
  pattern?: RegExp
  isEmail?: boolean
  isNonWhitespace?: boolean
  min?: number
  max?: number
}

export const validateForm = (
  value: any,
  t: (key: string, options?: any) => string,
  {
    minLength,
    maxLength,
    required = true,
    pattern,
    isEmail,
    isNonWhitespace,
    min,
    max,
  }: ValidateOptionsType = {},
) => {
  const valueTrim = String(value || '').trim()

  if (required && !valueTrim) {
    return t('error.required') || 'This field is required'
  }
  if (valueTrim && minLength && valueTrim.length < minLength) {
    return (
      t('error.minLength', { min: minLength }) ||
      `Minimum length is ${minLength}`
    )
  }
  if (valueTrim && maxLength && valueTrim.length > maxLength) {
    return (
      t('error.maxLength', { max: maxLength }) ||
      `Maximum length is ${maxLength}`
    )
  }

  if (valueTrim && isEmail && !EMAIL_REGEX.test(valueTrim)) {
    return t('error.invalidEmail') || 'Invalid email address'
  }
  if (valueTrim && isNonWhitespace && !NON_WHITESPACE_REGEX.test(valueTrim)) {
    return t('error.invalidNonWhiteSpace') || 'No whitespace allowed'
  }
  if (valueTrim && pattern && !pattern.test(valueTrim)) {
    return t('error.invalidFormat') || 'Invalid format'
  }
  if (valueTrim && min !== undefined && Number(valueTrim) < min) {
    return t('error.minValue', { min }) || `Minimum value is ${min}`
  }
  if (valueTrim && max !== undefined && Number(valueTrim) > max) {
    return t('error.maxValue', { max }) || `Maximum value is ${max}`
  }
  return null
}
