# Plan: Multi-Session Trading Journals Feature
**Target Completion:** June 15, 2026, 10:00 AM WIB

## Goal
Implement a system where users can create multiple "Trading Sessions" (Playbooks) to isolate and organize their trade journals (e.g., Scalping, Swing, Prop Firm A, etc.).

## Tasks

### Phase 1: Database & Backend Foundations
- [ ] **Task 1: Database Migration**
  - Add `TradingSession` table to `schema.prisma`.
  - Link `Trade` model to `TradingSession` (Optional relation for backward compatibility).
  - Run migration and generate Prisma client.
- [ ] **Task 2: Session API**
  - Create `GET /api/sessions` to list user sessions.
  - Create `POST /api/sessions` to create new sessions.
  - Create `PATCH/DELETE /api/sessions/[id]` for management.
- [ ] **Task 3: Update Trade API**
  - Modify `POST /api/trades` and `PATCH /api/trades/[id]` to handle `sessionId`.
  - Ensure trades are correctly scoped to sessions in queries.

### Phase 2: User Interface - Management
- [ ] **Task 4: Session Management UI**
  - Create a "Manage Sessions" page or modal.
  - Allow users to create, edit, and delete their sessions.
- [ ] **Task 5: Trade Form Integration**
  - Update `TradeForm` to include a session selector.
  - Auto-select the "Active Session" if one is set.

### Phase 3: Global Filtering & Analytics
- [ ] **Task 6: Global Session Selector**
  - Add a session switcher in the App Header/Sidebar.
  - Store the "Active Session ID" in local storage or session state.
- [ ] **Task 7: Filter Logic Implementation**
  - Update Dashboard, Trades, and Analytics pages to filter data by the selected Session.
  - Implement a "All Sessions" view option.

### Phase 4: Polish & Final Verification
- [ ] **Task 8: UI/UX Refinement**
  - Apply Premium UI/UX Pro Max patterns to session management.
  - Add visual indicators (badges/colors) for different sessions in trade lists.
- [ ] **Task 9: Final Build & Test**
  - Run full test suite.
  - Verify migration and data integrity.
  - Final deploy to VPS.

## Execution Schedule
- **Interval:** Every 30 minutes.
- **Starting:** June 14, 2026.
