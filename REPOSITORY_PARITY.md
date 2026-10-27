# Civora Admin Console — Repository Parity & Architectural Audit

**Product:** Civora — Intelligent Construction. Clearer Control.  
**Applications Inspected:**  
- Main Frontend: `/Users/mac/Desktop/Civora Frontend`  
- Admin Console: `/Users/mac/Desktop/Civora_Admin `  
**Audit Date:** October 2026  
**Status:** Completed & Synchronized

---

## 1. Executive Summary & Verification

The initial repository audit was conducted across both local workspaces on the developer workstation. The main application was located at `/Users/mac/Desktop/Civora Frontend` and inspected without modification.

Both repositories utilize identical structural foundations: Next.js App Router (v16.4), React 19, Tailwind CSS v4, TypeScript 5, and a workspace root wrapper delegating dev/build scripts to the `frontend/` directory.

To prevent brittle cross-repository imports (`../../Civora Frontend/...`) that would break in CI/CD and production container deployments, design tokens, UI primitives, and official brand assets have been synchronized locally in `Civora_Admin` with zero external filesystem coupling.

---

## 2. Dependency & Configuration Parity Matrix

| Feature / Tool | Civora Frontend (Main) | Civora Admin Console | Status / Action |
|---|---|---|---|
| **Package Manager** | npm | npm | Identical |
| **Workspace Architecture** | Root `package.json` -> `frontend/` | Root `package.json` -> `frontend/` | Root forwarding scripts synchronized |
| **Next.js Version** | `16.4.2` (App Router) | `16.4.3` (App Router) | Compatible Next.js 16 releases with Turbopack |
| **React / React DOM** | `19.3.0` | `19.3.0` | 100% Identical |
| **Tailwind CSS** | `^4` (`@tailwindcss/turbopack`) | `^4` (`@tailwindcss/turbopack`) | 100% Identical |
| **TypeScript** | `^5` (Strict mode) | `^5` (Strict mode) | 100% Identical |
| **Path Aliases** | `@/*` -> `./*` (relative to `frontend/`) | `@/*` -> `./*` (relative to `frontend/`) | 100% Identical |
| **Folder Architecture** | Flat: `app/`, `components/`, `lib/` (No `src/`) | Flat: `app/`, `components/`, `lib/` (No `src/`) | Preserved to match main frontend |
| **Icon Library** | `lucide-react` (`^1.59.0`) | `lucide-react` (`^1.59.0`) | Installed in Admin Console |
| **Schema Validation** | `zod` (`^4.6.7`) | `zod` (`^3.24.2` / `^4`) | Installed in Admin Console |
| **Node / React Types** | `@types/node: ^20`, `@types/react: ^19` | `@types/node: ^20`, `@types/react: ^19` | 100% Identical |

---

## 3. Civora Design System & Token Synchronization

The official Civora design system tokens established in `Civora Frontend/frontend/app/globals.css` are replicated directly into the Admin Console without deviation:

### Color Tokens
- **Midnight Navy:** `#001237` (`--color-civora-midnight`, `--color-midnight`) — Primary navigation, sidebar background, dark surface hierarchy.
- **Deep Steel Navy:** `#18243D` (`--color-civora-steel`, `--color-steel`) — Secondary dark surfaces, cards, modal backdrops, typography headings.
- **Muted Teal:** `#4FAAA7` (`--color-civora-teal`, `--color-teal-muted`) — Accent, selected status indicators, focus outlines (`outline: 2px solid #4FAAA7`).
- **Royal Blue:** `#3B68DE` (`--color-civora-blue`, `--color-royal-blue`) — Primary action buttons, interactive links, active state indicators.

### Typography
- **Brand / Display:** `Encode Sans Condensed` (loaded via Google Fonts).
- **Interface / Data Body:** `Inter` (loaded via Google Fonts).
- **Tagline:** *"Intelligent Construction. Clearer Control."*

