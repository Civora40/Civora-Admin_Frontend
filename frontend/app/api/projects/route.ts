import { NextResponse } from 'next/server';
import { fetchBackend } from '@/lib/api/backend-client';
import { getSessionData } from '@/lib/auth/session';
import { INITIAL_PROJECTS } from '@/lib/mock-data/admin-data';
import { normalizeAdminProject } from '@/lib/services/project-normalizer';

export async function GET() {
  const session = await getSessionData();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.user.role !== 'platform_admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (session.accessToken) {
    const backendRes = await fetchBackend<Record<string, unknown>[]>('/projects/', {
      method: 'GET',
      accessToken: session.accessToken,
    });
    if (backendRes.ok && Array.isArray(backendRes.data)) {
      return NextResponse.json({
        projects: backendRes.data.map(normalizeAdminProject),
        source: 'civora_backend',
      });
    }
    if (!backendRes.unreachable) {
      return NextResponse.json(
        { error: backendRes.error?.message || backendRes.message || 'Failed to load projects' },
        { status: backendRes.status || 400 }
      );
    }
  }

  return NextResponse.json({
    projects: INITIAL_PROJECTS.map((p) => normalizeAdminProject(p as unknown as Record<string, unknown>)),
    source: 'fallback_store',
  });
}

