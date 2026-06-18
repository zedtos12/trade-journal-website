# Full Redesign Plan — Trade Journal Website

## Task
```
Full UI/UX redesign using:
  - design-taste         (anti-slop, density, constraint)
  - ui-ux-pro-max        (premium glassmorphism, gold accent)
  - popular-web-designs  (Stripe/Linear/Vercel production patterns)
```

## Deliverable
Every page visually consistent: strict spacing, deliberate colors, correct border radii, micro-interactions, no AI-slop, high information density.

---

## Phase 1: Foundation Audit & Fixes
**Goal**: Kill the worst AI-slop patterns first.

| # | Task | Details |
|---|------|---------|
| 1.1 | **Spacing consistency scan** | Enforce 4px/8px/12px/16px/20px/24px/32px system. Flag random `p-7`, `mt-9`, `gap-6` without structural reason. |
| 1.2 | **Border radius audit** | Only use `rounded-3xl` for top-level dashboard cards. Use `rounded-xl` for modals, `rounded-lg` for inputs, `rounded-full` for pills. Remove `rounded-2xl` mixing. |
| 1.3 | **Color audit** | Replace any remaining generic `#3b82f6` blue, `indigo`, or stock Tailwind gradients (`from-violet-...`) with the intentional palette: slate-950/900 backgrounds, gold/d9b45e accents, slate-400 text. |
| 1.4 | **Empty state audit** | Every empty state must share the same component pattern: centered icon, title, subtitle. No ad-hoc empty states. |
| 1.5 | **Typography baseline** | Ensure ALL body text on dark backgrounds has minimum `text-slate-400`. No `text-slate-500` or `text-gray-500` for readable content. |

---

## Phase 2: Typography Hierarchy & Layout System
**Goal**: Establish and enforce a consistent text hierarchy.

| # | Task | Details |
|---|------|---------|
| 2.1 | **Heading hierarchy** | H1 `text-4xl font-semibold tracking-tight` → H2 `text-2xl font-bold` → H3 `text-xl font-semibold` → body `text-sm` → muted `text-xs`. Enforce this everywhere. |
| 2.2 | **Tabular numbers** | All financial data (P/L, % change, prices) must use `tabular-nums` for alignment. |
| 2.3 | **Label/caption style** | Standardise labels as `text-xs font-semibold uppercase tracking-widest text-goldLight`. |
| 2.4 | **Remove centered body** | Dashboards must not center body paragraphs. Left-align all body/description text. Center only hero headlines and empty states. |

---

## Phase 3: Component Consistency Sweep
**Goal**: Every button, card, input, badge reuses the same base class.

| # | Task | Details |
|---|------|---------|
| 3.1 | **Button system** | One `<PremiumButton>` pattern: `rounded-full bg-gold px-6 py-2.5 font-semibold text-slate-950 hover:bg-goldLight transition`. Apply to CTA/primary. Secondary: `rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10`. |
| 3.2 | **Input system** | All text inputs: `rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-gold/50 transition`. |
| 3.3 | **Card system** | One `.premium-card` class: `rounded-3xl border border-white/10 bg-slate-950/40 p-6`. With optional interactive variant: `interactive-card cursor-pointer hover:border-gold/30 transition`. |
| 3.4 | **Badge system** | Standard badge: `inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-widest`. |
| 3.5 | **Modal system** | Standard modal wrapper: `fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/40`. Inner: `rounded-xl border border-white/10 bg-slate-950 p-8`. |

---

## Phase 4: Micro-interactions & Motion
**Goal**: 150-250ms transitions on all interactive elements.

| # | Task | Details |
|---|------|---------|
| 4.1 | **Transition baseline** | Add `transition` class to every button, card-interactive, link. Duration 200ms default. |
| 4.2 | **Hover card lift** | Interactive cards get `hover:translate-y-[-2px] hover:shadow-lg` (or just border glow) on dashboard. |
| 4.3 | **Focus ring** | Every input gets `focus:ring-2 focus:ring-gold/30 focus:ring-offset-2 focus:ring-offset-slate-900`. |
| 4.4 | **Router transitions** | Add CSS `opacity` transition on page mount (existing `animate-fade-up`). Keep existing. Ensure no slow framerate elements. |

---

## Phase 5: Per-Page Application
**Goal**: Apply all rules to each page.

| # | Page | Specific Fixes |
|---|------|----------------|
| 5.1 | **Landing (Home)** | `/` — PRD hero page. Audit spacing, gradient badge, CTA button system. Ensure body text left-aligned. Testimonial/benefits card density. No center alignment on body. |
| 5.2 | **Dashboard** | `/dashboard` — Audit MetricCard spacing. Fix any centering. Ensure tabular P/L. Remove redundant borders. |
| 5.3 | **Trades list** | `/trades` — Card grid: density review. Reduce vertical padding if too spacious. Ensure badge system for result/direction. |
| 5.4 | **Trade detail** | `/trades/[id]` — Detail hero polish: standardise direction icon, tabular P/L, align metadata grid to Phase 3 card system. |
| 5.5 | **Trade forms** | `/trades/new` & `/trades/[id]/edit` — Standardise all inputs to Phase 3 input system. Fix button pair alignment (submit/cancel). Consistent hero header. |
| 5.6 | **Analytics** | `/analytics` — Fix chart area spacing. Ensure insight rail follows system. Pattern lab badge consistency. |
| 5.7 | **Settings** | `/settings` — Input form consistency. Match premium style. |
| 5.8 | **Login/Register** | `/login`, `/register` — Apply card system. Center hero headline, left-align form labels. Consistent auth-form wrapper. |
| 5.9 | **Playbooks** | `/playbooks` — Card polish. Dot color visual tie-in with new badge system. |

## Validation
After each phase:
- `npm run test`
- `npm run build`
- Visual check of affected pages

---

## Status
**Phase 1:** 🔲
**Phase 2:** 🔲
**Phase 3:** 🔲
**Phase 4:** 🔲
**Phase 5:** 🔲
