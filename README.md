# Student Toolkit — News Worker

Auto-deploys to Cloudflare Workers via GitHub Actions.

## One-time Setup (5 minutes)

### Step 1 — Create a new GitHub repo
1. Go to github.com → New repository
2. Name it: `news-worker`
3. Set to Public
4. Click "Create repository"

### Step 2 — Upload these files
Upload all 3 files to the repo:
- `worker.js`
- `wrangler.toml`
- `.github/workflows/deploy.yml`

### Step 3 — Get your Cloudflare API Token
1. Go to dash.cloudflare.com
2. Click your profile icon (top right) → "My Profile"
3. Click "API Tokens" tab
4. Click "Create Token"
5. Click "Use template" next to "Edit Cloudflare Workers"
6. Click "Continue to summary" → "Create Token"
7. **Copy the token** (you only see it once!)

### Step 4 — Add token to GitHub
1. Go to your `news-worker` repo on GitHub
2. Click Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `CF_API_TOKEN`
5. Value: paste your Cloudflare token
6. Click "Add secret"

### Step 5 — Trigger deploy
1. Go to Actions tab in your repo
2. Click the workflow → "Run workflow"
3. Wait ~30 seconds

### Step 6 — Get your Worker URL
Go to dash.cloudflare.com → Workers & Pages → student-news
Your URL will be: `https://student-news.YOUR-ACCOUNT.workers.dev`

Test it: open `https://student-news.YOUR-ACCOUNT.workers.dev/?cat=top`
You should see JSON with news articles!
