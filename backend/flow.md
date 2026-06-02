# DBDiagram Clone — MERN Stack Project Plan
> Demo: June 2, 10:15 AM | Stack: MongoDB + Express + React + Node

---

## 1. What We're Building

A pixel-close replica of dbdiagram.io using the **MERN stack**:
- Left panel: Monaco code editor with DBML syntax
- Right panel: ReactFlow ER diagram with **glowing connection lines** (blue glow, exactly like the screenshot)
- Blue table header cards, PK/FK icons, data type labels
- Save, Share (public URL), Register/Login
- MongoDB for persistence (no SQL needed)

---

## 2. Tech Stack

### Frontend
| Package | Purpose |
|---|---|
| `react` + `vite` | UI + dev server |
| `react-router-dom` | Routing |
| `@monaco-editor/react` | Left panel code editor |
| `reactflow` | Right panel ER diagram canvas |
| `zustand` | Global state (schema, auth, diagram) |
| `axios` | HTTP client |
| `tailwindcss` | Utility CSS |
| `lucide-react` | Icons (key, link, etc.) |
| `react-hot-toast` | Notifications |
| `nanoid` | Public share token generation |
| `dagre` | Auto-layout algorithm for nodes |

### Backend
| Package | Purpose |
|---|---|
| `express` | REST API |
| `mongoose` | MongoDB ODM |
| `bcryptjs` | Password hashing |
| `jsonwebtoken` | JWT auth |
| `cors` | Cross-origin headers |
| `dotenv` | Env vars |
| `express-validator` | Input validation |
| `nanoid` | Share token generation |

### Database
- **MongoDB Atlas** (free M0 tier — 512MB, always free, no credit card)

### Deployment (All Free)
| Service | What |
|---|---|
| **Vercel** | Frontend React app |
| **Render** | Node/Express backend |
| **MongoDB Atlas** | Database |

---

## 3. Folder Structure

```
dbdiagram-clone/
├── client/                              # React + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── Editor/
│   │   │   │   ├── SchemaEditor.jsx     # Monaco editor
│   │   │   │   └── EditorPanel.jsx      # Left panel (with collapse toggle)
│   │   │   ├── Diagram/
│   │   │   │   ├── DiagramCanvas.jsx    # ReactFlow wrapper
│   │   │   │   ├── TableNode.jsx        # Blue card node (exact UI match)
│   │   │   │   ├── GlowEdge.jsx         # Custom glowing FK edge ✨
│   │   │   │   └── DiagramPanel.jsx     # Right panel
│   │   │   ├── Auth/
│   │   │   │   ├── LoginModal.jsx
│   │   │   │   └── RegisterModal.jsx
│   │   │   ├── Navbar.jsx               # Top bar with Save/Share/Sign In
│   │   │   ├── ShareModal.jsx           # Copy URL modal
│   │   │   └── DiagramList.jsx          # User's saved diagrams sidebar
│   │   ├── pages/
│   │   │   ├── EditorPage.jsx           # Main split-panel page
│   │   │   └── SharedViewPage.jsx       # Read-only public diagram
│   │   ├── parser/
│   │   │   └── dbmlParser.js            # DBML text → AST
│   │   ├── store/
│   │   │   ├── useEditorStore.js        # Schema text + parse result
│   │   │   ├── useAuthStore.js          # User + JWT
│   │   │   └── useDiagramStore.js       # Saved diagrams list
│   │   ├── hooks/
│   │   │   └── useAutoSave.js           # Debounced save
│   │   ├── utils/
│   │   │   ├── schemaToFlow.js          # AST → ReactFlow nodes/edges
│   │   │   ├── autoLayout.js            # dagre layout engine
│   │   │   └── api.js                   # Axios instance
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                              # Node + Express
│   ├── models/
│   │   ├── User.js                      # Mongoose User model
│   │   └── Diagram.js                   # Mongoose Diagram model
│   ├── routes/
│   │   ├── auth.js                      # /api/auth/*
│   │   ├── diagrams.js                  # /api/diagrams/*
│   │   └── share.js                     # /api/share/:token
│   ├── middleware/
│   │   ├── authMiddleware.js            # JWT verify
│   │   └── validate.js                  # express-validator
│   ├── controllers/
│   │   ├── authController.js
│   │   └── diagramController.js
│   ├── app.js                           # Express setup
│   ├── server.js                        # Entry point
│   ├── .env
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 4. MongoDB Schema (Mongoose)

```js
// User.js
const userSchema = new mongoose.Schema({
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  name:     { type: String, default: 'User' }
}, { timestamps: true });

