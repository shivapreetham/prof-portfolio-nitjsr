import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHTML(dirty) {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'target', 'rel']
  });
}

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateURL(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function sanitizeInput(input, maxLength = 1000) {
  if (typeof input !== 'string') return '';

  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, '');
}

export function createRateLimiter(limit = 100, windowMs = 60000) {
  const requests = new Map();

  return (identifier) => {
    const now = Date.now();
    const userRequests = requests.get(identifier) || [];

    const recentRequests = userRequests.filter(time => now - time < windowMs);

    if (recentRequests.length >= limit) {
      return false;
    }

    recentRequests.push(now);
    requests.set(identifier, recentRequests);

    setTimeout(() => {
      const userReqs = requests.get(identifier) || [];
      const filtered = userReqs.filter(time => Date.now() - time < windowMs);
      if (filtered.length === 0) {
        requests.delete(identifier);
      } else {
        requests.set(identifier, filtered);
      }
    }, windowMs);

    return true;
  };
}

export const headers = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
};