### Brand Assets
The following official image assets have been placed in `/frontend/public/images/`:
- `brand_logo.png` (light background variant, 1449:384 aspect ratio)
- `brand_logo_white.png` (dark navy background variant)
- `brand_mark.png` & `brand_mark_white.png` (faceted isometric prism mark)
- `civora_watermark_icon.png` & `browser_icon.png`
- `favicon.ico`, `icon.png`, `apple-touch-icon.png`

---

## 4. UI Primitives & Component Strategy

### Reused / Synchronized Base UI Primitives
- `CivoraLogo.tsx`: Exact brand component supporting full wordmark and standalone prism mark across light and dark themes.
- `Button.tsx`: Supports variants (`primary`, `teal`, `secondary`, `outline`, `ghost`, `destructive`), loading states with spinner, and polymorphic anchor/button rendering.
- `Badge.tsx`: Supports variants (`default`, `teal`, `blue`, `amber`, `rose`, `emerald`, `slate`) and pulsating status dots.
- `CustomSelect.tsx`: Accessible custom dropdown select with keyboard navigation, search, and dark/light styling.
- `EmptyState.tsx`: Accessible empty state container with icon circle, title, description, and action button.

### Admin-Specific Shell & Governance Components
To fulfill the operational density required by the Admin Console, the following components are implemented in `components/admin/`:
- `AdminShell.tsx`: Responsive shell composing desktop collapsible sidebar, mobile drawer, administrative top header, breadcrumb pathway, and notification trigger.
- `AdminSidebar.tsx`: Grouped navigation matching the 5 operational groups (Platform, Access & Identity, Organizations & Projects, Integrations & Data, Governance, Settings).
- `AdminHeader.tsx`: Contextual search, active environment badge, platform quick-status indicator, administrator identity card, and secure sign-out.
- `AdminPageHeader.tsx`: Title, subtitle, breadcrumb link hierarchy, and primary/secondary page actions.
- `DataTable.tsx`: Server/client paginated data table with sorting, search filtering, empty states, loading skeletons, and row actions.
- `StatusBadge.tsx`: Operational badge formatting (e.g. `HEALTHY`, `DEGRADED`, `CONNECTED`, `INVITED`, `ACTIVE`, `FLAGGED`, `PENDING_REVIEW`).
- `ConfirmationDialog.tsx`: Modal for high-impact mutations (revoking roles, suspending users, retrying ingestion, clearing audit caches) with honest feedback states.
- `FilterBar.tsx`: Administrative search and multi-facet filtering bar.
- `AdminLoadingSkeleton.tsx` & `AdminErrorState.tsx`: Standardized system states.

---

## 5. Information Architecture & Route Manifest

Every visible navigation item maps to a real, implemented route:

1. **Platform Operations**
   - `/admin` — System Overview, operational summary, critical health alerts, quick actions.
   - `/admin/system-health` — Real-time telemetry, job queues, worker status, memory/CPU indicators.
   - `/admin/activity` — Platform-wide auditable activity stream with scope filters.
   - `/admin/notifications` — Administrative announcements, security warnings, actionable system alerts.

2. **Access & Identity**
   - `/admin/users` — User account registry, search, status toggles, user creation modal.
   - `/admin/access/roles` — Role definitions matrix (`platform_admin`, `project_engineer`, `read_only_stakeholder`) and permission capabilities.
   - `/admin/access/invitations` — Manage user invitations, dispatch invites, track acceptance status.
   - `/admin/access/reviews` — Privileged access audit, inactive account reviews, security hygiene.

3. **Organizations & Projects**
   - `/admin/organizations` — Organization accounts, client entities, active projects, tiers.
   - `/admin/projects` — Project registry, LASBCA/COREN compliance status, ingestion channels.
   - `/admin/memberships` — Cross-organizational user assignments and project engineer scopes.
   - `/admin/provisioning` — Structured project and tenant provisioning wizard with confirmation.

4. **Integrations & Ingestion**
   - `/admin/integrations/messaging` — WhatsApp Business Cloud API & Telegram Bot telemetry and webhook connection status without leaking credentials.
   - `/admin/integrations/ingestion` — Message pipeline ingestion batches, duplicate detection, queue depth.
   - `/admin/data-quality` — Discrepancies, missing metadata, unverified identities, OCR exceptions.

