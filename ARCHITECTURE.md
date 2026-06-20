# Recode Dashboard Architecture

## Frontend

- React 16 application built with Create React App, Chakra UI, and React Router v5.
- Local development proxies relative `/api/*` requests to `http://localhost:8080` via `package.json`.
- API calls live in `src/services`; authenticated requests use `fetch` with `credentials: "include"` because the backend stores the JWT in an HTTP-only `token` cookie.
- Company suggestions use DaData directly from the browser when `REACT_APP_DADATA_API_KEY` is present. Without this env key the company binding form stays fully manual.

## Auth Flow

- Primary registration is handled on `/auth/sign-up` and collects `name`, email, password, and the email verification code.
- After successful email verification, the frontend logs the user in, stores local pending-profile markers, and redirects to `/admin/profile/complete`.
- Secondary registration is handled on `/admin/profile/complete`; this form collects profile details and calls `POST /api/registration/complete`.
- Completed sessions are verified with `GET /api/user/details`. Admin pages redirect to `/auth/login-page` when the local auth marker is absent or the backend rejects the session.
- Logout currently clears only frontend session markers. The backend cookie is HTTP-only and requires a backend logout endpoint to be deleted from the browser.

## Backend Contract

- `POST /api/register` accepts `{ name, email, password }`.
- `POST /api/verification-code/send` accepts `{ email }`.
- `POST /api/verification-code/verify` accepts `{ email, code }`.
- `POST /api/login` accepts `{ email, password }` and sets the `token` cookie.
- `POST /api/registration/complete` accepts `{ email, name, surname, lastname }`.
- `GET /api/user/details` requires completed auth and returns the current user profile.
- `GET /api/organization/details` returns the organization card data used on `/admin/company`.
- `POST /api/organization/create` accepts `{ full_name, ogrn, inn, kpp }`; `full_name` and `kpp` are required by the backend.
- `GET /api/organization/employees` returns employees for the current organization.
- `POST /api/organization/employees/create` creates a new employee account and sends generated credentials by email.
- `POST /api/organization/employees/add` links an already registered user by email.
- `POST /api/organization/employees/deactivate` disables an employee by email.
- `POST /api/organization/employees/tokens/transfer` transfers organization tokens to an employee member id.
- `GET /api/conversions/organization?limit=N` returns recent organization conversion history.

## Profile Page

- `/admin/profile` loads account data from `GET /api/user/details`.
- If `has_organization` is true, organization name is loaded separately from `GET /api/organization/details`.
- The "Последние конвертации" block loads recent rows from `GET /api/conversions?limit=9`.
- Phone and avatar are not backend-backed fields yet. The profile page shows phone as `Не указано`, and avatar changes remain local UI state only.

## Company Pages

- `/admin/company` first loads `GET /api/user/details`. If `has_organization` is false, the user is redirected to `/admin/company/reg`.
- The company card uses only backend-backed organization fields: `full_name`, `inn`, `kpp`, `ogrn`, `tokens_remain`, and `employees_count`. Address, phone, responsible person, and company email are shown as `Не указано` until the backend exposes storage for them.
- The company employees tab embeds the shared employee table and loads real employees from `GET /api/organization/employees`.
- The company conversion history uses `GET /api/conversions/organization?limit=9`.
- `/admin/company/reg` is the company binding page. It can prefill `full_name`, `inn`, `kpp`, and `ogrn` from DaData party suggestions, then submits only the backend-supported payload to `POST /api/organization/create`.

## Employee Management

- The employee table redirects accounts without a linked company to `/admin/company/reg`.
- Directors can create a new employee with `{ email, name, surname }`; the backend owns password generation and email delivery.
- Existing users can be linked by email through `POST /api/organization/employees/add`.
- Employees can be deactivated by email, and organization tokens can be transferred to a member through `organization_member_id`.