// Diagram.js
const diagramSchema = new mongoose.Schema({
  title:      { type: String, default: 'Untitled Diagram' },
  schema:     { type: String, default: '' },       // raw DBML text
  shareToken: { type: String, unique: true, sparse: true },
  isPublic:   { type: Boolean, default: false },
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
```

**Why MongoDB here instead of SQL?**
- Zero setup — Atlas free tier is instant
- Schema (DBML text) is just a string blob — no relational benefit needed
- Flexible enough to store diagram metadata

---

## 5. API Endpoints

```
# Auth
POST  /api/auth/register    { name, email, password }     → { token, user }
POST  /api/auth/login       { email, password }           → { token, user }
GET   /api/auth/me          [JWT]                         → { user }

# Diagrams (all require JWT)
GET   /api/diagrams                                       → [ ...diagrams ]
POST  /api/diagrams         { title }                     → diagram
GET   /api/diagrams/:id                                   → diagram
PUT   /api/diagrams/:id     { title?, schema? }           → diagram
DEL   /api/diagrams/:id                                   → 204

# Share
POST  /api/diagrams/:id/share   [JWT]                    → { shareUrl }
GET   /api/share/:token         [public]                 → diagram (read-only)
```

---

## 6. DBML Parser — Supported Syntax

```dbml
// Comments supported

Table users {
  id          integer   [primary key]
  username    varchar
  role        varchar
  created_at  timestamp
}

Table posts {
  id          integer   [primary key]
  title       varchar
  body        text      [note: 'Content of the post']
  user_id     integer   [not null]
  status      varchar
  created_at  timestamp
}

// Named ref (with label)
Ref user_posts: posts.user_id > users.id   // many-to-one

// Inline ref syntax
Ref: users.id < follows.following_user_id  // one-to-many
Ref: users.id < follows.followed_user_id
```

**Supported column flags:**
- `[primary key]` or `[pk]` → shows 🔑 icon
- `[ref: > table.col]` inline FK
- `[not null]` or `[not null]` → shows **NN** badge (like in screenshot)
- `[note: '...']` → shows 📋 icon (tooltip on hover)
- `[unique]` → shows **U** badge
- `[increment]` / `[auto_increment]`

**Parser output:**
```js
{
  tables: [
    {
      name: "users",
      columns: [
        { name: "id", type: "integer", pk: true },
        { name: "username", type: "varchar" },
      ]
    }
  ],
  refs: [
    {
      name: "user_posts",           // optional label
      fromTable: "posts",
      fromCol: "user_id",
      toTable: "users",
      toCol: "id",
      relation: "many-to-one"       // > means many-to-one, < one-to-many
    }
  ]
}
```

---

## 7. UI — Exact Match to Screenshot

### TableNode design
```
┌─────────────────────────────────────┐
│  users                   [blue bg]  │  ← table name, bold white
├─────────────────────────────────────┤
│  🔑 id            integer           │  ← PK: key icon, type right-aligned
│  🔗 username      varchar           │  ← FK: link icon
│     role          varchar           │
│     created_at    timestamp         │
└─────────────────────────────────────┘
```

Colors to match screenshot exactly:
- Table header: `#2d5fa6` (blue)
- Node background: `#1a1f2e` (dark navy)
- Column row hover: `#252b3b`
- Text: `#e0e4ef`
- Type text: `#8892a4` (muted)
- NN badge: red background `#e05353`
- PK icon: `#f5c842` (golden key)
- FK icon: `#6ab0f5` (blue link)

### GlowEdge — The Glowing Connection Lines ✨

This is the standout feature. ReactFlow custom edge with CSS glow:

```jsx
// GlowEdge.jsx
import { getBezierPath } from 'reactflow';

export default function GlowEdge({ id, sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition, data }) {
  const [edgePath] = getBezierPath({ sourceX, sourceY, sourcePosition,
    targetX, targetY, targetPosition });

  return (
    <g>
      {/* Outer glow layer — blurred wide stroke */}
      <path
        id={`${id}-glow`}
        className="react-flow__edge-path"
        d={edgePath}
        strokeWidth={8}
        stroke="#4a9eff"
        strokeOpacity={0.3}
        fill="none"
        filter="url(#glow-filter)"
      />
      {/* Core line */}
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        strokeWidth={2}
        stroke="#4a9eff"
        fill="none"
      />
      {/* Cardinality label: 0..1 or * */}
      <text>...</text>
      {/* SVG filter for glow effect */}
      <defs>
        <filter id="glow-filter">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
    </g>
  );
}
```

This gives the exact blue glowing bezier lines seen in the screenshot (the connection between users → posts and users → follows).

**Cardinality markers on edges:**
- `>` (many-to-one): show `*` on source, `0..1` on target
- `<` (one-to-many): show `0..1` on source, `*` on target  
- `-` (one-to-one): show `1` on both ends

### Navbar (top bar)

```
[🔷 logo] [Personal ▾] / [📍 Untitled Diagram]   [AI toggle] [Save] [Share] [Import ▾] [Export ▾]   [🌐 en] [? Help] [Sign In →]
```

- Keep it dark `#0f1117` background
- Blue accent buttons for Save/Share
- Collapse panel toggle button (the `<` arrow on the left edge of diagram)

---

## 8. Auto-Layout with Dagre

```js
// autoLayout.js
import dagre from 'dagre';

export function getLayoutedElements(nodes, edges) {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: 'LR', nodesep: 80, ranksep: 120 });
  g.setDefaultEdgeLabel(() => ({}));

  nodes.forEach(node => {
    // estimate height: 44px header + 32px per column
    const height = 44 + (node.data.columns.length * 32);
    g.setNode(node.id, { width: 220, height });
  });

  edges.forEach(edge => g.setEdge(edge.source, edge.target));

  dagre.layout(g);

  return nodes.map(node => {
    const { x, y } = g.node(node.id);
    return { ...node, position: { x, y } };
  });
}
```

Tables auto-arrange left-to-right. When schema changes, re-run layout only if it's the first render (preserve user's manual dragging after that).

---

## 9. Step-by-Step Build Tasks

### ✅ Phase 0 — Read This First
Study the screenshot carefully:
- Tables are cards with blue headers
- Connection lines are bezier curves with a blue glow + `0..1` and `*` labels
- Left panel has line numbers (Monaco)
- Right panel has zoom controls bottom-left, toolbar bottom-right
- Top navbar has exact button layout

---

### Phase 1 — Project Setup (2 hrs)
- [ ] 1.1 `mkdir dbdiagram-clone && cd dbdiagram-clone`
- [ ] 1.2 `npm create vite@latest client -- --template react`
- [ ] 1.3 Install client packages:
  ```bash
  cd client
  npm install react-router-dom @monaco-editor/react reactflow zustand \
    axios tailwindcss postcss autoprefixer lucide-react react-hot-toast \
    nanoid dagre
  npx tailwindcss init -p
  ```
- [ ] 1.4 Configure Tailwind — add `darkMode: 'class'`, set dark color palette
- [ ] 1.5 `mkdir server && cd server && npm init -y`
- [ ] 1.6 Install server packages:
  ```bash
  npm install express mongoose bcryptjs jsonwebtoken cors dotenv \
    express-validator nanoid
  npm install -D nodemon
  ```
- [ ] 1.7 Create MongoDB Atlas account → free M0 cluster → get `MONGODB_URI`
- [ ] 1.8 Create `.env` for server
- [ ] 1.9 Push to GitHub (private repo)

---

### Phase 2 — Server: Models + Auth (2 hrs)
- [ ] 2.1 Write `models/User.js` — email, password, name
- [ ] 2.2 Write `models/Diagram.js` — title, schema (String), shareToken, isPublic, userId ref
- [ ] 2.3 Write `app.js` — Express + CORS + JSON + route mounting
- [ ] 2.4 Write `server.js` — mongoose.connect + app.listen
- [ ] 2.5 Write `controllers/authController.js`:
  - `register`: hash password → create User → sign JWT → return
  - `login`: find user → compare password → sign JWT → return
  - `me`: return `req.user` from middleware
- [ ] 2.6 Write `middleware/authMiddleware.js` — verify JWT, attach `req.user`
- [ ] 2.7 Write `routes/auth.js` — POST /register, POST /login, GET /me
- [ ] 2.8 Test with Thunder Client / Postman

---

### Phase 3 — Server: Diagrams + Share (2 hrs)
- [ ] 3.1 Write `controllers/diagramController.js`:
  - `getAll`: find by userId
  - `create`: new Diagram({ userId, title })
  - `getOne`: findOne({ _id, userId })
  - `update`: findOneAndUpdate({ _id, userId }, { title, schema })
  - `remove`: findOneAndDelete({ _id, userId })
  - `share`: generate nanoid(10) → set shareToken + isPublic=true → return URL
- [ ] 3.2 Write `routes/diagrams.js` — all behind authMiddleware
- [ ] 3.3 Write `routes/share.js` — GET /api/share/:token → findOne({ shareToken }) → return public data
- [ ] 3.4 Test all endpoints

---

### Phase 4 — DBML Parser (3 hrs) ← most critical piece
- [ ] 4.1 Write `client/src/parser/dbmlParser.js`
  - [ ] 4.1a Strip comments (`//` and `/* */`)
  - [ ] 4.1b Find all `Table <name> { ... }` blocks
  - [ ] 4.1c Parse each column line:
    - regex: `/^\s*(\w+)\s+(\w+)\s*(\[.*?\])?\s*$/`
    - extract flags from `[...]`: pk, primary key, not null, unique, note, ref, increment
  - [ ] 4.1d Parse top-level `Ref` lines:
    - `Ref label: tableA.col > tableB.col` — named
    - `Ref: tableA.col > tableB.col` — anonymous
    - operators: `>` many-to-one, `<` one-to-many, `-` one-to-one
  - [ ] 4.1e Parse inline `[ref: > table.col]` inside column flags
  - [ ] 4.1f Return `{ tables, refs, errors }`
- [ ] 4.2 Test with the screenshot's schema (follows/users/posts)
- [ ] 4.3 Write `utils/schemaToFlow.js` — AST → nodes + edges
- [ ] 4.4 Write `utils/autoLayout.js` — dagre layout

---

### Phase 5 — TableNode Component (2 hrs) ← visual fidelity

- [ ] 5.1 Write `TableNode.jsx`:
  ```
  - Blue header (#2d5fa6) with table name in white bold
  - Each column row:
    - left: icon (🔑 for pk, 🔗 for fk, blank otherwise) + column name
    - right: type name (muted) + badges (NN, U)
  - Handle for FK connections on left and right edges
  - Border: 1px solid #3a4565
  - Hover row highlight
  ```
- [ ] 5.2 Register custom node type in ReactFlow: `nodeTypes={{ tableNode: TableNode }}`
- [ ] 5.3 Add ReactFlow handles (connection points) on left and right of each column row

---

### Phase 6 — GlowEdge Component (2 hrs) ← the wow effect

- [ ] 6.1 Write `GlowEdge.jsx`:
  - SVG `<defs>` with `feGaussianBlur` filter for glow
  - Two `<path>` elements: one wide + blurred (glow), one sharp (core line)
  - Stroke color: `#4a9eff` (bright blue)
  - Add cardinality text labels at source and target ends
  - Support `0..1`, `1`, `*` markers
- [ ] 6.2 Register: `edgeTypes={{ glowEdge: GlowEdge }}`
- [ ] 6.3 Set all generated edges to `type: 'glowEdge'`
- [ ] 6.4 Add animated `strokeDasharray` pulse on selected edge

---

### Phase 7 — Editor Panel (2 hrs)

- [ ] 7.1 Write `SchemaEditor.jsx`:
  - Monaco editor, `defaultLanguage="plaintext"` (or custom DBML)
  - Dark theme: `vs-dark` base, customized token colors
  - Font: `JetBrains Mono` or `Fira Code` (monospace)
  - Line numbers on, minimap off
  - On change: parse DBML → update store → update diagram
- [ ] 7.2 Write `EditorPanel.jsx`:
  - Collapsible (the `<` toggle in screenshot)
  - Fixed width 420px, collapses to 0
  - Error display bar below editor (red, shows parse errors)
- [ ] 7.3 Add DBML syntax highlighting (optional — custom Monaco language):
  - Keywords: `Table`, `Ref`, `primary`, `key`, `not`, `null`
  - Types: `integer`, `varchar`, `text`, `timestamp` (blue)
  - Table/column names (white)
  - Comments (green)

---

### Phase 8 — Diagram Panel (1 hr)

- [ ] 8.1 Write `DiagramPanel.jsx`:
  - ReactFlow with custom nodes + edges
  - Controls: zoom in/out, fit view (bottom-left)
  - MiniMap (bottom-right, small)
  - Background: dark dots pattern `#1a1f2e`
  - On schema change → re-parse → re-layout → update nodes/edges
- [ ] 8.2 Preserve user's manual node positions after first auto-layout

---

### Phase 9 — Navbar (1 hr)

- [ ] 9.1 Write `Navbar.jsx`:
  - Logo + "Personal" workspace dropdown
  - Diagram title (editable inline click-to-edit)
  - Save button (disabled if not logged in → show login prompt)
  - Share button → opens ShareModal
  - Sign In / user avatar (if logged in)
- [ ] 9.2 Wire Save → PUT /api/diagrams/:id (or POST if no id yet)

---

### Phase 10 — Auth UI (2 hrs)

- [ ] 10.1 Write `LoginModal.jsx` — email + password, submit → POST /api/auth/login
- [ ] 10.2 Write `RegisterModal.jsx` — name + email + password
- [ ] 10.3 Write `useAuthStore.js` (zustand):
  ```js
  { user, token, login(token, user), logout() }
  // persist token to localStorage
  ```
- [ ] 10.4 Axios interceptor: attach `Authorization: Bearer <token>`
- [ ] 10.5 On app load: read token from localStorage → GET /api/auth/me → restore session

---

### Phase 11 — Save & Load (2 hrs)

- [ ] 11.1 On login: fetch diagrams list → load most recent one
- [ ] 11.2 Write `useAutoSave.js`:
  - Debounce 1500ms after schema change
  - If logged in + diagram id exists → PUT /api/diagrams/:id
  - Show "Saving..." / "Saved" indicator in navbar
- [ ] 11.3 "New Diagram" flow — POST /api/diagrams → get id → start editing
- [ ] 11.4 Diagrams list in a side menu (optional, keep simple)

---

### Phase 12 — Share Feature (1.5 hrs)

- [ ] 12.1 Write `ShareModal.jsx`:
  - Click Share button → POST /api/diagrams/:id/share
  - Show generated URL
  - "Copy link" button → `navigator.clipboard.writeText(url)` + toast
- [ ] 12.2 Write `SharedViewPage.jsx` (`/share/:token` route):
  - GET /api/share/:token → get diagram + schema
  - Parse DBML → render DiagramCanvas in read-only mode
  - `nodesDraggable={false}`, `nodesConnectable={false}`, no toolbar
  - Show diagram title at top
  - "Sign up to create your own" CTA banner

---

### Phase 13 — Polish (2 hrs)

- [ ] 13.1 Parse error handling: show inline error bar under editor with line number
- [ ] 13.2 Empty state: default sample DBML in editor on first load
- [ ] 13.3 Loading skeletons for diagram on initial load
- [ ] 13.4 Responsive: stack panels vertically on mobile
- [ ] 13.5 JWT expiry: catch 401 → auto logout + toast
- [ ] 13.6 Page title updates to diagram name

---

### Phase 14 — Deployment (3 hrs)

- [ ] 14.1 **MongoDB Atlas**: already set up. Whitelist `0.0.0.0/0` for Render IPs
- [ ] 14.2 **Backend → Render**:
  - Push `server/` to GitHub
  - New Web Service on Render → connect repo → set root dir to `server`
  - Start command: `node server.js`
  - Add env vars: `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`, `PORT`
  - Free tier = auto-sleeps after 15min inactivity (cold start ~30s, acceptable for demo)
- [ ] 14.3 **Frontend → Vercel**:
  - Push `client/` to GitHub
  - Import to Vercel → set root dir to `client`
  - Add env var: `VITE_API_URL=https://your-backend.onrender.com`
  - Deploy
- [ ] 14.4 Update backend CORS: allow your Vercel domain
- [ ] 14.5 End-to-end test on production URLs
- [ ] 14.6 **Tip for demo**: Hit the backend URL once before 10:15 AM to wake it from sleep

---

### Phase 15 — Demo Prep (1 hr)

- [ ] 15.1 Pre-load the screenshot's schema as default content:
  ```dbml
  Table follows {
    following_user_id integer
    followed_user_id  integer
    created_at        timestamp
  }
  Table users {
    id         integer [primary key]
    username   varchar
    role       varchar
    created_at timestamp
  }
  Table posts {
    id         integer [primary key]
    title      varchar
    body       text [note: 'Content of the post']
    user_id    integer [not null]
    status     varchar
    created_at timestamp
  }
  Ref user_posts: posts.user_id > users.id
  Ref: users.id < follows.following_user_id
  Ref: users.id < follows.followed_user_id
  ```
- [ ] 15.2 Create demo account: `demo@dbdiagram.ai` / strong password
- [ ] 15.3 Demo script (5 min):
  1. Open app → editor + diagram visible immediately
  2. Add a new table live → diagram updates instantly
  3. Add a Ref line → glowing connection appears
  4. Register a new account
  5. Save diagram → "Saved ✓" appears in navbar
  6. Click Share → copy URL
  7. Open URL in incognito → read-only view, same diagram

---

## 10. Environment Variables

```bash
# server/.env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbdiagram
JWT_SECRET=super_long_random_secret_here
PORT=4000
CLIENT_URL=https://your-app.vercel.app

# client/.env
VITE_API_URL=https://your-backend.onrender.com
```

---

## 11. Package Install Commands

```bash
# CLIENT
cd client
npm create vite@latest . -- --template react
npm install react-router-dom @monaco-editor/react reactflow zustand \
  axios lucide-react react-hot-toast nanoid dagre
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# SERVER
mkdir server && cd server
npm init -y
npm install express mongoose bcryptjs jsonwebtoken cors dotenv \
  express-validator nanoid
npm install -D nodemon
```

---

## 12. Timeline

| Day | Work | Hours |
|-----|------|-------|
| **May 30 (today)** | Phase 1 setup + Phase 2 Auth backend | 4h |
| **May 31 AM** | Phase 3 Diagrams API + Phase 4 DBML Parser | 5h |
| **May 31 PM** | Phase 5 TableNode + Phase 6 GlowEdge | 4h |
| **Jun 1 AM** | Phase 7 Editor + Phase 8 Diagram Panel + Phase 9 Navbar | 4h |
| **Jun 1 PM** | Phase 10 Auth UI + Phase 11 Save/Load + Phase 12 Share | 5h |
| **Jun 1 Evening** | Phase 13 Polish + Phase 14 Deploy | 5h |
| **Jun 2 Morning** | Phase 15 Demo Prep + buffer for bugs | 2h |

> **Goal: deployed by Jun 1 midnight so Jun 2 morning is pure buffer.**

---

## 13. Critical Implementation Tips

### Parser Edge Cases to Handle
```dbml
// These should all parse correctly:
Table "user accounts" { ... }          // quoted names
id int [pk, not null, increment]       // multiple flags
Ref: orders.user_id > users.id        // space variations
ref: orders.user_id > users.id        // lowercase ref
```

### ReactFlow Performance
- Memoize `nodes` and `edges` arrays with `useMemo`
- Only re-layout when table structure changes (not just schema text)
- Use `useNodesState` and `useEdgesState` from ReactFlow

### Glow Effect CSS
Add this to your global CSS for the SVG filter to work across all edges:
```css
.react-flow__edges {
  overflow: visible;  /* required for glow to not clip */
}
```

### MongoDB Connection
```js
// Reconnect on failure (important for Render's free tier)
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
  retryWrites: true,
});
```

### Render Cold Start Fix for Demo
Add a `/health` endpoint and call it from frontend on page load:
```js
// server
app.get('/health', (req, res) => res.json({ ok: true }));

// client — on app mount
axios.get(`${API_URL}/health`).catch(() => {});
```

---

## 14. Final Checklist Before Demo

- [ ] Split panel loads instantly, no layout shift
- [ ] Typing in editor updates diagram in real time (<500ms)
- [ ] Blue table cards match screenshot exactly
- [ ] Glowing blue bezier lines connect tables
- [ ] `0..1` and `*` cardinality labels on edges
- [ ] PK columns show key icon, FK columns show link icon
- [ ] NN badge shows on `[not null]` columns
- [ ] Register works
- [ ] Login works, session persists on refresh
- [ ] Save button saves schema, title editable
- [ ] Share → generates URL → opens read-only in incognito
- [ ] Deployed on public URLs (not localhost)
- [ ] Backend awake before demo starts