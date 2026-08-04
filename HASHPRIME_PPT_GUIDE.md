# 🏢 HashPrime — Complete Company Profile PPT Guide
> **AI Generation Ruleset + Slide-by-Slide Content + Brand Specifications**  
> Version 1.0 · July 2026 · Confidential

---

## 📋 Table of Contents

1. [Brand Identity System](#1-brand-identity-system)
2. [AI Generation Rules](#2-ai-generation-rules)
3. [Animation Master Spec](#3-animation-master-spec)
4. [Slide-by-Slide Content (13 Slides)](#4-slide-by-slide-content)
5. [Typography Rules](#5-typography-rules)
6. [Layout Principles](#6-layout-principles)
7. [Prompt Templates for AI Tools](#7-prompt-templates-for-ai-tools)

---

## 1. Brand Identity System

### 🎨 Official Color Palette

| Role | Name | Hex | Usage |
|---|---|---|---|
| **Primary Gold** | Hash Gold | `#D4AF35` | CTAs, headings, icons, accents |
| **Light Gold** | Parchment | `#F5E0A3` | Gradients, hover states, highlights |
| **Deep Gold** | Antique Gold | `#A37F1C` | Shadows, depth, dark gradient end |
| **Background** | Obsidian | `#0A0A0A` | Primary slide background |
| **Surface** | Carbon | `#121212` | Cards, containers, panels |
| **Surface Alt** | Void | `#050505` | Deep background, section dividers |
| **Navy Accent** | Midnight Navy | `#0B1120` | Alternative dark backdrop |
| **Body Text** | Glacier White | `#FFFFFF` | Main text on dark backgrounds |
| **Muted Text** | Slate | `#94A3B8` | Subheadings, descriptions, captions |
| **Dim Text** | Ash | `#64748B` | Footnotes, secondary info |
| **Neon Accent** | Electric Green | `#39FF14` | Badges, live indicators, alerts |

### 🖋️ Typography Stack

| Role | Font | Weight | Style |
|---|---|---|---|
| **Display / Hero Headings** | Space Grotesk | Black (900) | Tight tracking, all-caps optional |
| **Body / Subheadings** | DM Sans | Regular (400) – Bold (700) | Clean, humanist sans |
| **Data / Numbers** | Space Grotesk | Black (900) | Tabular nums, monospace feel |
| **Labels / Tags** | DM Sans | ExtraBold (800) | Uppercase, wide letter-spacing |

### 📐 Slide Dimensions

- **Format:** Widescreen 16:9
- **Resolution:** 1920 × 1080 px (standard) / 3840 × 2160 px (4K)
- **Safe Zone:** 120px margin all sides
- **Grid:** 12-column with 24px gutters

### ✨ Glassmorphism Card Spec

```
Background:  rgba(18, 18, 18, 0.80)
Backdrop:    blur(24px)
Border:      1px solid rgba(255, 255, 255, 0.08)
Border-Gold: 1px solid rgba(212, 175, 53, 0.30)
Shadow:      0 20px 60px rgba(0, 0, 0, 0.60)
Border-Radius: 24px – 48px (slides use 32px)
```

### 🌟 Gold Gradient Presets

```
Gold Shimmer:   linear-gradient(120deg, #D4AF35 0%, #D4AF35 35%, #FFF 50%, #D4AF35 65%, #D4AF35 100%)
Gold-to-Dark:   linear-gradient(135deg, #F5E0A3 0%, #D4AF35 50%, #A37F1C 100%)
Gold Radial:    radial-gradient(circle, rgba(212,175,53,0.40) 0%, rgba(212,175,53,0) 70%)
Subtle Glow:    radial-gradient(circle, rgba(212,175,53,0.06) 0%, transparent 70%)
```

---

## 2. AI Generation Rules

> These rules apply when using **any AI tool** (ChatGPT, Gemini, Claude, Gamma.app, Beautiful.ai, Tome, Canva AI) to generate or enhance this presentation.

### 🤖 RULE SET A — Visual Identity (Non-Negotiable)

```yaml
RULE A1 - BACKGROUND:
  Always use: #0A0A0A (Obsidian) as primary background
  Never use: white, light grey, or any non-dark background
  Accent orbs: rgba(212,175,53,0.03-0.06) blurred radial gradients

RULE A2 - ACCENT COLOR:
  Primary accent must ALWAYS be: #D4AF35 (Hash Gold)
  Secondary accent: #F5E0A3 (Parchment) for gradient highlights only
  Never substitute gold with yellow (#FFD700) or orange

RULE A3 - TEXT CONTRAST:
  Primary text: #FFFFFF on dark backgrounds
  Secondary text: #94A3B8 (Slate)
  Gold text: #D4AF35 — ONLY for headings, key stats, section labels
  Never use dark text on dark background

RULE A4 - CARDS AND PANELS:
  Background: rgba(18,18,18,0.80) with backdrop-blur
  Border: 1px solid rgba(255,255,255,0.08) default
  Hover/Active border: rgba(212,175,53,0.30)
  Corner radius: 24px minimum

RULE A5 - ICONS:
  Style: Outline/Stroke only (strokeWidth: 1.5)
  Color: #D4AF35 on dark containers
  Container: 64x64px, rounded-16px, dark background, gold border 20% opacity
```

### 🤖 RULE SET B — Content Rules

```yaml
RULE B1 - SLIDE DENSITY:
  Maximum 5 bullet points per slide
  Maximum 2 columns per slide
  Each bullet: max 12 words
  Hero statement: max 8 words, font-weight 900

RULE B2 - STATISTICS FORMAT:
  Always pair: [Number] + [Label] + [Descriptor]
  Example: "500+" / "Projects Completed" / "Across India"
  Font: Space Grotesk Black for numbers
  Color: White for number, Gold for label

RULE B3 - SECTION LABELS (EYEBROW TEXT):
  Format: Pill badge with gold dot + uppercase text
  Style: border: 1px solid rgba(212,175,53,0.20), background: rgba(212,175,53,0.05)
  Font: 10-11px, tracking: 0.3em, color: #D4AF35

RULE B4 - CTA BUTTONS:
  Primary: bg #D4AF35, text #0A0A0A, font-weight 900, rounded-full
  Secondary: bg transparent, border gold/50, text white
  Arrow: right arrow or up-right arrow icon, translate on hover

RULE B5 - IMAGERY:
  Style: Abstract geometric SVGs, orbit rings, polygon grids
  Avoid: Photography of people (unless using approved team photos from /public/)
  Colors: Gold, white, slate on dark backgrounds
  Shapes: Hexagons, orbits, blockchain grids, waveforms
```

### 🤖 RULE SET C — Slide Structure Rules

```yaml
RULE C1 - SLIDE TITLE:
  Position: Top-left or centered
  Font: Space Grotesk Black, 48-72px
  Color: White with gold keyword highlight

RULE C2 - SLIDE FOOTER:
  Always include: HashPrime logo (text only) | Slide number | Section name
  Color: rgba(255,255,255,0.30)
  Font: DM Sans 12px

RULE C3 - SLIDE NUMBERS:
  Format: 01 / 13
  Position: Bottom-right
  Color: #D4AF35

RULE C4 - SECTION DIVIDER SLIDES:
  Full-bleed gold gradient text
  Large display number background (opacity: 0.03)
  Centered layout with minimal content

RULE C5 - DATA SLIDES:
  Use card-grid layout (2 or 3 columns)
  Each card: glassmorphism spec
  Stat highlighted in gold, label in slate
```

### 🤖 RULE SET D — What AI Must NEVER Do

```yaml
NEVER:
  - Use white or light backgrounds
  - Use standard blue (#0066FF) or red (#FF0000) accents
  - Use Comic Sans, Arial, Times New Roman
  - Place text over unreadable backgrounds without overlay
  - Exceed 7 elements per slide (visual clutter rule)
  - Use stock photography (use SVG illustrations instead)
  - Use bullet-list-only slides with no visual element
  - Place more than 3 statistics on a single card
  - Use light/pastel color schemes
  - Deviate from the gold accent (#D4AF35) rule
```

---

## 3. Animation Master Spec

> Apply these animation specs in PowerPoint, Google Slides, Keynote, or AI tools like Gamma.app / Beautiful.ai.

### ⚡ Animation Timing Tokens

| Token | Duration | Easing | Usage |
|---|---|---|---|
| `enter-fast` | 300ms | Ease Out | Icons, badges, small elements |
| `enter-default` | 600ms | Power3 Out | Cards, body text |
| `enter-slow` | 900ms | Power4 Out | Hero headings, section titles |
| `enter-dramatic` | 1200ms | Back Out 1.2 | Feature cards, key stats |
| `stagger-tight` | 100ms delay | — | List items |
| `stagger-default` | 150ms delay | — | Cards in a grid |
| `stagger-wide` | 200ms delay | — | Sections entering |

### 🎬 Slide Transition Rules

```
DEFAULT TRANSITION:   Fade (300ms)
SECTION TRANSITIONS:  Push Left to Right (500ms, ease-in-out)
DATA SLIDES:          Zoom Fade (400ms)
IMPACT SLIDES:        None (instant cut for drama)
TITLE SLIDE:          Dissolve with blur (800ms)
```

### 🎞️ Element Animation Sequences

#### Title Slide
```
1. Badge (eyebrow label)  — FadeIn + SlideDown   [0ms,   600ms]
2. Main Headline Line 1   — FadeIn + SlideUp     [200ms, 900ms]
3. Main Headline Line 2   — FadeIn + SlideUp     [400ms, 900ms]
4. Subheadline / Desc     — FadeIn + SlideUp     [600ms, 700ms]
5. CTA Buttons            — FadeIn + SlideUp     [750ms, 700ms]
6. Visual Graphic (right) — FadeIn + SlideRight  [300ms, 1000ms]
7. Floating Cards         — FadeIn + Float       [900ms, 1200ms]
```

#### Content Slides (Standard)
```
1. Eyebrow Badge          — FadeIn + SlideDown   [0ms,   400ms]
2. Section Title          — FadeIn + SlideUp     [150ms, 700ms]
3. Subtitle / Desc        — FadeIn              [400ms, 500ms]
4. Card / Content Area    — FadeIn + ScaleIn     [600ms, 800ms]
   If multiple cards: stagger by 150ms each
5. Footer Elements        — FadeIn              [0ms,   300ms] on load
```

#### Stat / Impact Slides
```
1. Number Counter         — Count Up Animation  [0ms,   1200ms]
2. Label                  — FadeIn + SlideUp    [300ms, 600ms]
3. Descriptor             — FadeIn              [600ms, 400ms]
4. Divider Line           — Expand Width        [400ms, 800ms]
```

#### Continuous (Loop) Animations
```
Gold Orb / Glow Blobs:    Pulse scale 1.0 to 1.05  [3000ms, ease-in-out, loop]
Badge Dot Indicator:      Ping/Pulse                [1500ms, ease, loop]
Orbit Rings (SVG):        Rotate 0 to 360deg        [20-35s, linear, loop]
Floating Cards:           TranslateY -10 to 0px     [3000ms, sine-inOut, yoyo]
Scanline Effect:          TranslateY 0 to 100%      [8000ms, linear, loop]
```

### 🖱️ Hover Micro-Interactions
```
Cards hover:   Border to gold 30% + shadow glow + translateY(-8px)     [500ms]
Buttons hover: Scale 1.05 + glow shadow [30px rgba(212,175,53,0.3)]    [300ms]
Icons hover:   Background to #D4AF35, Icon to #0A0A0A                  [500ms]
Stats hover:   Number to gold, label stays white                        [300ms]
```

---

## 4. Slide-by-Slide Content

---

### SLIDE 01 — Title / Cover

**Layout:** Two-column (7:5 split)  
**Background:** Obsidian #0A0A0A with gold radial glow (top-right) and dotted grid overlay  
**Visual:** Golden Orbit Globe / SVG (right column)

**Content:**
- **Eyebrow Badge:** `● COMPANY PROFILE · 2026`
- **Headline Line 1:** `Intelligent Asset Management`
- **Headline Line 2:** `for the Modern Investor` (smaller, muted white)
- **Description:** Grow your wealth with diversified strategies in global equities, funds, commodities, and fixed-return investment portfolios.
- **CTA 1 (Primary — Gold):** Start Investing ↗
- **CTA 2 (Secondary — Ghost):** ▶ View Plans
- **Floating Card 1:** `+500%` / Live Yield / Highest Returns
- **Floating Card 2:** `100%` / Trusted Investments / Secured & Verified
- **Visual Right:** Golden orbit SVG — spinning rings, polygon core, pulsing center dot
- **Footer:** HashPrime Asset Management · Confidential · 01 / 13

---

### SLIDE 02 — About HashPrime

**Layout:** Two-column (6:6), left = content, right = stat cards  
**Background:** Obsidian + bg.png overlay (35% opacity, screen blend mode)

**Content:**
- **Eyebrow:** `● ABOUT US`
- **Headline:** `About` / `HashPrime` (HashPrime in gold)
- **Body:** Hashprime is a multi-service engineering and infrastructure company dedicated to delivering reliable, innovative, and high-quality solutions across the telecom, electrical, construction, real estate, and technology sectors.
- **Our Mission:** To deliver dependable engineering, infrastructure, and technology solutions that create lasting value through quality workmanship, innovation, and exceptional service.
- **Our Vision:** To be recognized as one of India's most trusted engineering and technology companies, driving sustainable growth through excellence, reliability, and continuous innovation.
- **Feature Pills (3 items):**
  - 🔗 Telecom & Electrical Engineering
  - 🛡 Infrastructure & Construction Solutions
  - 💻 Cutting-edge Technology Integration
- **Stats (right column — glassmorphism cards):**
  - `7+` / Years of Experience / Delivering reliable solutions
  - `500+` / Projects Completed / Across India
  - `50+` / Corporate Clients / Trusted by industry leaders

---

### SLIDE 03 — Mission, Vision & Values

**Layout:** Three-column card grid (equal width)  
**Background:** Obsidian + subtle gold radial center glow

**Content:**
- **Eyebrow:** `● OUR PURPOSE`
- **Headline:** `What Drives HashPrime`

**Card 1 — Mission (🎯):**
> To deliver dependable engineering, infrastructure, and technology solutions that create lasting value for our clients through quality workmanship, innovation, and exceptional customer service.

**Card 2 — Vision (👁):**
> To be recognized as one of India's most trusted engineering and technology companies, driving sustainable growth through excellence, reliability, and continuous innovation.

**Card 3 — Values (💎):**
- ⭐ Excellence — Uncompromising quality in everything we do
- 🤝 Integrity — Transparent and ethical business practices
- 💡 Innovation — Continuous technology-driven improvement
- 🔒 Reliability — Trusted by clients and partners nationwide
- 👤 Client First — Your success is the measure of our success

---

### SLIDE 04 — Strategic Business Verticals

**Layout:** Full-width showcase list rows  
**Background:** Obsidian + faint right-side glow

**Content:**
- **Eyebrow:** `● STRATEGIC VERTICALS`
- **Headline:** `WHERE YOUR` / `MONEY WORKS` (WORKS in gold)
- **Subtext:** Five specialized investment verticals engineered to capture alpha across global markets.

| # | Icon | Vertical | Tag | Description |
|---|---|---|---|---|
| 01 | 📈 | IPO | Equity | Pre-IPO shares and institutional placements — capture early-stage valuation gains |
| 02 | 💵 | Currency & Commodity | Forex | Gold, silver, crude oil and forex pairs — hedge against inflation with global assets |
| 03 | 📡 | Telecom Industry | Infrastructure | Telecom tower operations, fiber networks, and cellular infrastructure assets |
| 04 | 🏢 | Real Estate | Property | Premium commercial developments and residential rental yielding holdings |
| 05 | 🔧 | Construction | Civil | Civil development projects, smart cities, and transport utility construction |
| 06 | 💼 | Various Sectors | Compounding | Multi-sector diversified structured investment schemes and passive plans |

**Animation:** Each row slides in from left, staggered 100ms apart

---

### SLIDE 05 — Investment Schemes & Plans

**Layout:** 2×2 card grid  
**Background:** Obsidian + gold radial glow (top-left + bottom-right)

**Content:**
- **Eyebrow:** `● STRUCTURED YIELD`
- **Headline:** `SMART INVESTMENT` / `PLANS FOR YOUR WEALTH` (WEALTH in gold)

| Card | Icon | Title | Description | Style |
|---|---|---|---|---|
| 1 | ⏱ | Short-Term Income | Focused short-term plan offering time-bound returns with lower risk strategies | Standard |
| 2 | ⚖ | Balanced Growth | Moderate plan aimed at consistent, balanced returns through diversified portfolios | Standard |
| 3 | 📈 | Long-Term Wealth | Growth-oriented plan for multi-year horizons emphasizing disciplined compounding | **Featured (gold border)** |
| 4 | 🌍 | Global Exposure | Diversified plan providing access to international markets and global currencies | Standard |

**Disclaimer (bottom, italic, muted):**
> Note: Plan terms, durations, and fixed returns are subject to conditions. Investors should read plan documentation carefully before investing.

---

### SLIDE 06 — Core Platform Features

**Layout:** Bento grid (2 large + 1 small + 1 wide)  
**Background:** Obsidian + noise texture overlay (2% opacity)

**Content:**
- **Eyebrow:** `● CORE INFRASTRUCTURE`
- **Headline:** `Engineered for` `Excellence` (Excellence in gold)
- **Subtext:** Experience a feature-rich, ultra-secure platform designed for the ultimate investment advantage.

| Feature | Icon | Size | Description |
|---|---|---|---|
| Bank-Grade Security | 🛡 | Large (2-col) | Industry-leading encryption, advanced 2FA, and robust cold-storage solutions. Sleep soundly. |
| Zero-Friction Investing | ⚡ | Large (2-col) | Hyper-competitive fee structure. Invest more, pay less, keep what you earn. |
| 24/7 Premium Support | 🎧 | Small (1-col) | Expert assistance at your fingertips, anytime you need it. |
| Unlimited Asset Access | 🪙 | Wide (3-col) | Hundreds of active pairs — from Bitcoin to the newest altcoins. BTC · ETH · USDT · SOL · XRP · ADA |

---

### SLIDE 07 — How to Get Started

**Layout:** Three-step horizontal flow with connecting progress line  
**Background:** Obsidian + left gold glow orb

**Content:**
- **Eyebrow:** `● ONBOARDING`
- **Headline:** `Start Investing in Minutes`
- **Subtext:** Your journey to financial freedom begins with three simple steps.

| Step | Icon | Title | Description |
|---|---|---|---|
| 01 | 👤 | Create an Account | Sign up in seconds using your email or Google account. Verify your identity instantly to unlock all features. |
| 02 | 💼 | Fund Your Wallet | Deposit funds easily via bank transfer, credit card, or P2P. Your funds are protected by industry-leading security. |
| 03 | 📊 | Start Investing | Choose a scheme, select your amount, and confirm. Watch your wealth grow in USDT. |

**Progress Line Animation:**
- Gold gradient line draws from left to right across all 3 step icons (scroll-triggered)
- Step numbers illuminate in gold sequentially
- Icon containers get gold glow shadow one-by-one

---

### SLIDE 08 — Market Coverage & Live Data

**Layout:** Split — left stats/text, right crypto ticker strip  
**Background:** Obsidian + ticker marquee top strip

**Content:**
- **Eyebrow:** `● GLOBAL MARKETS`
- **Ticker Bar (top):** Scrolling — `BTC $107,432  ↑  ETH $3,521  ↑  USDT $1.00  SOL $214.60  XRP $0.62  ADA $0.45`
- **Headline:** `Global Exposure,` / `Local Expertise`

| Stat | Icon | Title | Context |
|---|---|---|---|
| 6+ | 🌍 | Countries | Global reach across markets |
| 200+ | 📊 | Trading Pairs | Active instruments available |
| 24/7 | 💹 | Live Markets | Real-time monitoring always on |

- **Supported Assets:** BTC · ETH · USDT · SOL · XRP · ADA · and 100+ more
- **Bottom Line:** Real-time data. Zero latency. Institutional-grade execution.

---

### SLIDE 09 — Security & Trust

**Layout:** Left content checklist + right radar animation visual  
**Background:** Obsidian + grid dot pattern

**Content:**
- **Eyebrow:** `● TRUST & SECURITY`
- **Headline:** `Your Assets.` / `Our Priority.`

**Security Checklist (6 items):**
| # | Feature |
|---|---|
| ✅ | 256-bit SSL Encryption across all connections |
| ✅ | Two-Factor Authentication (2FA) mandatory |
| ✅ | Cold Storage Vaults for digital asset protection |
| ✅ | Real-time threat monitoring & anomaly detection |
| ✅ | Multi-signature wallet protection |
| ✅ | Regulatory compliant operations |

**Highlight Stat:** `100%` / Secured & Verified / Trusted by 10,000+ investors

**Visual (right):** Animated gold radar — concentric pulsing rings + rotating gold sweep line + central dot

---

### SLIDE 10 — Leadership Team

**Layout:** 2-row × 3-column circular photo grid  
**Background:** Obsidian + subtle texture

**Content:**
- **Eyebrow:** `● LEADERSHIP`
- **Headline:** `The Minds Behind` / `HashPrime` (HashPrime in gold)
- **Tagline:** A unified leadership team with 7+ years of combined expertise in engineering, finance, and technology.

| Name | Role | Photo File |
|---|---|---|
| Mr. Vijayabharathi Veerasamy | Founder & Managing Director | `Mr. VIJAYABHARATHI VEERASAMY.jpeg` |
| Mr. Naveenkumar Mayavan | Co-Founder & CEO | `NAVEENKUMAR MAYAVAN.jpeg` |
| Mrs. Hemalatha Kannan | HR Manager | `HEMALATHA KANNAN.png` |
| Mr. Kannan Thangavel | Accounts Manager | `Mr.KANNAN THANGAVEL.jpeg` |
| Mr. Murugaraj Elangovan | Mayiladuthurai District Zonal Manager | `MURUGARAJ ELANGOVAN.jpeg` |
| Mrs. Priyadharshini Ragupathi | Salem District Zonal Manager | `PRIYADHARSHINI RAGUPATHI.png` |
| Mrs. Sudha Sasikumar | Thiruvarur District Zonal Manager | `SUDHA SASIKUMAR.png` |
| Mr. S. Alljeen Jothimani, B.A., B.L. | Advocate & Legal Counsel | `S. ALLJEEN JOTHIMANI.jpg` |
| Mr. Manikandaprabu R | Tourism Operations Head | `MANIKANDAPRABU R.jpeg` |
| Mr. Naresh D | Mechanical & Machinery Operations Head | `NARESH D.jpeg` |
| Mr. Sathish S | AC Sales & Service Operations Head | `SATHISH S.jpg` |

**Photo Card Style:**
- Circular crop, border: 2px solid rgba(212,175,53,0.50)
- Name: White, Space Grotesk Bold, 16px
- Role: Gold, DM Sans, 12px UPPERCASE
- Hover: Gold border brightens, card lifts

---

### SLIDE 11 — Company Milestones & Growth

**Layout:** Vertical/horizontal animated timeline  
**Background:** Obsidian + left-side gold vertical accent line

**Content:**
- **Eyebrow:** `● OUR JOURNEY`
- **Headline:** `7 Years of` / `Growth & Excellence`

| Year | Icon | Milestone | Description |
|---|---|---|---|
| 2019 | 🏢 | Founded | Hashprime incorporated in Tamil Nadu, India. First telecom and infrastructure projects launched. |
| 2020 | 🏗 | Infrastructure Expansion | Entered construction and real estate sector. Expanded client base across South India. |
| 2021 | 💻 | Technology Integration | Launched digital investment and asset management platform. |
| 2022 | 🏆 | 500+ Projects Milestone | Served 50+ corporate clients across India. Telecom network infrastructure expanded. |
| 2023 | 📈 | Investment Platform | Full multi-sector portfolio management platform goes live. USDT-backed fixed returns. |
| 2026 | 🌟 | National Recognition | 10,000+ active investors. Expanding to global markets and new sectors. |

**Animation:** Gold vertical line draws downward through milestone dots, each dot lights up gold in sequence

---

### SLIDE 12 — Why Choose HashPrime

**Layout:** 2-row × 3-column icon advantage cards  
**Background:** Obsidian + center gold radial glow

**Content:**
- **Eyebrow:** `● THE HASHPRIME ADVANTAGE`
- **Headline:** `Why Investors Choose Us`

| Row | Icon | Title | Stat | Descriptor |
|---|---|---|---|---|
| 1 | 🏆 | Proven Track Record | 7+ Years | Reliable, consistent delivery across sectors |
| 1 | 🔒 | 100% Asset Security | 100% | Bank-grade encryption & cold storage |
| 1 | 📊 | Maximum Returns | +500% | Highest yield investment schemes available |
| 2 | 🌍 | Global Diversification | 6+ Markets | International asset exposure and coverage |
| 2 | 🎧 | Expert Support | 24/7 | Round-the-clock professional assistance |
| 2 | ⚡ | Real-Time Tracking | Live | Instant portfolio monitoring and analytics |

- **CTA (bottom center):** `Launch Your Portfolio →` (gold button)
- **Subtext:** Global exposure. Local expertise. Start today.

---

### SLIDE 13 — Contact & Closing CTA

**Layout:** Centered, full-impact with contact info grid and QR code  
**Background:** Obsidian + large gold radial glow (bottom center, 4% opacity)

**Content:**
- **Eyebrow:** `● GET IN TOUCH`
- **Headline:** `Contact` / `HashPrime` (HashPrime in gold)
- **Decorative Divider:** ────── Get in touch with us today ──────

| Icon | Label | Detail |
|---|---|---|
| 📍 | Address | No.4/21, Ananthakudi Road, Anna Salai, Mappadukai, Mayiladuthurai, Nagapattinam, Tamil Nadu – 609003 |
| 📞 | Phone | +91 91500 81022 |
| 📧 | Email | support@hashprime.in |
| 📸 | Instagram | @hashprimegroups |
| 🕘 | Working Hours | Mon – Sat: 9:00 AM – 6:00 PM |

- **CTAs:**
  - Primary (gold): `▶ Start Investing Now` → hashprime.in/register
  - Secondary (ghost): `Visit hashprime.in`
- **QR Code:** From `/public/qr.jpeg` — links to hashprime.in
- **Copyright:** © 2026 HashPrime Asset Management. All Rights Reserved.

---

## 5. Typography Rules

### Heading Hierarchy

```
H1 — Hero Title:     Space Grotesk Black (900), 64-96px, line-height 1.0
H2 — Section Title:  Space Grotesk Black (900), 48-72px, line-height 1.1
H3 — Card Title:     Space Grotesk Bold (700), 28-36px, line-height 1.2
H4 — Label:          DM Sans ExtraBold (800), 12-14px, UPPERCASE, tracking 0.3em
H5 — Caption:        DM Sans Medium (500), 11-12px, Slate color (#94A3B8)
Body:                 DM Sans Regular (400), 16-18px, line-height 1.7, Slate color
```

### Gold Text Usage

**USE GOLD (#D4AF35) FOR:**
- Single key word in a multi-word headline (e.g. "for Your **WEALTH**")
- Section eyebrow labels
- Statistic labels / category tags
- Icon elements within dark containers
- CTA underlines and hover states
- Divider accent lines

**DO NOT USE GOLD FOR:**
- Full paragraph body text (illegible at small sizes)
- Background fills
- More than 40% of any single slide

---

## 6. Layout Principles

### Slide Grid System

```
Total Width:    1920px
Columns:        12
Column Width:   128px
Gutter:         24px
Left Margin:    120px
Right Margin:   120px
Top Margin:     80px
Bottom Margin:  60px (footer zone)
```

### Visual Hierarchy Rules

1. **One focal point per slide** — single most important element draws the eye first
2. **60-30-10 Color Rule** — 60% Obsidian background, 30% Slate/White content, 10% Gold accents
3. **Negative space** — minimum 30% of each slide must be empty / breathing room
4. **Z-pattern reading** — content flows top-left → top-right → bottom-left → bottom-right
5. **Card padding** — minimum 40px internal padding for all glass cards

### Background Decoration System

```
Gold Orbs:     Always 2-4 per slide, positioned at off-screen corners
               Opacity: 0.02 to 0.06 maximum
               Blur:    100px to 180px minimum
               Size:    400px to 800px diameter

Dot Grid:      radial-gradient(#D4AF35 1px, transparent 1px)
               Background-size: 40px 40px
               Opacity: 0.03

Noise Texture: /public/noise.png
               Opacity: 0.02
               Blend mode: overlay
```

---

## 7. Prompt Templates for AI Tools

### Gamma.app / Tome / Beautiful.ai Prompt

```
Create a professional company profile presentation for "HashPrime Asset Management" 
with the following strict specifications:

BRAND: Dark luxury fintech aesthetic
- Background: #0A0A0A (near-black obsidian)
- Primary Accent: #D4AF35 (gold)
- Text: White (#FFFFFF) primary, #94A3B8 secondary
- Cards: Glassmorphism (dark semi-transparent + gold border)
- Font: Space Grotesk for headings, DM Sans for body

Create exactly 13 slides:
1. Cover — "Intelligent Asset Management for the Modern Investor"
2. About — Multi-service engineering & infrastructure company, 7+ years, 500+ projects, 50+ clients
3. Mission/Vision/Values — Three gold-bordered glassmorphic cards
4. Business Verticals — IPO, Currency, Telecom, Real Estate, Construction, Various Sectors (6 rows)
5. Investment Plans — Short-Term Income, Balanced Growth, Long-Term Wealth (featured), Global Exposure
6. Platform Features — Security, Zero-Friction, 24/7 Support, Unlimited Assets (bento grid)
7. How to Start — 3 steps: Create Account, Fund Wallet, Start Investing (horizontal flow)
8. Market Coverage — Global markets, crypto ticker, 6+ countries, 200+ pairs
9. Security & Trust — 100% secured, 6 security features, animated radar visual
10. Leadership Team — 6 directors with circular photo cards
11. Company Milestones — Animated timeline from 2019 to 2026
12. Why Choose Us — 6 advantage cards (7+ years, 100% secured, +500% yield, global, 24/7, live)
13. Contact — Address, phone +91 91500 81022, email support@hashprime.in, QR code

STYLE RULES:
- Dark mode ONLY — never use light backgrounds
- Gold (#D4AF35) as the ONLY accent color
- Glassmorphism cards with dark semi-transparent backgrounds
- Abstract SVG geometric visuals (no stock photos for sections)
- Premium, minimal, luxury fintech aesthetic

ANIMATIONS:
- Text: Fade + slide up on entry
- Cards: Scale-in with back-ease
- Stagger: 150ms between cards
- Transitions: Fade 300ms (default)
```

### ChatGPT / Claude Slide Prompt

```
You are a professional PPT content writer for HashPrime, a premium fintech 
and infrastructure company in India.

Company facts:
- Name: HashPrime Asset Management
- Type: Multi-service engineering & infrastructure + investment platform
- Founded: 2019, Tamil Nadu, India
- Stats: 7+ years, 500+ projects, 50+ clients, 10,000+ investors
- Contact: +91 91500 81022 | support@hashprime.in | hashprime.in
- Verticals: IPO, Currency/Commodity, Telecom, Real Estate, Construction, Various Sectors
- Features: Bank-grade security, Zero-friction investing, 24/7 support, Unlimited assets

Write compelling, concise slide content following these rules:
- Maximum 5 bullet points per slide
- Each bullet: maximum 12 words
- Headline: maximum 8 words, impactful, use power words
- Mark the gold-highlighted keyword with **double asterisk**
- Statistics format: [Number] / [Label] / [Brief context]
- Tone: Premium, confident, trustworthy, professional

Generate content for:
Slide [INSERT NUMBER]: [INSERT TOPIC]
```

### Canva AI Magic Design Prompt

```
Design a dark luxury business presentation slide for "HashPrime Asset Management" 
Indian fintech company.

Style requirements:
- Dark background (#0A0A0A obsidian)
- Gold (#D4AF35) accent color ONLY
- White text on dark backgrounds
- Glassmorphic card panels with subtle gold borders
- Modern sans-serif typography (Space Grotesk or Montserrat for headings, DM Sans or Inter for body)
- Minimal, premium fintech aesthetic — no light colors, no pastels, no white backgrounds
- Floating decorative gold glow orbs in corners (very low opacity, high blur)

Slide title: [INSERT TITLE]
Slide content: [INSERT CONTENT]
Visual element: [geometric SVG / orbital rings / blockchain grid / radar animation]
```

### PowerPoint — Manual Animation Guide

```
HOW TO APPLY HASHPRIME ANIMATIONS IN POWERPOINT:

ENTRY ANIMATION (all text elements):
1. Select text element
2. Animations > Appear (or Fade)
3. Effect Options > From Bottom
4. Duration: 0.80 seconds
5. Start: After Previous
6. Delay: increase by 0.15s for each element

CARD ENTRY ANIMATION:
1. Select card/shape
2. Animations > Zoom (or Fade)
3. Duration: 0.80 seconds
4. Start: After Previous
5. Delay: increase by 0.15s per card

SLIDE TRANSITIONS:
- Default: Fade, 0.30 seconds
- Section break: Push (Left), 0.50 seconds

GOLD GLOW EFFECT (on shapes):
1. Right-click shape > Format Shape
2. Shadow: Outer, Gold (#D4AF35), Blur: 30pt, Transparency: 60%
3. Glow: Gold (#D4AF35), Size: 15pt, Transparency: 50%
```

---

## 📎 Quick Reference Card

| Property | Value |
|---|---|
| **Primary BG** | `#0A0A0A` |
| **Surface** | `#121212` |
| **Gold Accent** | `#D4AF35` |
| **Light Gold** | `#F5E0A3` |
| **Deep Gold** | `#A37F1C` |
| **White Text** | `#FFFFFF` |
| **Muted Text** | `#94A3B8` |
| **Heading Font** | Space Grotesk Black (900) |
| **Body Font** | DM Sans Regular (400) |
| **Card BG** | `rgba(18,18,18,0.80)` |
| **Card Border** | `rgba(255,255,255,0.08)` |
| **Gold Border** | `rgba(212,175,53,0.30)` |
| **Card Radius** | 32px |
| **Heading entry** | FadeIn + SlideUp, 900ms |
| **Card entry** | FadeIn + ScaleIn, 800ms |
| **Stagger** | 150ms between elements |
| **Transition** | Fade 300ms |
| **Phone** | +91 91500 81022 |
| **Email** | support@hashprime.in |
| **Instagram** | @hashprimegroups |
| **Website** | hashprime.in |
| **Address** | No.4/21, Ananthakudi Road, Anna Salai, Mappadukai, Mayiladuthurai, Nagapattinam, TN – 609003 |

---

*© 2026 HashPrime Asset Management Pvt. Ltd. · All Rights Reserved.*  
*This document is confidential and intended for internal use and authorized design partners only.*
