import { NextRequest, NextResponse } from 'next/server';
import { fetchBackend } from '@/lib/api/backend-client';
import { getSessionData } from '@/lib/auth/session';
import { normalizeAdminProject } from '@/lib/services/project-normalizer';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const session = await getSessionData();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.user.role !== 'platform_admin') {
    return NextResponse.json(
      { error: 'Forbidden: Only Platform Administrators can review and approve projects.' },
      { status: 403 }
    );
  }

  const { projectId } = await params;
  const body = await request.json().catch(() => ({}));

  if (!body.decision) {
    return NextResponse.json({ error: 'Review decision is required.' }, { status: 400 });
  }

  if (session.accessToken) {
    const backendRes = await fetchBackend<Record<string, unknown>>(
      `/projects/${projectId}/review/`,
      {
        method: 'POST',
        accessToken: session.accessToken,
        body: {
          decision: body.decision,
          notes: body.notes || '',
          targetStatus: body.targetStatus,
        },
      }
    );
    if (backendRes.ok && backendRes.data) {
      return NextResponse.json({
        success: true,
        project: normalizeAdminProject(backendRes.data),
        message: backendRes.message || 'Project review recorded.',
      });
    }
    if (!backendRes.unreachable) {
      return NextResponse.json(
        { error: backendRes.error?.message || backendRes.message || 'Project review failed.' },
        { status: backendRes.status || 400 }
      );
    }
  }

  return NextResponse.json({ error: 'Backend unreachable for project review.' }, { status: 503 });
}

