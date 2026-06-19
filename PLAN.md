# Trade Journal Website - Development Roadmap
**Last Updated:** June 19, 2026, 5:39 PM WIB

---

## 🔥 TIER 1: High-Impact Features (Must-Have)

### Phase 1: Trading Sessions/Playbooks Implementation ⭐⭐⭐⭐⭐
**Status:** IN PROGRESS
**Priority:** URGENT — UI exists but backend incomplete
**Effort:** Medium-High (~4-6 hours)

#### Phase 1.1: Database & Backend Foundations
- [ ] **Task 1: Database Migration**
  - Add `Playbook` table to `schema.prisma` (verify current state)
  - Ensure `Trade` model links to `Playbook` via `playbookId`
  - Run migration and generate Prisma client
  
- [ ] **Task 2: Playbook API Completion**
  - Verify `GET /api/playbooks` lists user playbooks
  - Verify `POST /api/playbooks` creates new playbooks
  - Verify `PATCH/DELETE /api/playbooks/[id]` for management
  
- [ ] **Task 3: Trade API Integration**
  - Verify `POST /api/trades` and `PATCH /api/trades/[id]` handle `playbookId`
  - Ensure trades are correctly scoped to playbooks in queries

#### Phase 1.2: User Interface - Management
- [ ] **Task 4: Playbook Management UI Verification**
  - Verify "Manage Playbooks" page works end-to-end
  - Test create, edit, delete playbooks flow
  
- [ ] **Task 5: Trade Form Integration**
  - Update `TradeForm` to include playbook selector
  - Auto-select active playbook if one is set

#### Phase 1.3: Global Filtering & Analytics
- [ ] **Task 6: Global Playbook Selector**
  - Add playbook switcher in App Header/Sidebar
  - Store "Active Playbook ID" in localStorage or session state
  
- [ ] **Task 7: Filter Logic Implementation**
  - Update Dashboard to filter by selected playbook
  - Update Trades page to filter by selected playbook
  - Update Analytics page to filter by selected playbook
  - Implement "All Playbooks" view option

#### Phase 1.4: Polish & Final Verification
- [ ] **Task 8: UI/UX Refinement**
  - Apply premium design patterns to playbook management
  - Add visual indicators (badges/colors) for different playbooks in trade lists
  
- [ ] **Task 9: Final Build & Test**
  - Run full test suite
  - Verify migration and data integrity
  - Deploy to VPS

---

### Phase 2: Export/Download Trade Data ⭐⭐⭐⭐
**Status:** NOT STARTED
**Priority:** HIGH — Quick win, professional feature
**Effort:** Low-Medium (~2-3 hours)

- [ ] **Task 1: CSV Export**
  - Export filtered trades to CSV format
  - Include all trade fields (pair, direction, result, P/L, dates, notes)
  
- [ ] **Task 2: Excel Export**
  - Export to .xlsx with formatting
  - Multiple sheets: Summary + Trades + Monthly breakdown
  
- [ ] **Task 3: PDF Report**
  - Monthly report: Summary stats + Equity curve chart
  - Professional layout with branding
  
- [ ] **Task 4: Export UI**
  - Add "Export" button to Trades page filter bar
  - Add "Download Report" to Analytics page
  - Format selector modal (CSV/Excel/PDF)

**Tech Stack:** `papaparse` (CSV), `exceljs` (Excel), `jsPDF` + `html2canvas` (PDF)

---

### Phase 3: Trade Notes/Tags System ⭐⭐⭐⭐
**Status:** NOT STARTED
**Priority:** HIGH — Differentiator from basic journals
**Effort:** Low (~2 hours)

- [ ] **Task 1: Database Schema**
  - Add `tags` field to Trade model (array or JSON)
  - Add `emotionalState` enum field
  - Migration
  
- [ ] **Task 2: Trade Form Updates**
  - Add tags input (comma-separated or tag pills)
  - Add emotional state selector (confident/anxious/neutral/FOMO/revenge)
  
- [ ] **Task 3: Trade Detail Enhancement**
  - Expandable notes section with rich formatting
  - Display tags as badges
  - Show emotional state icon
  
- [ ] **Task 4: Filter & Search**
  - Filter trades by tags
  - Search in notes content
  - Emotional state filter

**Common Tags:** `revenge-trade`, `fomo`, `patient-entry`, `news-event`, `breakout`, `reversal`

---

## 🔥 TIER 2: UX Enhancements (Should-Have)

### Phase 4: Quick Trade Entry (Speed Mode) ⭐⭐⭐
**Status:** NOT STARTED
**Effort:** Low (~1-2 hours)

- [ ] Floating "+" button on dashboard
- [ ] Modal with core fields only (pair, direction, result, P/L, date)
- [ ] Auto-save draft to localStorage
- [ ] Quick succession: Save & Add Another

---

### Phase 5: Dashboard Widgets Customization ⭐⭐⭐
**Status:** NOT STARTED
**Effort:** Medium (~3-4 hours)

- [ ] Toggle show/hide metrics via settings
- [ ] Reorder widgets (drag-drop or simple up/down)
- [ ] Save preferences to user settings
- [ ] Preset layouts: Scalper / Swing / Investor

---

### Phase 6: Trade Screenshot/Chart Upload ⭐⭐⭐⭐
**Status:** NOT STARTED
**Effort:** Medium (~3 hours)

- [ ] **Task 1: Storage Setup**
  - Set up Cloudflare R2 or AWS S3 bucket
  - Generate upload presigned URLs
  
- [ ] **Task 2: Upload UI**
  - Drag-drop or file picker in trade form
  - Image preview before submit
  - Multiple screenshots per trade
  
- [ ] **Task 3: Display**
  - Thumbnail gallery in trade detail page
  - Lightbox modal for full-size view
  - Download original

