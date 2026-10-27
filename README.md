# Civora Admin Console — Platform Management & Governance Control Plane

> **Civora — Intelligent Construction. Clearer Control.**

Administrative, identity, and statutory compliance console for the Civora Construction Intelligence Platform. Designed for authorized platform administrators to manage enterprise contractors, project workspaces, LASBCA/COREN statutory compliance, WhatsApp/Telegram ingestion pipelines, and tamper-evident audit logs.

---

## 1. Architecture & Repository Parity

The Civora Admin Console is built as an independent, decoupled application operating on its own domain and deployment pipeline, while maintaining visual, token, and component parity with the main `Civora Frontend`:

- **Framework:** Next.js 16 (App Router with Turbopack)
- **Runtime:** React 19 (`19.3.0`)
- **Styling:** Tailwind CSS v4 (`@tailwindcss/turbopack`)
- **Type Safety:** TypeScript 5 (Strict mode)
- **Icons:** `lucide-react`
- **Validation:** `zod`
- **Zero Cross-Filesystem Coupling:** Does not import from local sibling paths (`../../Civora Frontend/...`). Reuses the design system through synchronized tokens and official brand vector assets.

Detailed parity audit notes are documented in [`REPOSITORY_PARITY.md`](./REPOSITORY_PARITY.md).

---

## 2. Civora Design System & Color Tokens

| Token | Hex | Typical Administrative Surface |
|---|---|---|
| **Midnight Navy** | `#001237` | Persistent admin sidebar, brand header, high-contrast surfaces |
| **Deep Steel Navy** | `#18243D` | Secondary dark surfaces, card borders, modals |
| **Muted Teal** | `#4FAAA7` | Status indicators, active accents, focus rings (`outline: 2px solid #4FAAA7`) |
| **Royal Blue** | `#3B68DE` | Primary actions, navigation highlights, links |
| **Brand Typography** | `Encode Sans Condensed` | Headers, KPIs, and brand wordmark |
| **Body Typography** | `Inter` | Telemetry tables, monospace references, form fields |

Official vector brand assets (facet-cut isometric prism and wordmark) are loaded from `/public/images/`.

---

## 3. Information Architecture (22 Operational Routes)

Every navigation item maps to a real, fully interactive page with real data structures:

### Platform Operations
- [`/admin`](http://localhost:3000/admin) — Platform Overview, KPI metrics, health summary, recent audit activity.
- [`/admin/system-health`](http://localhost:3000/admin/system-health) — Real-time telemetry, database cluster replication lag, queue depth, service probes.
- [`/admin/activity`](http://localhost:3000/admin/activity) — Chronological stream of platform audit events with category filters and IP traces.
- [`/admin/notifications`](http://localhost:3000/admin/notifications) — Security alerts, high-latency ingestion warnings, and actionable review reminders.

### Access & Identity
- [`/admin/users`](http://localhost:3000/admin/users) — Platform account ledger, role assignments, COREN certification badges, account suspension controls.
- [`/admin/access/roles`](http://localhost:3000/admin/access/roles) — Role-based access control (RBAC) capability matrix (`platform_admin`, `project_engineer`, `read_only_stakeholder`).
- [`/admin/access/invitations`](http://localhost:3000/admin/access/invitations) — Cryptographic single-use onboarding invitation dispatch and revocation.
- [`/admin/access/reviews`](http://localhost:3000/admin/access/reviews) — Quarterly privileged access review and dormant account security hygiene.

### Organizations & Projects
- [`/admin/organizations`](http://localhost:3000/admin/organizations) — Corporate entity registry (Julius Berger, Dangote, Craneburg, LASBCA), CAC numbers, enterprise tiers.
- [`/admin/projects`](http://localhost:3000/admin/projects) — Infrastructure sites ledger, statutory LASBCA permit mapping, COREN lead engineers.
- [`/admin/memberships`](http://localhost:3000/admin/memberships) — User-to-organization and site workspace scope assignments with eviction actions.
- [`/admin/provisioning`](http://localhost:3000/admin/provisioning) — Guided multi-step tenant and project provisioning wizard with tamper-evident audit logging.

### Integrations & Data
- [`/admin/integrations/messaging`](http://localhost:3000/admin/integrations/messaging) — WhatsApp Business Cloud API & Telegram Bot telemetry, masked secrets, webhook health.
- [`/admin/integrations/ingestion`](http://localhost:3000/admin/integrations/ingestion) — Inbound message batch tracking, duplicate detection, media download retry workers.
- [`/admin/data-quality`](http://localhost:3000/admin/data-quality) — Unverified phone identities, missing statutory stage tags, duplicate submission traps.

### Governance & Audit
- [`/admin/governance/report-templates`](http://localhost:3000/admin/governance/report-templates) — Statutory reporting frameworks (COREN Form ER-4, LASBCA Stage Certification, FIDIC Red Book).
- [`/admin/governance/audit-log`](http://localhost:3000/admin/governance/audit-log) — Immutable audit trail with actor details, IP addresses, and metadata inspection.
- [`/admin/governance/security-events`](http://localhost:3000/admin/governance/security-events) — Threat anomaly detection, Tor exit node access, brute-force mitigation logs.
- [`/admin/governance/policies`](http://localhost:3000/admin/governance/policies) — Compliance thresholds (75%/80%), statutory 7-year retention, and payroll decoupling notice.

### Settings
- [`/admin/settings`](http://localhost:3000/admin/settings) — Emergency maintenance mode, MFA enforcement, privileged session timeout rules.
- [`/admin/settings/branding`](http://localhost:3000/admin/settings/branding) — Document watermarking, logo previews, statutory regulatory legal disclaimer.
- [`/admin/settings/integrations`](http://localhost:3000/admin/settings/integrations) — Webhook rate caps, exponential retry backoff algorithms.

---

## 4. Security & Authentication Model

1. **Session Handling:**  
   Uses the HTTP-only `civora_session` cookie containing base64 serialized `SessionData` (`CivoraUser`, `createdAt`, `expiresAt`).
2. **Server-Side Enforcement (`middleware.ts`):**  
   - Intercepts all `/admin/*` routes.
   - Redirects unauthenticated visitors to `/login?redirect=...`.
   - Strictly enforces the `platform_admin` role. Authenticated non-admins are routed to `/access-denied`.
3. **Zero Secret Leakage:**  
   Integration credentials, webhook tokens, and database passwords are masked or server-only. No sensitive secrets exist in `NEXT_PUBLIC_*` variables.
4. **Auditability:**  
   Every state mutation emits a tamper-evident audit record capturing timestamp, actor, IP address, action, target resource, and description.

---

## 5. Development & Deployment

### Quick Start

```bash
# Install dependencies
npm install

# Start local development server (runs via root forwarder)
npm run dev

# Run test suite
npm run test

# Run linter
npm run lint

# Compile production bundle
npm run build
```

### Environment Configuration

Copy `.env.example` to `frontend/.env.local`:

```bash
cp .env.example frontend/.env.local
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_APP_URL` | Public base URL of the Admin Console |
| `NEXT_PUBLIC_APP_ENV` | Environment name (`development`, `staging`, `production`) |
| `SESSION_SECRET` | 32+ character high-entropy key for cookie encryption |
| `API_BASE_URL` | Backend Core API base endpoint |
| `NEXT_PUBLIC_ENABLE_DEV_AUTH` | Allows fast 1-click admin authentication in development |
