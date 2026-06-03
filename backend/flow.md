# DB Diagram Project Flow

## Project Goal
Build a very simple DB diagram app where a user can type a database schema on the left side and immediately see a diagram on the right side.

Keep the app simple. Do not add extra UI polish until the main features work.

---

## Core Requirements

### 1. Home Page Editor + Diagram
- When the home page opens, show two panels:
  - Left panel: text window/editor for database schema.
  - Right panel: generated database diagram.
- Diagram should update from the schema text.
- Current app already has this basic split layout.

### 2. Database Schema Support
At minimum, schema parsing and diagram display should support:
- Table names.
- Column names.
- Data types.
- Primary key / PK.
- Foreign key / FK.
- Relationship arrows between tables.

### 3. Public Share URL
- A logged-in user should be able to share a diagram using a public URL.
- Shared URL should be read-only.
- Another user should be able to open the URL and view the diagram.
- Shared diagram should not be editable from the public page.

### 4. Registration + Sign In
- Add basic registration.
- Add basic sign in.
- Add logout.
- Show the signed-in user's name in the navbar.
- User should be able to continue working on saved schema after signing in.

### 5. Keep It Simple
- Avoid complex dashboard, teams, permissions, import/export, AI features, or heavy UI redesign.
- First finish auth, save/load, and public read-only sharing.

---

## Current Project Status

### Already Done / Mostly Done
- Frontend React + Vite app exists.
- Backend Express + MongoDB app exists.
- Home page has left editor and right diagram area.
- DBML/schema parser exists in frontend utilities.
- ReactFlow diagram rendering exists.
- User model exists.
- Auth backend routes exist:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/auth/me`
- Login and register pages are wired to backend auth.
- Navbar has sign in, register, logout, and username display.

### Partially Done
- Diagram model exists, but save/load/share API flow still needs to be completed and connected.
- Navbar has Save and Share buttons visually, but they still need real actions.
- Schema parsing and diagram display should be checked against PK, FK, data type, and arrows requirement.

### Not Done Yet
- Saving schema for a logged-in user.
- Loading saved schema when user returns.
- Public share URL generation.
- Public read-only shared diagram page.
- Proper FK arrow behavior needs final verification.
- Basic error/loading messages for save, share, login, and register.

---

## Left Out / Unfinished Work Report

### Auth Left Out
- Restore login session on refresh using saved token.
- Optionally call `/api/auth/me` on app load to verify token.
- Add axios authorization header for protected requests.
- Handle expired/invalid token by logging user out.

### Save/Load Left Out
- Create backend diagram routes.
- Save current schema text for logged-in user.
- Load the user's latest saved diagram on home page.
- Keep diagram title as `Untitled project` for now unless user changes it later.

### Share Left Out
- Generate public share token or public id.
- Store public share token with diagram.
- Add public route like `/share/:token`.
- Render shared diagram read-only.
- Disable editing on public shared page.

### Parser/Diagram Left Out
- Verify parser supports PK and FK syntax consistently.
- Verify arrows are created for FK relationships.
- Verify data types show in diagram nodes.
- Add a small default schema example for testing.

### UI/UX Left Out
- Save button should show simple feedback like `Saved` or `Please sign in`.
- Share button should show/copy public URL.
- Login/register should show basic error messages.
- No major UI redesign needed right now.

---

## Remaining Tasks

### Task 1 — Verify Schema Parser
- Test table parsing with column name and data type.
- Test PK syntax like `[pk]` and `[primary key]`.
- Test FK syntax through `Ref:` lines or inline ref syntax.
- Confirm arrows appear on the diagram.

### Task 2 — Add Auth Session Restore
- Read token and user from `localStorage` on app load.
- Attach token to API requests.
- Use `/api/auth/me` to verify saved token if needed.
- Logout user if token is invalid.

### Task 3 — Add Diagram Backend API
Create protected endpoints:
- `GET /api/diagrams/latest` — get user's latest diagram.
- `POST /api/diagrams` — create/save a diagram.
- `PUT /api/diagrams/:id` — update schema/title.
- Keep only the minimum needed for one-user save/load flow.

### Task 4 — Connect Save Button
- Save current schema from home page.
- If user is not signed in, send them to sign in.
- If no diagram exists yet, create one.
- If diagram exists, update it.

### Task 5 — Load User Work
- After login, navigate to home page.
- On home page, load user's latest saved schema.
- If no saved schema exists, show the default starter schema.

### Task 6 — Add Public Sharing
- Add backend route to create/get share token.
- Connect navbar Share button.
- Copy generated URL to clipboard or show it on screen.
- Public URL format can be simple: `/share/<token>`.

### Task 7 — Add Read-Only Share Page
- Add frontend route `/share/:token`.
- Fetch public diagram by token.
- Render only the right-side diagram or a read-only schema + diagram view.
- Do not allow editing from this page.

### Task 8 — Final Basic Testing
- Register new user.
- Sign in existing user.
- Logout.
- Show username in navbar.
- Save schema.
- Refresh and confirm saved schema loads.
- Share URL and open it in another browser/incognito.
- Confirm shared URL is public and read-only.

---

## Suggested Simple Data Model

### User
```js
{
  name: String,
  email: String,
  password: String
}
```

### Diagram
```js
{
  title: String,
  schema: String,
  userId: ObjectId,
  shareToken: String,
  isPublic: Boolean
}
```

---

## Suggested Minimal API Plan

### Auth
```txt
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Diagrams
```txt
GET  /api/diagrams/latest
POST /api/diagrams
PUT  /api/diagrams/:id
POST /api/diagrams/:id/share
GET  /api/share/:token
```

---

## Final Demo Checklist
- Home page opens with schema editor on left and diagram on right.
- Schema supports PK, FK, data type, and arrows.
- Register works.
- Sign in works.
- Logout works.
- Navbar shows user name after login.
- Save stores schema for the signed-in user.
- Saved schema loads after refresh/login.
- Share creates a public URL.
- Public URL opens a read-only diagram.
