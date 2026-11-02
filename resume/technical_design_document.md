# Technical Design Document (TDD)
## Intelligent Staffing & Shortlist OS for Company A, Noida

**GitHub Repository:** [https://github.com/rushitalkar/resume](https://github.com/rushitalkar/resume)  
**Live Application Demo:** [http://localhost:5173/](http://localhost:5173/)  
**Document Version:** 1.0 (Production Release)  
**Author:** Software Engineering Lead  
**Date:** November 2024 (Company A Noida Requisition Automation Milestone)

---

## 1. Executive Problem & Financial Context

Company A is a Noida-based recruitment and staffing agency with 120 staff (including 70 full-time recruiters) generating ₹40–50 Crore in annual revenue. The business serves contract and permanent staffing across three verticals: IT Services, Banking & BFSI Back-Office, and Retail.

### The Unit Economics Problem (From Problem Statement)
1. **Screening Overhead**: 300 open requisitions/month × 120 CVs each = 36,000 CVs/month. At 3 minutes spent reading each CV, recruiters spend:
   $$\text{Monthly Screening Time} = 300 \times 120 \times 3 = 108{,}000\text{ min} = 1{,}800\text{ hours/month} = 21{,}600\text{ hours/year}$$
   At a recruiter cost of ₹350/hour, manual CV reading drains:
   $$\text{Annual Labor Cost} = 21{,}600 \times ₹350 = \mathbf{₹75.6\text{ Lakh / Year}}$$
2. **Speed-to-Shortlist Revenue Leakage**: Delivering shortlists takes 5 days over email and Excel. Approximately 5% of open requisitions (180 out of 3,600/year) are lost to faster competing agencies at an average placement fee of ₹45,000:
   $$\text{Lost Fee Revenue} = 180 \times ₹45{,}000 = \mathbf{₹81.0\text{ Lakh / Year}}$$
3. **Total Inefficiency Cost**: **₹1.57 Crore / Year** ($₹75.6\text{L} + ₹81.0\text{L}$).
4. **Project Constraints & Goals**: ₹7 Lakh budget, 6-week delivery milestone. Targets:
   - Screening time per requisition down **60%** (1,800 hrs $\rightarrow$ $\le$ 720 hrs).
   - Shortlist turnaround within **48 hours** for $\ge$ **80%** of requisitions.
   - Client candidate acceptance up from **45% to 60%**.

---

## 2. System Architecture & Technical Choices

### 2.1 Architecture Diagram
```
┌────────────────────────────────────────────────────────────────────────┐
│                        Company A Staffing OS                           │
│  (React 19 + TypeScript + Tailwind CSS Minimalist Architecture)        │
├────────────────────────────────────────────────────────────────────────┤
│ Presentation Layer (Modular Component Views)                           │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────────────┐ │
│ │ JD Scorecard │ │ Bulk Ingest  │ │ Ranked Feed  │ │ Client Portal  │ │
│ │ & Extraction │ │ & Dup Engine │ │ & Evidence   │ │ (Mobile-First) │ │
│ └──────┬───────┘ └──────┬───────┘ └──────┬───────┘ └────────┬───────┘ │
│        │                │                │                  │         │
│ ┌──────┴───────┐ ┌──────┴───────┐ ┌──────┴───────┐ ┌────────┴───────┐ │
│ │ Pipeline     │ │ DPDP 2023    │ │ Calibration  │ │ CEO Financial  │ │
│ │ Kanban Board │ │ & Audit Log  │ │ (Sample N=50)│ │ ROI Calculator │ │
│ └──────────────┘ └──────────────┘ └──────────────┘ └────────────────┘ │
├────────────────────────────────────────────────────────────────────────┤
│ Application & Processing Layer                                         │
│ • Deterministic & Heuristic AI Evaluation Engine (Weighted Scoring)    │
│ • Blind Scoring Filter (Demographic Redaction Protocol)                │
│ • In-Browser Document Parsers (Mammoth DOCX, PDF Text Streams)         │
│ • Duplicate Detection Hasher (Phone / Email / Name Vector)             │
│ • Human-in-the-Loop Recruiter Verification Gate                        │
├────────────────────────────────────────────────────────────────────────┤
│ Data & Persistence Layer                                               │
│ • LocalStorage Reactive Cache & State Management                       │
│ • Pre-seeded Master Requisitions & Verified Prompt Candidate Profiles  │
│ • Immutable Audit Trail Storage & Erasure Log                          │
└────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Why This Architecture Was Chosen
- **Client-Side Reactive SPA (Vite + React 19 + TypeScript)**: Recruiters review dozens of profiles per hour. Zero-latency filtering, instantaneous score recomputation upon criteria weighting adjustments, and offline-resilient local caching provide a dramatically snappier experience than round-trip server-rendered pages.
- **Client-Side In-Browser Document Ingestion (Mammoth + PDF Reader)**: Eliminates file size bottlenecks and preserves candidate privacy by extracting `.docx` and `.pdf` files client-side without streaming unparsed personal files to external third-party scraping services.
- **Modular Separation of Domain Entities**: Clear decoupling between `Candidate`, `Scorecard`, `Requisition`, `AuditLog`, and `ClientFeedback` allows independent scaling of features and auditability.
- **Fail-Safe Deterministic Scoring with Quoted Evidence**: Rather than treating AI as an opaque black box that generates hallucinated summaries, the scoring engine operates on explicit scorecard rules, quoting verbatim sentences from candidate resumes to substantiate every awarded point.

---

