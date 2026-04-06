# SkillSwap

## Setup

### 1. Database — Supabase
1. Create a free project at supabase.com
2. Copy the **Connection string** (URI format) from Project Settings → Database

### 2. Backend
```bash
cd server
cp .env.example .env
# Paste your Supabase connection string into DATABASE_URL in .env
# Set a strong JWT_SECRET

npm install
npx prisma migrate dev --name init   # creates tables
npm run dev                          # starts on port 5000
```

### 3. Frontend
```bash
cd client
npm install
npm run dev   # starts on port 5173 (proxies /api → localhost:5000)
```

## API Routes

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/register | — | Register |
| POST | /api/auth/login | — | Login |
| GET | /api/auth/me | ✓ | Current user |
| GET | /api/users | — | Browse users |
| GET | /api/users/:id | — | User profile |
| PUT | /api/users/:id | ✓ | Update profile |
| GET | /api/skills/user/:userId | — | User's skills |
| POST | /api/skills | ✓ | Add skill |
| PUT | /api/skills/:id | ✓ | Edit skill |
| DELETE | /api/skills/:id | ✓ | Delete skill |
| GET | /api/swaps | ✓ | My swap requests |
| POST | /api/swaps | ✓ | Send swap request |
| PUT | /api/swaps/:id | ✓ | Accept/reject request |
| GET | /api/reviews/user/:userId | — | User's reviews |
| POST | /api/reviews | ✓ | Leave a review |
