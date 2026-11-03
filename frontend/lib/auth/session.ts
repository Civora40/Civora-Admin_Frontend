import { cookies } from 'next/headers';
import { CivoraUser, SessionData } from '@/types';
import { INITIAL_ADMIN_USERS } from '@/lib/mock-data/admin-data';

const SESSION_COOKIE_NAME = 'civora_session';
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

/**
 * Encode session data into cookie-safe base64 string
 */
export function serializeSession(session: SessionData): string {
  return Buffer.from(JSON.stringify(session)).toString('base64');
}

/**
 * Decode session data from base64 string with expiration check
 */
export function deserializeSession(raw: string): SessionData | null {
  try {
    const json = Buffer.from(raw, 'base64').toString('utf-8');
    const data = JSON.parse(json) as SessionData;

    if (!data.user || !data.expiresAt) {
      return null;
    }

    if (Date.now() > data.expiresAt) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

export interface SessionTokens {
  accessToken?: string;
  refreshToken?: string;
}

/**
 * Server-side helper to create and store session cookie
 */
export async function createSession(user: CivoraUser, tokens?: SessionTokens): Promise<void> {
  const cookieStore = await cookies();
  const expiresAt = Date.now() + SESSION_DURATION_MS;

  const sessionData: SessionData = {
    user,
    accessToken: tokens?.accessToken,
    refreshToken: tokens?.refreshToken,
    createdAt: Date.now(),
    expiresAt,
  };

  (globalThis as Record<string, unknown>).__civoraAdminAccessToken = tokens?.accessToken;

  cookieStore.set(SESSION_COOKIE_NAME, serializeSession(sessionData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

/**
 * Retrieve raw session including JWT tokens
 */
export async function getSessionData(): Promise<SessionData | null> {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(SESSION_COOKIE_NAME);
    if (!cookie?.value) {
      return null;
    }
    return deserializeSession(cookie.value);
  } catch {
    return null;
  }
}

/**
 * Server-side helper to retrieve current authenticated user
 */
export async function getCurrentUser(): Promise<CivoraUser | null> {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(SESSION_COOKIE_NAME);

    if (!cookie?.value) {
      // In development mode, return default primary platform admin if enabled
      if (process.env.NEXT_PUBLIC_ENABLE_DEV_AUTH !== 'false') {
        return INITIAL_ADMIN_USERS[0];
      }
      return null;
    }

    const session = deserializeSession(cookie.value);
    (globalThis as Record<string, unknown>).__civoraAdminAccessToken = session?.accessToken;
    return session ? session.user : null;
  } catch {
    // In dev mode fallback
    return INITIAL_ADMIN_USERS[0];
  }
}

/**
 * Clear session cookie (sign-out)
 */
export async function destroySession(): Promise<void> {
  (globalThis as Record<string, unknown>).__civoraAdminAccessToken = undefined;
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Switch active role in development/testing mode
 */
export async function switchDemoUser(userId: string): Promise<CivoraUser> {
  const found = INITIAL_ADMIN_USERS.find((u) => u.id === userId) || INITIAL_ADMIN_USERS[0];
  await createSession(found);
  return found;
}
