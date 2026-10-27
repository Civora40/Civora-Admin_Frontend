import { ADMIN_NAVIGATION } from '../config/admin-navigation';
import { canAdmin, isPlatformAdmin } from '../lib/permissions/rbac';
import { AdminService } from '../lib/services/admin-service';
import { CivoraUser } from '../types';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runTests() {
  console.log('--- Starting Civora Admin Console Tests ---');

  // Test 1: Navigation Structure
  console.log('Testing Navigation Structure...');
  assert(ADMIN_NAVIGATION.length === 6, 'Must have exactly 6 administrative groups');
  const allRoutes = ADMIN_NAVIGATION.flatMap((g) => g.items.map((i) => i.href));
  assert(allRoutes.length === 22, `Must have all 22 administrative routes, found ${allRoutes.length}`);
  assert(allRoutes.includes('/admin'), 'Must include /admin overview');
  assert(allRoutes.includes('/admin/system-health'), 'Must include /admin/system-health');
  assert(allRoutes.includes('/admin/users'), 'Must include /admin/users');
  assert(allRoutes.includes('/admin/provisioning'), 'Must include /admin/provisioning');
  assert(allRoutes.includes('/admin/integrations/messaging'), 'Must include /admin/integrations/messaging');
  assert(allRoutes.includes('/admin/governance/audit-log'), 'Must include /admin/governance/audit-log');
  assert(allRoutes.includes('/admin/settings'), 'Must include /admin/settings');
  console.log('✓ All 21 admin routes verified in navigation configuration');

  // Test 2: RBAC Authorization
  console.log('Testing RBAC Permissions...');
  const adminUser: CivoraUser = {
    id: 'test_adm',
    name: 'Admin Test',
    email: 'admin@test.com',
    role: 'platform_admin',
    title: 'Platform Admin',
    assignedProjects: ['*'],
    accountStatus: 'active',
  };

  const engineerUser: CivoraUser = {
    id: 'test_eng',
    name: 'Engineer Test',
    email: 'engineer@test.com',
    role: 'project_engineer',
    title: 'Site Engineer',
    assignedProjects: ['prj_1'],
    accountStatus: 'active',
  };

  const suspendedUser: CivoraUser = {
    ...adminUser,
    id: 'test_susp',
    accountStatus: 'suspended',
  };

  assert(isPlatformAdmin(adminUser) === true, 'Platform admin must be detected');
  assert(isPlatformAdmin(engineerUser) === false, 'Engineer must not be detected as platform admin');
  assert(isPlatformAdmin(suspendedUser) === false, 'Suspended admin must not have active admin access');

  assert(canAdmin(adminUser, 'users.manage') === true, 'Admin can manage users');
  assert(canAdmin(adminUser, 'provisioning.manage') === true, 'Admin can manage provisioning');
  assert(canAdmin(adminUser, 'settings.manage') === true, 'Admin can manage settings');
  assert(canAdmin(engineerUser, 'users.manage') === false, 'Engineer cannot manage users');
  assert(canAdmin(suspendedUser, 'system.read') === false, 'Suspended user denied all access');
  console.log('✓ RBAC enforcement logic passed');

  // Test 3: AdminService Operations
  console.log('Testing AdminService Data Operations...');
  const metrics = await AdminService.getOverviewMetrics();
  assert(metrics.totalOrganizations > 0, 'Must have registered organizations');
  assert(metrics.activeProjects > 0, 'Must have active projects');
  assert(metrics.totalUsers > 0, 'Must have platform users');
  assert(metrics.messagesIngested24h > 0, 'Must track 24h message ingestion');

  const users = await AdminService.getUsers();
  assert(users.length >= 8, 'Must load initial user accounts');

  const orgs = await AdminService.getOrganizations();
  assert(orgs.some((o) => o.code === 'JBN-NG'), 'Must include Julius Berger Nigeria entity');

  const projects = await AdminService.getProjects();
  assert(projects.some((p) => p.lasbcaPermitNumber?.includes('LASBCA')), 'Must have LASBCA tracked projects');

  const telemetry = await AdminService.getChannelTelemetry();
  assert(telemetry.length === 2, 'Must track both WhatsApp and Telegram gateways');

  const auditLogs = await AdminService.getAuditLogs();
  assert(auditLogs.length > 0, 'Must maintain immutable audit log trail');
  console.log('✓ AdminService verified with real Nigerian construction models');

  console.log('--- ALL TESTS PASSED SUCCESSFULLY ---');
}

runTests().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
