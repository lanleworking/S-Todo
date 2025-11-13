export type PlatformType = 'web' | 'ios' | 'android'

/**
 * Detects the current platform based on user agent
 * @returns {PlatformType} The detected platform
 */
export function detectPlatform(): PlatformType {
  if (typeof window === 'undefined') {
    return 'web' // Default for SSR
  }

  const userAgent = navigator?.userAgent?.toLowerCase()

  // Check for iOS devices
  if (/iphone|ipad|ipod/.test(userAgent)) {
    return 'ios'
  }

  // Check for Android devices
  if (/android/.test(userAgent)) {
    return 'android'
  }

  // Default to web for all other cases
  return 'web'
}
