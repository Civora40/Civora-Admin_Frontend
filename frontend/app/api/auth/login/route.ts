import { NextResponse } from 'next/server';
import { createSession, destroySession } from '@/lib/auth/session';
import { INITIAL_ADMIN_USERS } from '@/lib/mock-data/admin-data';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const targetUser =
      INITIAL_ADMIN_USERS.find((u) => u.email.toLowerCase() === (email || '').toLowerCase()) ||
      INITIAL_ADMIN_USERS[0];

    await createSession(targetUser);
    return NextResponse.json({ success: true, user: targetUser });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  await destroySession();
  return NextResponse.json({ success: true });
}
