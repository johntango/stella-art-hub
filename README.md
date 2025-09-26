# Welcome to your Lovable project

To move to Github
in App.tsx change <BrowserRouter> to <HashRouter>
Create action to deploy to dist on build in .github/workflows/pages.yml
Vite + React → GitHub Pages (project repo)
(works out of the box for https://<user>.github.io/<repo>/)
Start in Lovable

• Create a very simple "Hello World" site. I will deploy in Github.
• Change project name
• Connect Github -> Connect Project 0) Make repository public
Go to: Settings → Danger Zone → Change repository visibility

1. Open a Codespace for the new repository
   rm -f bun.lockb
   echo -e "\n# bun\nbun.lockb" >> .gitignore
   (If bun.lockb exists, remove it and ignore it, then npm ci again.)
   node -v # v18+ or v20
   npm ci
   #optional - run locally
   npm run dev # optional: preview
   npm run build # outputs to dist/
2. Vite config — single source of truth for the base URL
   Replace your current base logic with an env-driven one:
   // vite.config.ts
   import { defineConfig } from "vite";
   import react from "@vitejs/plugin-react-swc";
   import path from "path";
   import { componentTagger } from "lovable-tagger";
   export default defineConfig(({ mode }) => ({
   // 👇 Pull from env (set by GitHub Actions). Defaults to "/" in dev.
   base: process.env.BASE_URL ?? "/",
   server: { host: "::", port: 8080 },
   plugins: [react(), mode === "development" &&
   componentTagger()].filter(Boolean),
   resolve: { alias: { "@": path.resolve(\_\_dirname, "./src") } },
   }));
3. SPA routing fixes (your two changes)
   Use HashRouter — no 404 trick needed. Keeps URLs like /#/about. One code change, then you can
   delete the postbuild 404 step.
   src/App.tsx

- import { BrowserRouter, Routes, Route } from "react-router-dom";

* import { HashRouter as Router, Routes, Route } from "react-router-dom";

- <BrowserRouter basename={import.meta.env.BASE_URL}>

* <Router>
  <Routes>
  <Route path="/" element={<Index />} />
  <Route path="*" element={<NotFound />} />
  </Routes>

- </BrowserRouter>

* </Router>
  package.json
  With HashRouter, delete the 404 fallback step (some projects will not have it):

- "postbuild": "cp dist/index.html dist/404.html"
  [ SEE NEXT PAGE FOR STEP 4 ]

4. GitHub Actions workflow (auto-deploy on push)
   Create .github/workflows/pages.yml:
   name: Deploy Vite site to GitHub Pages
   on:
   push:
   branches: [ main ]
   workflow_dispatch:
   permissions:
   contents: read
   pages: write
   id-token: write
   concurrency:
   group: pages
   cancel-in-progress: true
   jobs:
   build:
   runs-on: ubuntu-latest
   steps:

- uses: actions/checkout@v4
- uses: actions/setup-node@v4
  with:
  node-version: '20'
  cache: 'npm'
- run: npm ci
- run: npm run build
  env:

# 👇 auto-sets the correct base for project pages

BASE_URL: /${{ github.event.repository.name }}/

- uses: actions/upload-pages-artifact@v3
  with:
  path: dist
  deploy:
  needs: build
  runs-on: ubuntu-latest
  environment:
  name: github-pages
  url: ${{ steps.deploy.outputs.page_url }}
  steps:
- id: deploy
  uses: actions/deploy-pages@v4

5. (Optional) Local sanity check
   npm ci
   npm run dev # preview
   npm run build # produces dist/
6. Commit/push changes
   Commit changes to the repository
7. Setup actions
   In Settings → Pages, set Source = GitHub Actions (so your workflow actually publishes).

## Project info

**URL**: https://lovable.dev/projects/1c30b750-4dcd-437e-bd6f-b65a48b4a0d2

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/1c30b750-4dcd-437e-bd6f-b65a48b4a0d2) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/1c30b750-4dcd-437e-bd6f-b65a48b4a0d2) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
