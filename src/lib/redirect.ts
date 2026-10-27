/** Only allow same-site relative redirects (e.g. "/account"), never external URLs. */
export function safeRedirect(value: string | null, fallback = '/account'): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return fallback
  return value
}
