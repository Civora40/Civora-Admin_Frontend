import { NextResponse } from 'next/server';
import { fetchBackend } from '@/lib/api/backend-client';
import { createSession, destroySession, getSessionData } from '@/lib/auth/session';
import { INITIAL_ADMIN_USERS } from '@/lib/mock-data/admin-data';
import { CivoraUser } from '@/types';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // 1. Authenticate against the live Django Backend dedicated admin endpoint (`/api/v1/auth/admin/login/`)
    const backendRes = await fetchBackend<{
      access: string;
      refresh: string;
      user: CivoraUser;
    }>('/auth/admin/login/', {
      method: 'POST',
      body: {
        email: email || '',
        password: password || '',
      },
    });

    if (backendRes.ok && backendRes.data?.user) {
      await createSession(backendRes.data.user, {
        accessToken: backendRes.data.access,
        refreshToken: backendRes.data.refresh,
      });
      return NextResponse.json({
        success: true,
        user: backendRes.data.user,
        accessToken: backendRes.data.access,
        source: 'civora_backend',
      });
    }

    // If backend was reachable and rejected credentials or non-admin role (401/403), return error immediately
    if (!backendRes.unreachable && (backendRes.status === 401 || backendRes.status === 403)) {
      return NextResponse.json(
        {
          success: false,
          error:
            backendRes.error?.message ||
            'Invalid administrator credentials or insufficient clearance.',
        },
        { status: backendRes.status }
      );
    }

    // 2. Offline fallback if backend is unreachable — enforce verified admin credentials
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const isAuthorizedFallbackAdmin =
      (normalizedEmail === 'civora40@gmail.com' && password === 'Civora@40Admin#2026!') ||
      INITIAL_ADMIN_USERS.some(
        (u) => u.email.toLowerCase() === normalizedEmail && u.role === 'platform_admin' && password === 'Civora@40Admin#2026!'
      );

    if (!isAuthorizedFallbackAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid administrator credentials or insufficient clearance.',
        },
        { status: 401 }
      );
    }

    const targetUser =
      INITIAL_ADMIN_USERS.find((u) => u.email.toLowerCase() === normalizedEmail) ||
      INITIAL_ADMIN_USERS[0];

    await createSession(targetUser);
    return NextResponse.json({
      success: true,
      user: targetUser,
      source: 'mock_fallback',
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await getSessionData();
  return NextResponse.json({
    authenticated: Boolean(session?.user),
    user: session?.user ?? null,
    accessToken: session?.accessToken,
  });
}

export async function DELETE() {
  const session = await getSessionData();
  if (session?.accessToken) {
    await fetchBackend('/auth/logout/', {
      method: 'POST',
      accessToken: session.accessToken,
    });
  }
  await destroySession();
  return NextResponse.json({ success: true });
}
