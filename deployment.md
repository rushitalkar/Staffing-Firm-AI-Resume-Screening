# Deployment & Local Run Guide
**Company A, Noida — Intelligent Staffing & Shortlist OS**

Repository: [https://github.com/rushitalkar/resume](https://github.com/rushitalkar/resume)  
Live Demo: [http://localhost:5173/](http://localhost:5173/) (or Vercel / Netlify deployment link)

---

## 1. How to Run Locally (Step by Step)

### Prerequisites
- **Node.js**: `v18.0.0` or higher (verified on Node `v24.19.0`)
- **Package Manager**: `npm` (v9+) or `pnpm` / `yarn`
- **Modern Browser**: Chrome, Edge, Firefox, or Safari

### Step 1: Clone the Repository
```bash
git clone https://github.com/rushitalkar/resume.git
cd resume
```

### Step 2: Install Dependencies
```bash
npm install
```
*Key dependencies installed:*
- `react` (v19) & `react-dom`
- `vite` (v8) bundler
- `tailwindcss` (v3) & `postcss`
- `lucide-react` (iconography)
- `mammoth` (client-side `.docx` text extraction)
- `pdfjs-dist` (PDF document parsing)
- `clsx` & `tailwind-merge`

### Step 3: Run the Development Server
```bash
npm run dev
```
The application will launch immediately at:
```text
➜  Local:   http://localhost:5173/
```
Open your browser and navigate to `http://localhost:5173/`.

### Step 4: Verify Production Build (Optional)
To verify TypeScript compilation and production asset bundling:
```bash
npm run build
npm run preview
```

---

## 2. Production Deployment & Cloud Architecture

### Option A: Vercel / Netlify (Recommended Serverless Edge)
1. Push repository to GitHub (`https://github.com/rushitalkar/resume`).
2. Import project into Vercel or Netlify dashboard.
3. Build Settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. Click **Deploy**. Edge caching and global CDN routing activate automatically.

### Option B: Docker Container Deployment
```dockerfile
# Build Stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production Server Stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 3. Environment Variables

> **Security Rule**: In strict compliance with guidelines and the DPDP Act 2023, names only are listed below. Zero values, secrets, or personal credentials are committed to version control.

| Environment Variable Name | Purpose | Scope |
| :--- | :--- | :--- |
| `VITE_APP_ENV` | Application environment (`development`, `staging`, `production`) | Client Build |
| `VITE_API_BASE_URL` | Base endpoint for backend candidate API gateway | Network |
| `VITE_AI_SCORER_GATEWAY` | LLM inference gateway for scorecard generation & extraction | Backend/Worker |
| `VITE_DPDP_LOGGING_LEVEL` | Audit compliance granularity (`STRICT`, `VERBOSE`) | Security Audit |
| `VITE_CLIENT_SESSION_TIMEOUT` | Expiry duration for masked client portal sessions | Auth Policy |

*Note: The platform is architected to function entirely standalone out of the box with zero external setup required, using pre-seeded prompt test candidates and client-side extraction.*

---

## 4. Demo Login & Reviewer Walkthrough

The platform includes an interactive **Role Switcher** in the top navigation bar, allowing the reviewer to test each stakeholder perspective instantly:

| Role | Profile / Identity | Key Tasks to Test in Review |
| :--- | :--- | :--- |
| **Recruiter** | `Vikram Mehta` (Senior IT Recruiter, Noida Hub) | 1. Go to **Scorecard**: edit criteria weights and click *Save & Recompute AI*.<br/>2. Go to **Upload CVs**: click *Simulate 10 CVs* or drop a real `.pdf`/`.docx` file; observe duplicate detection.<br/>3. Go to **Ranked Candidates**: notice blind scoring (names hidden from AI). Open Ritika Bansal&apos;s CV, verify quoted evidence, and observe the Recruiter Verification Gate unlocking *Submit to Client*. |
| **Client Manager** | `Sarah Jenkins` (VP Engineering, FinTech Corp) | 1. Open **Client Portal**.<br/>2. Toggle between **Desktop View** and **Mobile Phone View** (tests phone review UX).<br/>3. Check candidate contact masking (`Ritika B.`, masked phone & email).<br/>4. Click *Propose Interview Slot* to schedule a technical round, or *Reject with Reason* to submit structured feedback. |
| **Delivery Head** | `Rajesh Goel` (Delivery Head, Noida) | 1. Open **Calibration**: inspect the weekly sample table comparing AI Rank vs. Recruiter Choice vs. Client Acceptance.<br/>2. Review the 8.4% human override rate, 48h SLA rate (86.2%), and demographic parity verification. |
| **CEO / Leadership** | `Executive Leadership` (Noida HQ) | 1. Open **ROI & Analytics**.<br/>2. Interact with the unit economics sliders (Monthly Requisitions, CVs/req, Recruiter Hourly Cost, Placement Fee).<br/>3. Review the ₹1.57 Crore problem breakdown and the 18-day investment payback calculation. |

### Quick Reset
To restore the platform to its initial clean state with all original prompt candidates (`CND-91022 Ritika Bansal`, `CND-91047 Arjun Rawat`, `CND-91088 Pooja Nair`), click the circular **Reset** button in the top right header at any time.
