# Recode Dashboard Architecture

## Purpose

This document exists to reduce context size during task work. For small changes, read only the module that owns the behavior plus its direct dependencies. Do not load the whole repo unless the task crosses module boundaries.

## Stack

- Frontend: React 18 + Vite.
- UI: Chakra UI, Tailwind utility layer, custom shared components.
- Routing: React Router v5 with route grouping under `src/app/router`.
- Data access: `fetch` wrappers in `src/services`.
- Auth transport: backend keeps the JWT in an HTTP-only cookie; frontend uses `credentials: "include"`.

## Minimal Context Rules

- Start from the route or screen the task mentions.
- Then read only the owning module in `src/views/...` or `src/features/...`.
- Add direct dependencies only if needed: usually one of `src/services`, `src/components`, `src/utils`, `src/theme`.
- Avoid reading large asset folders unless the task is visual and asset-related.
- Ignore generated and dependency folders such as `node_modules`, `build`, and other transient caches.

## Source Map

### `src/main.jsx`

- Application bootstrap.
- Mounts the React app and global providers.

### `src/app/router`

- Central routing layer.
- `appRouter.js`: top-level router assembly.
- `routePaths.js`: route constants.
- `routes/*.js`: grouped route definitions for auth, dashboard, main site, and legacy redirects.
- Read this area first for navigation bugs, route creation, redirects, and lazy loading issues.

### `src/layouts`

- Route shells for major app zones.
- `Main.js`: public marketing/documentation shell.
- `Auth.js`: authentication pages shell.
- `Admin.js`: private dashboard shell.
- Read this area for shared page chrome, wrappers, sidebar/navbar composition, and route-level guards.

### `src/views`

- Page-level modules. This is the primary entry point for most tasks.

#### `src/views/Main`

- Public site pages: landing, blog, article pages, contacts, documentation, legal pages, macro translator.
- Scope here for marketing copy, landing UX, public navigation, and legal/documentation updates.

#### `src/views/Auth`

- Sign-in and sign-up flows.
- Scope here for login, registration, verification-code UX, and auth form validation.

#### `src/views/Dashboard`

- Private product area.
- Major submodules:
- `Dashboard`: overview page widgets and summary cards.
- `Profile`: user profile screen and profile-specific components.
- `ProfileComplete`: secondary registration flow after signup.
- `Company`: organization card, employee tab, company-related dashboard blocks.
- `CompanyRegistration`: organization binding/creation flow.
- `Billing` and `BillingPay`: tariffs, purchases, and payment-related flows.
- `ConversionHistory`: conversion history screen.
- `Support`: support requests and support-related UI.
- `Tariff`: tariff presentation blocks.
- `Tables`: reusable dashboard page fragments for employee/project tables.
- For most product tasks, start in exactly one of these folders and do not read siblings unless the behavior is shared.

### `src/features`

- Self-contained feature packages that are larger than a page widget.

#### `src/features/constructor`

- Constructor feature with its own `components`, `hooks`, `constants`, `styles`, `utils`, and local assets.
- Treat this as an isolated mini-application.
- For constructor tasks, prefer staying entirely inside this folder first.

#### `src/features/macroConstructor`

- Macro constructor entry module.
- Read only when the task explicitly mentions macro constructor behavior.

### `src/services`

- API and side-effect layer.
- `apiClient.js`: base request behavior.
- `auth.js`: login, registration, verification, current-user access.
- `organization.js`: company and employee operations.
- `conversions.js`, `tokenHistory.js`: conversion and token history requests.
- `subscription.js`: tariff/subscription calls.
- `supportTickets.js`, `supportEmail.js`: support flows.
- `dadata.js`: browser-side DaData integration for company suggestions.
- `macroTranslator.js`: macro translator API integration.
- `session.js`: local session markers and related helpers.
- Read this layer when a page bug is caused by backend contract, request payload, session state, or API error handling.

### `src/components`

- Shared UI building blocks reused across pages.
- Important groups:
- `Navbars`, `Sidebar`, `Layout`: app chrome and shell pieces.
- `Card`, `Icons`, `Separator`: low-level reusable primitives.
- `Tables`: shared row/table components including conversion history.
- `aceternity`: decorative/marketing-focused presentational components.
- Read this area only when multiple pages share the same UI behavior or styling.

### `src/theme`

- Chakra theme overrides and design tokens.
- `components/*`: component-level theme customizations.
- `foundations/*`: typography and breakpoints.
- `additions/*`: custom layout/card theme pieces.
- Read this area for global styling regressions, theme tokens, or Chakra variant changes.

### `src/styles`

- Tailwind entry stylesheet.
- Usually relevant only for global CSS layer changes.

### `src/utils`

- Pure helpers and app-specific utility logic.
- Includes navigation helpers, admin access checks, conversions formatting, site search, and subscription helpers.
- Read this area when behavior is computed rather than rendered.

### `src/constants` and `src/variables`

- Static configuration and chart/general constants.
- Read only for tasks involving constant values, labels, or visualization config.

### `src/lib`

- Tiny generic helpers such as `cn.js`.
- Usually only needed as a direct dependency from a component.

### `src/assets` and `public`

- Images, SVGs, and static assets.
- Avoid loading these folders unless the task changes visuals, branding, or referenced files.

## Route-to-Module Quick Map

- `/auth/*` -> `src/views/Auth` + `src/services/auth.js`
- Public site pages -> `src/views/Main`
- `/lk/profile` -> `src/views/Dashboard/Profile` + `src/services/auth.js`
- `/lk/profile/complete` -> `src/views/Dashboard/ProfileComplete` + `src/services/auth.js`
- `/lk/company` -> `src/views/Dashboard/Company` + `src/services/organization.js`
- `/lk/company/reg` -> `src/views/Dashboard/CompanyRegistration` + `src/services/organization.js` + `src/services/dadata.js`
- Billing/tariffs -> `src/views/Dashboard/Billing`, `BillingPay`, `Tariff`, `src/services/subscription.js`
- Conversion history -> `src/views/Dashboard/ConversionHistory` + `src/services/conversions.js`
- Support -> `src/views/Dashboard/Support` + `src/services/supportTickets.js`
- Macro translator -> `src/views/Main/MacroTranslator` + `src/services/macroTranslator.js`
- Constructor work -> `src/features/constructor`

## Backend Contract Snapshot

- `POST /api/register`
- `POST /api/verification-code/send`
- `POST /api/verification-code/verify`
- `POST /api/login`
- `GET /api/user/details`
- `POST /api/registration/complete`
- `GET /api/organization/details`
- `POST /api/organization/create`
- `GET /api/organization/employees`
- `POST /api/organization/employees/create`
- `POST /api/organization/employees/add`
- `POST /api/organization/employees/deactivate`
- `POST /api/organization/employees/tokens/transfer`
- `GET /api/conversions/organization?limit=N`

## Practical Scoping Examples

- Button text on company registration page: read `src/views/Dashboard/CompanyRegistration`, then only the directly imported service/helper files.
- Broken employee action in company tab: read `src/views/Dashboard/Company` and `src/services/organization.js`; add shared table components only if the bug is inside the table UI.
- Landing page visual tweak: read `src/views/Main/Landing` and the exact shared marketing component it imports.
- Constructor modal issue: stay inside `src/features/constructor/components` and related local hooks/constants before reading anything global.