5. **Governance & Audit**
   - `/admin/governance/report-templates` — Approved statutory reporting templates (A4, COREN/LASBCA).
   - `/admin/governance/audit-log` — Immutable administrative event log with actor, IP, timestamp, and diffs.
   - `/admin/governance/security-events` — Privileged sign-in anomalies, failed logins, access denials.
   - `/admin/governance/policies` — Platform retention, compliance thresholds (75%/80%), data retention policies.

6. **Platform Settings**
   - `/admin/settings` — Global system configurations, maintenance mode, notification relays.
   - `/admin/settings/branding` — Tenant branding, watermarking rules, authorized disclaimers.
   - `/admin/settings/integrations` — Safe webhook endpoints, retry parameters, rate limiting.

---

## 6. Authentication, Authorization & Security Architecture

1. **Session Handling:**  
   The Admin Console reads the `civora_session` HTTP-only cookie using the same Base64 serialization pattern as `Civora Frontend`.
2. **Server-Side Enforcement (`middleware.ts`):**  
   - All `/admin/:path*` routes are intercepted.
   - Unauthenticated visitors are redirected to `/login?redirect=...`.
   - Authenticated users without the `platform_admin` role are redirected to `/access-denied`.
   - Prevents client-only authorization bypassing.
3. **No Secret Leaks:**  
   Integration credentials, webhook tokens, and database passwords are masked or server-only. No sensitive keys appear in `NEXT_PUBLIC_*` variables.
4. **Audit Logging:**  
   Administrative mutations emit audit records capturing `timestamp`, `actorId`, `actorEmail`, `action`, `resourceId`, and `metadata`.

---

---

## 7. Authentication UI Desktop Parity (Synchronized)

The authentication experience in `Civora_Admin` has been updated to match the desktop layout of `Civora Frontend`:

1. **Split-Screen Desktop Architecture (50/50 Full-Bleed):**
   - **Left Panel (`lg:fixed lg:w-1/2 lg:h-screen bg-[#001237]`):**
     - Full-bleed architectural hero backdrop (`/images/auth_hero.jpg`) with gradient overlay (`bg-gradient-to-t from-[#001237]/90 via-[#001237]/25 to-[#001237]/40`).
     - Top-left circular brand badge with `browser_icon.png` (24x24) and uppercase bold Civora mark (`Encode Sans Condensed`).
     - Bottom headline: *"Bring every site into clearer view"*.
     - Subtext: *"Structured site updates, review workflows, and traceable reporting across every build."*
     - Pill carousel indicator dots (`[ — • • ]`).
   - **Right Panel (`lg:w-1/2 lg:ml-auto min-h-screen bg-white`):**
     - Top-right security clearance indicator (`Restricted Console` pill badge).
     - Centered `LoginForm` container with matching typography, input styling, and interactive states:
       - Header: *"Welcome Back to Civora!"* + *"Sign in your account"*.
       - Inputs: *"Your Email"* and *"Password"* with show/hide password toggle.
       - Row: *"Remember Me"* (with emerald checkmark) and *"Forgot Password?"* link.
       - Button: Full-width navy `#001237` submit button with hover effects and spinner.
       - Instant Login divider and role demo selectors (`Admin Role`, `Auditor Role`, and `Continue with Google`).
     - Bottom copyright note: `© 2026 Civora Systems • High-Assurance Construction Governance`.

2. **Auxiliary Auth Routes:**
   - `/forgot-password` — Password recovery flow with dispatch confirmation.

3. **Status:**
   - Zero lint errors (`npm run lint` -> 0 errors, 0 warnings).
   - All tests passing (`npm run test` -> 3/3 passed).
   - Production build verified (`npm run build` -> all 27 routes compiled).
   - Live dev server verified (`HTTP 200` on `/login`, `/forgot-password`, `/admin`).
