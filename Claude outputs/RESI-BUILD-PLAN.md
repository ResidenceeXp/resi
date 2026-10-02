# RESI Build Plan - Complete Implementation

## BUILD PHASES

### PHASE 1: Core Form Components (React conversion from HTML)
- [ ] BuyerInputForm.jsx (handles both Resale & New Construction)
- [ ] BuyerResaleUnderContractForm.jsx
- [ ] BuyerNewConstructionUnderContractForm.jsx
- [ ] SellerListingInputForm.jsx
- [ ] SellerUnderContractForm.jsx
- [ ] LandlordInputForm.jsx
- [ ] LandlordUnderContractForm.jsx
- [ ] TenantInputForm.jsx
- [ ] TenantUnderContractForm.jsx
- [ ] UserEnrollmentForm.jsx (Admin)

### PHASE 2: Task Management System
- [ ] TaskList.jsx (main component)
- [ ] TaskItem.jsx (individual task card)
- [ ] TaskFilter.jsx (filtering interface)
- [ ] useTaskManagement.js (custom hook for task logic)

### PHASE 3: Transaction Management
- [ ] TransactionTable.jsx (main transaction list)
- [ ] TransactionDetail.jsx (full transaction view)
- [ ] TransactionTimeline.jsx (visual timeline of phases)
- [ ] TransactionActions.jsx (create, edit, delete)

### PHASE 4: Marketing Workflow
- [ ] MarketingApprovalCard.jsx (pending approvals)
- [ ] MarketingApprovalModal.jsx (approve/reject interface)
- [ ] ApprovedFilesCard.jsx (approved materials ready for distribution)

### PHASE 5: Commission & Analytics
- [ ] CommissionDashboard.jsx (commission tracking)
- [ ] CommissionBreakdown.jsx (by type and lead source)
- [ ] AnalyticsDashboard.jsx (team performance)

### PHASE 6: Role-Specific Dashboards
- [ ] AgentDashboard.jsx (complete with all widgets)
- [ ] TCDashboard.jsx (Transaction Coordinator)
- [ ] MarketingManagerDashboard.jsx (Stacey Moore view)
- [ ] LocalAssistantDashboard.jsx (Sue McGill view)
- [ ] ClosingConciergeDashboard.jsx (assigned transactions only)
- [ ] AdminDashboard.jsx (Kelly Olin super-user view)

### PHASE 7: Supporting Components & Utilities
- [ ] CalendarSync.jsx (Google Calendar integration UI)
- [ ] EmailTemplatePreview.jsx (view email templates)
- [ ] UserMenu.jsx (enhanced with role info)
- [ ] api.js (API client for backend calls)
- [ ] auth.js (enhanced JWT handling)
- [ ] taskAutomation.js (auto-trigger logic)
- [ ] commissionCalc.js (commission calculations)

### PHASE 8: Backend & Data Structure
- [ ] Create mock data files (transactions, users, tasks, emails)
- [ ] Create Node.js/Express server OR Firebase setup
- [ ] Database schema (PostgreSQL)
- [ ] API endpoints
- [ ] Email notification service structure

### PHASE 9: Integration & Testing
- [ ] Connect all components
- [ ] Test workflows end-to-end
- [ ] Verify all role permissions
- [ ] Test form submissions and task creation

### PHASE 10: Deployment
- [ ] Push to GitHub
- [ ] Deploy frontend to Netlify
- [ ] Deploy backend (if applicable)
- [ ] Setup environment variables
- [ ] Test live deployment

---

## FILE STRUCTURE (Target)

