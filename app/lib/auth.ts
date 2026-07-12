import type { UserPublic, JwtPayload, UserRole } from './types';
import { getUserById, getUserByUsername, toUserPublic } from './db';
import type { D1Database } from './types';

// ==================== PASSWORD HASHING ====================

/**
 * Hash a password using PBKDF2 with SHA-256 via Web Crypto API.
 * Compatible with Cloudflare Workers runtime.
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const saltHex = Array.from(salt)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256,
  );

  const hashHex = Array.from(new Uint8Array(derivedBits))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return `${saltHex}:${hashHex}`;
}

/**
 * Verify a password against a stored hash.
 */
export async function verifyPassword(
  password: string,
  storedHash: string,
): Promise<boolean> {
  if (!storedHash || !storedHash.includes(':')) return false;

  const [saltHex, hashHex] = storedHash.split(':');
  const salt = new Uint8Array(
    saltHex.match(/.{1,2}/g)?.map((b) => parseInt(b, 16)) ?? [],
  );

  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256,
  );

  const computedHash = Array.from(new Uint8Array(derivedBits))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return computedHash === hashHex;
}

// ==================== JWT TOKEN ====================

/**
 * Base64 URL-safe encode.
 */
function base64UrlEncode(data: ArrayBuffer): string {
  const bytes = new Uint8Array(data);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Base64 URL-safe decode.
 */
function base64UrlDecode(str: string): Uint8Array {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Generate a JWT secret key from the secret string using HMAC-SHA256.
 */
async function getSigningKey(secret: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

/**
 * Create a JWT token.
 */
export async function createToken(
  payload: JwtPayload,
  secret: string,
  expiresInHours = 24,
): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);

  const fullPayload: JwtPayload = {
    ...payload,
    iat: now,
    exp: now + expiresInHours * 3600,
  };

  const headerEncoded = base64UrlEncode(
    new TextEncoder().encode(JSON.stringify(header)),
  );
  const payloadEncoded = base64UrlEncode(
    new TextEncoder().encode(JSON.stringify(fullPayload)),
  );

  const signingInput = `${headerEncoded}.${payloadEncoded}`;
  const key = await getSigningKey(secret);
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(signingInput),
  );

  const signatureEncoded = base64UrlEncode(signature);
  return `${signingInput}.${signatureEncoded}`;
}

/**
 * Verify and decode a JWT token.
 */
export async function verifyToken(
  token: string,
  secret: string,
): Promise<JwtPayload | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [headerEncoded, payloadEncoded, signatureEncoded] = parts;
    const signingInput = `${headerEncoded}.${payloadEncoded}`;

    const key = await getSigningKey(secret);
    const signature = base64UrlDecode(signatureEncoded);

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signature,
      new TextEncoder().encode(signingInput),
    );

    if (!isValid) return null;

    const payloadStr = new TextDecoder().decode(
      base64UrlDecode(payloadEncoded),
    );
    const payload: JwtPayload = JSON.parse(payloadStr);

    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

// ==================== AUTH MIDDLEWARE HELPERS ====================

/**
 * Extract JWT token from request cookies or Authorization header.
 */
export function extractToken(request: Request): string | null {
  // Try Authorization header first
  const authHeader = request.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }

  // Try cookie
  const cookie = request.headers.get('Cookie');
  if (cookie) {
    const match = cookie.match(/(?:^|;\s*)token=([^;]+)/);
    if (match) return match[1];
  }

  return null;
}

/**
 * Get the authenticated user from the request.
 */
export async function getAuthUser(
  request: Request,
  db: D1Database,
  secret: string,
): Promise<{ user: UserPublic | null; payload: JwtPayload | null }> {
  const token = extractToken(request);
  if (!token) return { user: null, payload: null };

  const payload = await verifyToken(token, secret);
  if (!payload) return { user: null, payload: null };

  const user = await getUserById(db, payload.userId);
  if (!user) return { user: null, payload: null };

  return { user: toUserPublic(user), payload };
}

/**
 * Require a specific role to access a route.
 * Throws a Response with 401/403 if not authorized.
 */
export function requireRole(
  user: UserPublic | null,
  allowedRoles: UserRole[],
): void {
  if (!user) {
    throw new Response(null, {
      status: 401,
      statusText: 'Unauthorized',
      headers: { Location: '/login' },
    });
  }

  if (!allowedRoles.includes(user.role)) {
    throw new Response(null, {
      status: 403,
      statusText: 'Forbidden',
    });
  }
}

/**
 * Create a HTTP-only cookie string for the token.
 */
export function createTokenCookie(token: string): string {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString();
  return `token=${token}; HttpOnly; Path=/; SameSite=Lax; Expires=${expires}`;
}

/**
 * Create a cookie string to clear the token (logout).
 */
export function clearTokenCookie(): string {
  return 'token=; HttpOnly; Path=/; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT';
}

/**
 * Login a user with username and password.
 */
export async function loginUser(
  db: D1Database,
  username: string,
  password: string,
  secret: string,
): Promise<{ token: string; user: UserPublic } | null> {
  const user = await getUserByUsername(db, username);
  if (!user) return null;

  // If password hash is empty (seed user), create the hash
  if (!user.password_hash && user.role === 'admin' && password === 'admin123') {
    const hash = await hashPassword(password);
    const stmt = db.prepare('UPDATE users SET password_hash = ? WHERE id = ?');
    await stmt.bind(hash, user.id).run();
    user.password_hash = hash;
  }

  const isValid = await verifyPassword(password, user.password_hash);
  if (!isValid) return null;

  const userPublic = toUserPublic(user);
  const token = await createToken(
    {
      userId: user.id,
      username: user.username,
      role: user.role,
    },
    secret,
  );

  return { token, user: userPublic };
}
