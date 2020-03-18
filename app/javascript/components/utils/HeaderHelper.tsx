export function getHeaders(csrfToken) {
  return {
    "content-type": "application/json",
    accept: "application/json",
    "X-CSRF-Token": csrfToken,
    "X-Frame-Options": "sameorigin",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Content-Security-Policy": "default-src 'self'",
  };
}