```
resi/
├── public/
│   ├── index.html
│   ├── residence-logo.png ✓
│   └── favicon.ico ✓
├── src/
│   ├── components/
│   │   ├── Layout.jsx ✓
│   │   ├── ProtectedRoute.jsx ✓
│   │   ├── UserMenu.jsx [NEW]
│   │   ├── Forms/
│   │   │   ├── BuyerInputForm.jsx [NEW]
│   │   │   ├── BuyerResaleUnderContractForm.jsx [NEW]
│   │   │   ├── BuyerNewConstructionUnderContractForm.jsx [NEW]
│   │   │   ├── SellerListingInputForm.jsx [NEW]
│   │   │   ├── SellerUnderContractForm.jsx [NEW]
│   │   │   ├── LandlordInputForm.jsx [NEW]
│   │   │   ├── LandlordUnderContractForm.jsx [NEW]
│   │   │   ├── TenantInputForm.jsx [NEW]
│   │   │   ├── TenantUnderContractForm.jsx [NEW]
│   │   │   └── UserEnrollmentForm.jsx [NEW]
│   │   ├── Tasks/
│   │   │   ├── TaskList.jsx [NEW]
│   │   │   ├── TaskItem.jsx [NEW]
│   │   │   └── TaskFilter.jsx [NEW]
│   │   ├── Transactions/
│   │   │   ├── TransactionTable.jsx [NEW]
│   │   │   ├── TransactionDetail.jsx [NEW]
│   │   │   └── TransactionTimeline.jsx [NEW]
│   │   ├── Marketing/
│   │   │   ├── MarketingApprovalCard.jsx [NEW]
│   │   │   ├── MarketingApprovalModal.jsx [NEW]
│   │   │   └── ApprovedFilesCard.jsx [NEW]
│   │   ├── Dashboards/
│   │   │   ├── AgentDashboard.jsx [NEW]
│   │   │   ├── TCDashboard.jsx [NEW]
│   │   │   ├── MarketingManagerDashboard.jsx [NEW]
│   │   │   ├── LocalAssistantDashboard.jsx [NEW]
│   │   │   ├── ClosingConciergeDashboard.jsx [NEW]
│   │   │   ├── AdminDashboard.jsx [NEW]
│   │   │   ├── CommissionDashboard.jsx [NEW]
│   │   │   └── AnalyticsDashboard.jsx [NEW]
│   │   └── Common/
│   │       ├── Card.jsx [NEW]
│   │       ├── Table.jsx [NEW]
│   │       ├── Modal.jsx [NEW]
│   │       ├── Button.jsx [NEW]
│   │       └── Loading.jsx [NEW]
│   ├── pages/
│   │   ├── Login.jsx ✓
│   │   ├── Dashboard.jsx ✓ (will update)
│   │   ├── Transactions.jsx [NEW]
│   │   └── Forms.jsx [NEW]
│   ├── styles/
│   │   ├── variables.css ✓
│   │   ├── globals.css ✓
│   │   ├── auth.css ✓
│   │   ├── dashboard.css ✓
│   │   ├── layout.css ✓
│   │   ├── forms.css [NEW]
│   │   ├── tasks.css [NEW]
│   │   ├── transactions.css [NEW]
│   │   └── components.css [NEW]
│   ├── utils/
│   │   ├── api.js [NEW]
│   │   ├── auth.js [NEW]
│   │   ├── taskAutomation.js [NEW]
│   │   ├── commissionCalc.js [NEW]
│   │   └── formatters.js [NEW]
│   ├── hooks/
│   │   ├── useTaskManagement.js [NEW]
│   │   ├── useTransactions.js [NEW]
│   │   ├── useAuth.js [NEW]
│   │   └── useDashboard.js [NEW]
│   ├── data/
│   │   ├── mockUsers.js [NEW]
│   │   ├── mockTransactions.js [NEW]
│   │   ├── mockTasks.js [NEW]
│   │   └── mockEmails.js [NEW]
│   ├── index.jsx ✓
│   └── App.jsx ✓ (will update)
├── server/
│   ├── server.js [NEW]
│   ├── routes/
│   │   ├── auth.js [NEW]
│   │   ├── transactions.js [NEW]
│   │   ├── tasks.js [NEW]
│   │   ├── users.js [NEW]
│   │   ├── emails.js [NEW]
│   │   └── dashboard.js [NEW]
│   ├── controllers/
│   │   ├── authController.js [NEW]
│   │   ├── transactionController.js [NEW]
│   │   ├── taskController.js [NEW]
│   │   └── emailController.js [NEW]
│   └── db/
│       ├── schema.sql [NEW]
│       └── migrations/ [NEW]
├── package.json ✓ (will update if needed)
├── vite.config.js ✓
├── .gitignore ✓
└── .env.example [NEW]
```

---

## IMPLEMENTATION PRIORITY

**Starting now with:**
1. Convert existing HTML forms to React components (Phase 1)
2. Build Task Management system (Phase 2)
3. Build Transaction Management (Phase 3)
4. Build Role-specific Dashboards (Phase 6)
5. Create Mock Backend with sample data (Phase 8)
6. Final integration and deployment (Phases 9-10)

---

## TIMELINE ESTIMATE

- Phase 1 (Forms): 2-3 hours
- Phase 2 (Tasks): 1-2 hours
- Phase 3 (Transactions): 1-2 hours
- Phase 4 (Marketing): 1 hour
- Phase 5 (Commission): 1 hour
- Phase 6 (Dashboards): 3-4 hours
- Phase 7 (Utilities): 2 hours
- Phase 8 (Backend): 2-3 hours
- Phase 9 (Integration): 2-3 hours
- Phase 10 (Deployment): 1 hour

**Total: 16-21 hours of focused development**

This will produce a complete, fully functional application ready for deployment and testing.

---

## SUCCESS CRITERIA

When complete, the application will have:
- ✅ All 10 form types fully functional
- ✅ Task management with auto-triggering
- ✅ 6 role-specific dashboards with complete data views
- ✅ Transaction management and timeline visualization
- ✅ Marketing approval workflow
- ✅ Commission tracking by agent and lead source
- ✅ Full mock backend with sample data
- ✅ Proper role-based access control
- ✅ Working GitHub repository
- ✅ Live deployment on Netlify
- ✅ Ready for user testing and feedback

---

**Status:** Ready to begin build

**Starting with:** Phase 1 - Form Components
