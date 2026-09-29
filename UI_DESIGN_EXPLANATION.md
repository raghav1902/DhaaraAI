# DHAARAAI (LEGALGPT) — UI/UX ARCHITECTURE & DESIGN SYSTEM SPECIFICATION
====================================================================================================
Comprehensive Architectural Guide on Visual Hierarchy, Design Tokens, Layouts, and Module Workspaces.

---

## 1. DESIGN PHILOSOPHY & BRAND IDENTITY
DhaaraAI (LegalGPT) is an AI-powered Indian Legal Intelligence Platform tailored for both ordinary Indian citizens and legal practitioners/students.

### Core Visual Principles:
- **Legal Authority & Trust:** Deep Royal Navy Blue (`#1d4ed8`) as the foundational brand color, accented by Emerald Green (`#059669`) for verified statutory accuracy.
- **Airy Professionalism:** High contrast slate typography with purposeful whitespace rather than empty stretched layouts.
- **Contextual Accent Discipline:** Colors have explicit semantic meaning:
  - **BLUE:** Primary actions, statutory information, and navigation markers.
  - **GREEN:** Verified statutes, bailable offenses, and safe/low-risk contract clauses.
  - **AMBER / ORANGE:** Financial calculations, stamp duty breakdowns, and cautionary provisions.
  - **RED:** Emergency SOS helplines (112, 1930, 1091) and critical non-bailable offences.
  - **PURPLE:** AI cognitive reasoning and generation features.

---

## 2. DESIGN TOKENS & SYSTEM (`index.css`)

### Color Palette:
| Token Name | Light Theme | Dark Theme | Purpose |
|------------|-------------|------------|---------|
| `--primary` | `#1d4ed8` (Royal Blue) | `#3b82f6` (Electric Blue) | Primary brand buttons, active accents |
| `--primary-hover` | `#1e40af` | `#60a5fa` | Interactive button hovers |
| `--primary-light` | `rgba(29, 78, 216, 0.08)` | `rgba(59, 130, 246, 0.14)` | Active tabs, tag backgrounds |
| `--bg-color` | `#f8fafc` (Slate 50) | `#0b0f19` (Obsidian Charcoal) | Page background |
| `--sidebar-bg` | `#ffffff` | `#111827` (Charcoal Slate) | Sidebar drawer surface |
| `--card-bg` | `#ffffff` | `#111827` | Content card panels |
| `--card-border` | `#e2e8f0` | `#1f2937` | Subtle card borders |
| `--text-main` | `#0f172a` (Slate 900) | `#f8fafc` | Primary headlines and high-contrast text |
| `--text-muted` | `#64748b` | `#94a3b8` | Supporting metadata |
| `--accent` | `#059669` (Emerald) | `#10b981` | Verification markers, success states |
| `--danger` | `#dc2626` (Red) | `#ef4444` | Emergency dials, critical alerts |