---

## 💡 TIER 3: Advanced Analytics (Nice-to-Have)

### Phase 7: Advanced Statistics ⭐⭐⭐
**Status:** NOT STARTED
**Effort:** Low-Medium (~2-3 hours)

- [ ] Consecutive wins/losses streak (current & max)
- [ ] Average holding time per trade
- [ ] Best/worst trading hours (hourly heatmap)
- [ ] Weekday performance breakdown
- [ ] Risk of Ruin calculator
- [ ] Sharpe ratio / Sortino ratio
- [ ] Max drawdown & recovery time

---

### Phase 8: Goal Tracking & Milestones ⭐⭐⭐
**Status:** NOT STARTED
**Effort:** Low (~2 hours)

- [ ] Set monthly/weekly P/L targets
- [ ] Progress bar on dashboard
- [ ] Milestone notifications (email/in-app)
- [ ] Historical goal achievement log
- [ ] Streak tracking (profitable days/weeks)

---

### Phase 9: Trade Alerts & Notifications ⭐⭐
**Status:** NOT STARTED
**Effort:** Medium (~3 hours)

- [ ] **Email Notifications:**
  - Weekly summary report
  - Milestone achievements
  - Drawdown alerts
  
- [ ] **In-App Notifications:**
  - Bell icon in header
  - Notification center
  
- [ ] **Push Notifications (PWA):**
  - Browser push for critical alerts

**Tech:** Resend/SendGrid for email, Web Push API

---

## 🚀 TIER 4: Scale & Polish (Future)

### Phase 10: Mobile App (PWA or Native) ⭐⭐
**Status:** NOT STARTED
**Effort:** High (~2-3 weeks)
**When:** After 100+ active users

- [ ] Progressive Web App (PWA) setup
- [ ] Offline support with service workers
- [ ] Mobile-optimized layouts
- [ ] Optional: React Native app

---

### Phase 11: Social/Community Features ⭐⭐
**Status:** NOT STARTED
**Effort:** High (~1-2 weeks)
**Risk:** Moderation overhead

- [ ] Share anonymized trades (opt-in)
- [ ] Public/private playbooks
- [ ] Leaderboard (win rate, profit factor)
- [ ] Trading buddies / follow system
- [ ] Comments on shared trades

---

### Phase 12: AI Trade Analysis ⭐⭐⭐
**Status:** NOT STARTED
**Effort:** Medium-High (~1 week)
**Cost:** OpenAI API usage

- [ ] GPT-4 analyze trade patterns
- [ ] Personalized insights: "You exit winners too early on Fridays"
- [ ] Strategy recommendations
- [ ] Automatic tagging suggestions
- [ ] Natural language query: "Show me revenge trades last month"

**Tech:** OpenAI API, vector embeddings for pattern matching

---

## 📊 Execution Priority (Next 2 Weeks)

### Week 1 (June 19-23, 2026)
1. ✅ **Complete Playbooks Backend** (Phase 1) — URGENT
2. ✅ **Trade Notes/Tags System** (Phase 3) — Quick win
3. ✅ **Export CSV/Excel** (Phase 2) — Professional feature

### Week 2 (June 24-30, 2026)
4. Trade Screenshot Upload (Phase 6)
5. Quick Trade Entry Modal (Phase 4)
6. Advanced Statistics (Phase 7)

### Future Sprints
7. Goal Tracking (Phase 8)
8. Dashboard Customization (Phase 5)
9. Notifications (Phase 9)
10. PDF Reports (Phase 2.3)

---

## ✅ Completed Features

**UI/UX Polish (June 19, 2026):**
- ✅ Phase 1: AI-slop removal (gradient, border radius, spacing)
- ✅ Phase 2: UX improvements (dashboard, buttons, responsive)
- ✅ Phase 3: Polish pass (tooltip, spacing, tabular numbers)
- ✅ Fix: Recent trades card overlap
- ✅ Fix: Equity curve tooltip position
- ✅ Improve: Trading calendar visual hierarchy
- ✅ Improve: Dropdown arrow icons (SVG chevron)
- ✅ Improve: Date picker icons (SVG calendar)
- ✅ Improve: Date picker UX (read-only + month/year dropdowns)
- ✅ Fix: Date picker dropdown auto-close bug
- ✅ Fix: Date picker focus outline removal

**Core Features (Pre-June 19, 2026):**
- ✅ Landing page
- ✅ Register/login/logout
- ✅ PostgreSQL schema and migrations
- ✅ Protected dashboard
- ✅ Settings (profile, password)
- ✅ Trade CRUD (create, read, update, delete)
- ✅ Trade history with search/filter/sort/pagination
- ✅ Analytics page (profit factor, performance breakdowns)
- ✅ Equity curve chart
- ✅ Best/worst pair and setup
- ✅ Monthly performance summary
- ✅ Premium UI animations with reduced-motion support

---

## 🎯 Success Metrics

**Phase 1 Success Criteria:**
- User can create multiple playbooks
- Trades are correctly scoped to playbooks
- Dashboard/Analytics filter by active playbook
- No data leakage between playbooks

**Phase 2 Success Criteria:**
- Export button generates valid CSV/Excel files
- PDF report renders correctly with charts
- Download completes in < 5 seconds for 1000 trades

**Phase 3 Success Criteria:**
- Tags are searchable and filterable
- Notes support markdown or rich text
- Emotional state tracking increases user engagement

---

## 📝 Notes

- **Database:** PostgreSQL via Prisma (SQLite removed)
- **Hosting:** VPS with Docker Compose
- **Deployment:** `./scripts/deploy.sh` after `git push`
- **Testing:** Vitest unit tests, build verification
- **Design System:** Premium dark theme, gold accents, no AI-slop patterns