### Typography & Spacing:
- **Font Stack:** `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **Body Line Height:** `1.65` for optimal statutory reading and comprehension.
- **Card Radius:** Standard `16px` (`--radius-lg`) with soft elevated drop shadows.
- **Button System:**
  - `.btn-primary`: Royal blue with subtle glow (`--primary-glow`), 10px rounded corners.
  - `.btn-secondary`: Crisp bordered surface with hover tint.
  - `.btn-ghost`: Soft tinted background with high accessibility contrast.
  - `.btn-danger`: Vivid red reserved exclusively for emergency actions and sign-out.

---

## 3. GLOBAL SHELL & APPLICATION LAYOUT (`App.jsx`)

The desktop experience features a clean, responsive 2-column SaaS shell:

```
+-----------------------------------------------------------------------------------+
|  SIDEBAR (255px)   |  TOP STICKY HEADER                                            |
|  - Brand Logo      |  [Module Badge]  [Global Search (Ctrl+K)]  [Theme] [Lang] [User]|
|  - "LegalGPT"      |---------------------------------------------------------------|
|  - 10 Modules Nav  |  WORKSPACE AREA (Max 1120px Balanced Width)                   |
|    * Active Glow   |                                                               |
|    * Left Bar      |  Dynamic Module Views:                                        |
|  - PWA Action Dock |  1. Ask AI (LegalChat)          6. Legal Library (Bare Acts)  |
|                    |  2. Legal Drafting Studio       7. Encrypted Vault            |
|                    |  3. Contract Risk Audit         8. Fee Calculator             |
|                    |  4. Citizen Rights & SOS        9. Cyber Fraud Scanner        |
|                    |  5. BNS <-> IPC Law Converter  10. Account Settings           |
+--------------------+---------------------------------------------------------------+
```

### Top Sticky Header Highlights:
1. **Module Breadcrumb:** Active module name with live green status indicator (`BNS 2023 / BNSS Verified`).
2. **Global Search Input with `Ctrl + K` Support:**
   - Universal search input accessible instantly from anywhere via `Ctrl + K`.
   - Submitting a query dynamically routes to LegalChat with verified answer synthesis.
3. **Control Dock:**
   - One-tap Sun/Moon Theme Toggle.
   - Dual-language selector (`English` / `हिंदी`).
   - Profile avatar with quick popover menu.

---

## 4. MODULE-BY-MODULE UI/UX BREAKDOWN

### 1. Ask AI (`LegalChat.jsx`):
- **Header:** BNS 2023 verification badge, reset conversation action.
- **Quick Question Chips:** Curated prompts (e.g., FIR refusal, tenant security deposit, cheque bounce).
- **Message Stream:**
  - User bubbles: Deep royal blue right-aligned.
  - AI responses: Glass panel left-aligned with Text-to-Speech audio reader, Markdown renderer for tables, and IndiaCode verified source citations.
- **Composer Dock:** Integrated speech-to-text microphone button with audio recording animation.

### 2. Legal Drafting Studio (`LegalDrafter.jsx`):
- **4-Step Visual Stepper:**
  - Step 1: Document & Type (FIR vs Legal Notice) + Crime Category Grid.
  - Step 2: Parties Details (Complainant & Accused with unknown accused toggle).
  - Step 3: Incident Details, Date/Location, Evidence Preset Checkboxes.
  - Step 4: Review, Live Legal Draft Generation, and Print/PDF/Vault actions.
- **Connected Stepper Bar:** Numbered circular nodes with checkmarks and primary accent progress tracking.

### 3. Contract Audit (`DocumentAnalyzer.jsx`):
- **Dropzone:** Dotted border upload zone supporting `.pdf` and `.txt` files with text extraction.
- **Quick Presets:** Instant loading for Residential Rent Agreement, Employment Bond, and Freelance Contract.
- **Analysis View:**
  - Visual Risk Scorecard: Percentage meter and color-coded risk badge (Low, Medium, High, Critical).
  - Categorized Accordion Cards: Flagged problematic clauses with side-by-side statutory reasons and balanced alternatives.

### 4. Citizen Rights & Emergency SOS (`CitizenRights.jsx`):
- **Helpline Card Grid:** Direct phone dials for 112 (National Emergency), 1930 (Cyber Crime), 1091 (Women Safety), and 15100 (Free Legal Aid) with one-click "Dial Now" and "Copy" actions.
- **Instant Decision Wizard:** Interactive cards for real-time dilemmas:
  - *Detained by Police?* (Section 35(3) BNSS guidance).
  - *Online Fraud / UPI Debit?* (Golden hour actions).
  - *Stopped by Traffic Cop?* (DigiLocker & compounding rules).
  - *Landlord Eviction?* (Civil protection).

### 5. BNS ↔ IPC Concordance Bridge (`BnsConverter.jsx`):
- **Split-Pane Comparison Layout:**
  - Active New Law (Bharatiya Nyaya Sanhita 2023) highlighted in emerald.
  - Legacy Law (Indian Penal Code 1860) with statutory delta.
  - Scan-friendly badges: Cognizable vs Non-Cognizable, Bailable vs Non-Bailable, Trial Court, and Punishment breakdown.
  - Direct "Consult AI on this Section" CTA.

### 6. Legal Library & Bare Acts (`LegalLibrary.jsx`):
- Category filter tags (Criminal, Civil, Corporate, Constitutional, Cyber).
- Instant live search by section number or keyword with query clear button.
- **Refined Empty State:** Illustrated state with book icon and structured search suggestions when no items match.

### 7. Encrypted Legal Vault (`LegalVault.jsx`):
- **Secure PIN Lock Screen:** Centered security card with dark-accented lock visual, 4-digit PIN input, and local-storage encryption badge.
- **Decrypted Locker Grid:** Categorized draft cards with date stamps, word count, download, copy, and secure delete.

### 8. Court Fee & Stamp Duty Calculator (`FeeCalculator.jsx`):
- Multi-category navigation: Property Registration, Civil Suit Ad-Valorem, Consumer Forum, and Traffic Violations.
- State-specific calculation matrices (Delhi, Maharashtra, UP, Karnataka) with transparent fee breakdown tables.

### 9. Cyber Fraud Scanner (`CyberChecker.jsx`):
- Security scanner interface with live breach intelligence.
- Zero-retention privacy assurance indicator.
- Actionable post-scan checklist with direct redirection to cybercrime.gov.in.

### 10. Settings & Preferences (`Settings.jsx`):
- Clean row-based settings architecture.
- Language selector, Theme preferences, Vault PIN reset, and profile management.

---

## 5. RESPONSIVE DESIGN & ACCESSIBILITY
- **Desktop (>868px):** Fixed compact sidebar (255px), centered main viewport (max-width 1120px) preventing horizontal overflow.
- **Mobile & Tablet (<=868px):** Fluid drawer menu with blurred backdrop overlay, minimum 44px tap targets, full-width fluid forms.
- **Print Mode:** Pure white background, zero sidebar/top-bar print leakage, formatted for A4 court filing standards.
