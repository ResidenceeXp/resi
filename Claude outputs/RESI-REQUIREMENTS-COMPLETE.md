# RESI Transaction Management System - Complete Requirements

**Document Version:** 1.0  
**Last Updated:** 2026-09-29  
**Extracted from:** Full conversation transcript (Sept 27-29, 2026)  
**Status:** ✅ COMPREHENSIVE - All 6 user roles, 4 transaction types, all forms, workflows, dashboards, and business logic captured

---

## EXECUTIVE SUMMARY

RESI is a comprehensive transaction management platform for RESIDENCE | eXp Realty, supporting:
- **6 User Roles** with distinct permissions and dashboards
- **4 Transaction Types** (Seller, Buyer Resale, Buyer New Construction, Landlord, Tenant)
- **Complex Workflows** with auto-triggered tasks and email notifications
- **Commission Tracking** with eXp splits and lead source tracking
- **Multi-user Collaboration** across agents, support staff, and administrators

**Tech Stack:**
- Frontend: React 18.2 + React Router v6 + Vite
- Styling: CSS custom properties (design tokens)
- Authentication: JWT-based with localStorage
- Backend: Node.js/Express (to be built)
- Database: PostgreSQL (to be specified)

---

## 1. USER ROLES & PERMISSIONS

### 1.1 AGENT (Sales Professional)

**Permissions:**
- View ONLY their own transactions and tasks
- Create new transactions (all types: Buyer, Seller, Landlord, Tenant)
- Enter transaction data via forms
- Approve marketing materials before publication
- Complete assigned tasks
- View their personal metrics and commission tracking
- Self-generate leads (farming, sphere of influence, referrals)

**Dashboard Displays:**
- Transactions table (filterable by status, address, transaction type)
- Task queue with filtering by date/address/task type
- Personal metrics: year-to-date sales volume, pending/closed transactions, live listings
- Calendar view of upcoming deadlines
- Commission dashboard (YTD earned, pending, sales volume)

**Auto-Populated Fields:**
- Agent field on all forms (from login credentials)

---

### 1.2 TRANSACTION COORDINATOR (TC) - Support Staff

**Permissions:**
- View ALL transactions across the entire brokerage
- Enter data into Skyslope and MLS
- Mark tasks complete
- Update deadline dates on transactions
- Email title companies
- Receive and manage auto-generated task queue

**Responsibilities:**
- Skyslope data entry
- MLS listing entry
- Title company communication and file setup
- Earnest money deposit tracking and confirmation
- Contract deadline management
- Calendar invitations and deadline tracking

**Dashboard Displays:**
- All brokerage transactions (not agent-filtered)
- Task queue prioritized by deadline date
- Deadline alerts (earnest money due, financing deadline, etc.)
- MLS entry tracking status
- Skyslope paperwork completion tracker
- Transaction status overview

---

### 1.3 MARKETING MANAGER - Support Staff

**Person:** Stacey Moore  
**Permissions:**
- View ALL transactions across the entire brokerage
- Create marketing materials (brochures, mailers, feature cards, social posts)
- Post approval requests to agents
- Mark tasks complete when agent approves
- Access marketing calendar and templates

**Triggered Tasks:**
- Create brochure (1 day after photo shoot) → send to agent for approval
- Create mailer (1 day after photo shoot) → send to agent for approval
- Create feature cards (1 day after photo shoot) → send to agent for approval
- Create social media post (new buyer under contract)
- Send just-sold postcard (after closing for farming communities)
- Create just-listed reverse prospecting emails

**Dashboard Displays:**
- Pending marketing approvals queue
- Completed marketing content calendar
- Just-listed reverse prospecting campaign status
- Social media post schedule
- Postcard/mailer printing schedule

---

### 1.4 LOCAL ASSISTANT - Support Staff

**Person:** Sue McGill  
**Permissions:**
- View ALL transactions across the entire brokerage
- Receive task notifications for printing/distribution
- Mark distribution tasks complete
- View approved marketing files

**Responsibilities:**
- Receive approved marketing files from agent approval
- Print feature cards, mailers, brochures
- Coordinate delivery and distribution of physical materials
- Track printing status and completion

**Dashboard Displays:**
- Printing/distribution task queue
- Material approval notifications
- Task status tracking (pending vs. completed)
- Distribution logistics timeline

---

### 1.5 CLOSING CONCIERGE - Support Staff (Optional)

**Permissions:**
- View ONLY transactions where they are assigned
- View pre-closing checklists and timelines
- Receive email notifications when selected on transaction
- View closing week timeline and contact information
- Cannot edit transaction data

**Triggered Responsibilities:**
- Receive email notification + task when selected on a transaction
- Manage pre-closing checklists
- Coordinate closing week logistics
- (Specific workflow duties TBD per transaction type)

**Dashboard Displays:**
- Assigned transactions only
- Pre-closing checklists per transaction
- Closing week timeline
- Contact information for all parties

---

### 1.6 ADMIN - Super User

**Person:** Kelly Olin  
**Permissions:**
- Super-user access: See ALL transactions across brokerage
- PLUS: See all of own agent transactions and tasks (dual access)
- User management (enrollment, role assignment, deactivation)
- System configuration and settings
- Access to team performance analytics and dashboards
- Commission rate management

**Dashboard Displays:**
- Team performance metrics and analytics
- Sales pipeline overview by agent/type
- User activity logs and audit trail
- System configuration access
- All team transactions + own agent transactions
- Comprehensive commission tracking

---

## 2. TRANSACTION TYPES & STRUCTURE

### 2.1 SELLER (Resale Property)

**Phase 1: Seller Listing Input Form**
- Agent (auto-populated)
- Property address (street, city, state, zip, county)
- Co-list agent (optional dropdown)
- Anticipated listing date
- Photography date (if ordered)
- Listing video script due date (3 days before photo shoot)
- ShowingTime setup date (day listing goes live)

**Phase 2: Seller Under Contract Form**
- (Fields TBD but includes offer details, contract dates, earnest money tracking)

**Triggered Tasks & Emails:**
- Email to: Agent, TC, Marketing Manager (Stacey), co-list agent
- TC Task: Enter listing into Skyslope
- TC Task: Enter listing into MLS
- Agent Task: Begin staging if necessary
- Agent Task: Schedule photography
- Agent Task: Write listing video script (due 3 days before photos)
- Marketing Manager Task: Create brochure order + approval request
- Marketing Manager Task: Create mailer + approval request
- Marketing Manager Task: Create feature cards + approval request
- Agent Task: "Is listing live?" check (repeat daily until yes)
- Agent Task: Setup ShowingTime

---

### 2.2 BUYER - RESALE

**Phase 1: Buyer Input Form**
- Primary contact: First Name, Last Name, Phone, Email
- Trust/LLC option: checkbox + official name field
- Secondary/Tertiary/Quaternary contacts: Up to 3 additional with First Name, Last Name, Phone, Email, Relationship, Nickname (optional), Birth Date (optional)
- Property address: Street, City, State (defaults to Florida), Zip, County (dropdown: Lee/Collier/Charlotte)
- Co-agent: Dropdown to select other agents in system
- Lead generation source: Dropdown (Agent-generated | Team-generated)
- Lead source detail (conditional):
  - **If Agent-generated:** Farming, Sphere of influence, Friends and family, Personal referral, Past client, Open house, Other
  - **If Team-generated:** Google PPC/Cinc, Listing meta ad, Team leader referral, Database pond, Team marketing, Other
- Property details: HOA approval required? (yes/no), Condo? (yes/no)
- Trigger dates: Under Contract Date, Forecasted Closing Date, Due Diligence/Inspection Deadline

**Phase 2: Buyer Resale Under Contract Form**
- (Fields TBD but must track: earnest money due dates, financing deadline, inspection deadline, closing date)

**Triggered Workflows & Tasks:**
- **Day 1:** Insurance Recommendations email to buyers (all contacts CC'd to agent)
- **Day 1:** Listing Photos Permission Request email from Marketing Manager to cooperating agent
- **Day 2:** Home Inspection Prep email to buyer
- **7 Days Before Close:** Financing Deadline Reminder email
- **10 Days Before Close:** Wire Fraud Warning email
- **7 Days Before Close:** Closing Week Prep email
- **Day of Under Contract:** Create social media post task (if farming community)
- **Ongoing:** Earnest money confirmation tasks (1st & 2nd deposits)
- **Post-Closing:** Check-in emails at 3 days, 1 month, 6 months, 1 year
- **If farming community:** Send just-sold postcard after close

**Commission Structure:**
- **Agent-generated leads:** 25% to RESIDENCE, 75% to agent/eXp split
- **Team-generated leads:** 50% to RESIDENCE, 50% to agent/eXp split

---

### 2.3 BUYER - NEW CONSTRUCTION

**Phase 1: Buyer Input Form**
- Same fields as Resale PLUS builder-specific fields (TBD)

**Phase 2: Buyer New Construction Under Contract Form**
- Must track: Builder meeting walkthrough info, blue tape items, builder orientation, key pickup timing
- 11-month warranty expiration tracking

**Triggered Workflows & Tasks:**
- **Day 10 After Under Contract:** Insurance Recommendations email (special language: not tied to builder incentives)
- **2 Weeks Before Close:** Closing Week Prep email (includes builder walkthrough info, blue tape items, builder orientation, key pickup timing, buyer notification requirement)
- **10 Days Before Close:** Wire Fraud Warning email
- **Day of Under Contract:** Congratulations email (celebration of contract, next steps, builder contact)
- **Post-Closing:** 11-month warranty expiration email reminder
- **Post-Closing:** Check-in emails at 3 days, 1 month, 6 months, 1 year

---

### 2.4 LANDLORD (Rental Property)

**Special Architecture:** One Landlord Input can link to MULTIPLE Landlord Under Contract forms for different lease periods of same property

**Phase 1: Landlord Input Form**
- Property details
- Landlord contact info
- (Other fields TBD)

**Phase 2: Landlord Under Contract Form (Multiple per property)**
- Must link to parent Landlord Input record
- Lease period dates (start & end)
- Tenant assignment
- (Other fields TBD)

**Example:** 27594 Shore Dr, Bonita Springs can have:
- Lease 1: Jan 1 - Mar 31, 2026 (Under Contract form A)
- Lease 2: May 1 - Oct 31, 2026 (Under Contract form B)
- Both share same property address but are separate Under Contract records

---

### 2.5 TENANT (Rental Consumer)

**Phase 1: Tenant Input Form**
- Tenant contact info
- Search criteria
- (Other fields TBD)

**Phase 2: Tenant Under Contract Form**
- Property matched to
- Lease terms
- (Other fields TBD)

---

## 3. FORMS & COMPONENTS REQUIRED

### 3.1 Page Components (Already Built ✓)
- Login.jsx
- Dashboard.jsx (role-specific views)
- Layout.jsx (sidebar + header)

### 3.2 Forms to Build

#### 3.2.1 Buyer Forms
- `BuyerInputForm.jsx` (Resale & New Construction options)
- `BuyerResaleUnderContractForm.jsx`
- `BuyerNewConstructionUnderContractForm.jsx`

#### 3.2.2 Seller Forms
- `SellerListingInputForm.jsx`
- `SellerUnderContractForm.jsx`

#### 3.2.3 Landlord Forms
- `LandlordInputForm.jsx`
- `LandlordUnderContractForm.jsx`

#### 3.2.4 Tenant Forms
- `TenantInputForm.jsx`
- `TenantUnderContractForm.jsx`

#### 3.2.5 Admin Forms
- `UserEnrollmentForm.jsx` (user role, email, name, role selection)

### 3.3 Supporting Components

#### 3.3.1 Task Management
- `TaskList.jsx` (role-specific task queue with filtering)
- `TaskItem.jsx` (individual task with completion, date, priority)
- `TaskFilter.jsx` (filter by date, address, task type, status)

#### 3.3.2 Marketing Workflow
- `MarketingApprovalCard.jsx` (shows pending approval requests)
- `MarketingApprovalModal.jsx` (approve/reject with file preview)
- `ApprovedFilesCard.jsx` (shows approved files ready for distribution)

#### 3.3.3 Commission Tracking
- `CommissionDashboard.jsx` (YTD earned, pending, sales volume, live listing value)
- `CommissionBreakdown.jsx` (by transaction type, by lead source)

#### 3.3.4 Transaction Management
- `TransactionTable.jsx` (searchable, filterable by status, type, address)
- `TransactionDetail.jsx` (full transaction view with all phases)
- `TransactionTimeline.jsx` (visual timeline of transaction phases and deadlines)

---

## 4. WORKFLOW AUTOMATION & TASKS

### 4.1 Auto-Triggered Tasks (When Form Fields Updated)

When deadline dates are edited, associated tasks automatically update on relevant team members' task lists.

**Example:** When earnest money due date field is edited:
- Task date updates for TC: "Confirm earnest money deposit submitted"
- Task date updates for Agent: "Confirm earnest money deposit submitted"

### 4.2 Task Assignment Rules

| Task Type | Visibility | Assignment |
|-----------|-----------|-----------|
| Agent-assigned tasks | Only that agent | From agent dashboard |
| Support staff tasks | All support staff | Auto-triggered from forms |
| Closing Concierge tasks | Only if assigned to transaction | Only to selected concierge |
| Admin | All tasks across all transactions | Full visibility + assignment |

### 4.3 Task Types by Transaction

**Seller Listing Tasks:**
1. Enter listing into Skyslope (TC)
2. Enter listing into MLS (TC)
3. Begin staging if necessary (Agent)
4. Schedule photography (Agent)
5. Write listing video script (Agent) - Due 3 days before photos
6. Create brochure order (Marketing) - Due 1 day after photos
7. Create mailer (Marketing) - Due 1 day after photos
8. Create feature cards (Marketing) - Due 1 day after photos
9. Is listing live? (Agent) - Daily check until listing goes live
10. Setup ShowingTime (Agent) - Day listing goes live

**Buyer Resale Under Contract Tasks:**
1. Create social media post (Marketing) - Day 1, if farming community
2. Enter transaction into Skyslope (TC) - Day 1
3. Confirm 1st earnest money deposit (Agent & TC) - Due on earnest money deadline
4. Confirm 2nd earnest money deposit (Agent & TC) - Due on 2nd deposit deadline (if applicable)
5. Send just-sold postcard (Marketing) - Post-closing for farming communities

**Post-Closing Tasks (All Types):**
- 3-day follow-up check-in (Agent)
- 1-month follow-up check-in (Agent)
- 6-month follow-up check-in (Agent)
- 1-year follow-up check-in (Agent)

---

## 5. DASHBOARD SPECIFICATIONS BY ROLE

### 5.1 Agent Dashboard

**Layout:**
- Transactions Table (primary)
  - Columns: Property Address | Status | Transaction Type | Closing Date | Commission Value
  - Filters: Status dropdown, search bar, transaction type filter
  - Sort: by date, status, commission value
  - Actions: View detail, edit, delete (own only)

- Task List (secondary)
  - Columns: Task Description | Due Date | Address | Status
  - Filters: By date range, address, task type
  - Sort: by due date (urgent first)
  - Actions: Mark complete, edit due date

- Personal Metrics (top cards)
  - YTD Closed Transactions
  - YTD Commission Earned
  - Pending/Under Contract Count
  - Live Listings Count

- Calendar View
  - All-day events for actionable deadlines
  - Excludes "effective dates"
  - Shows property address in event details

---

### 5.2 Transaction Coordinator Dashboard

**Layout:**
- All Brokerage Transactions Table
  - Columns: Property Address | Agent | Status | Transaction Type | Skyslope Status | MLS Status | Next Deadline
  - Filters: By agent, status, transaction type, deadline urgency
  - Search: by address, agent name, transaction ID

- Task Queue (prioritized by deadline)
  - Due Today section (red)
  - Due This Week section (yellow)
  - Due Next Week section (blue)
  - Task completion percentage by deadline

- Deadline Alerts
  - Earnest Money Due (today/this week/overdue)
  - Financing Deadline approaching
  - Inspection Deadline approaching
  - Title Initiation pending
  - Closing Date countdown

- Status Trackers
  - MLS entry completion %
  - Skyslope paperwork completion %
  - Title company file initiation %

---

### 5.3 Marketing Manager Dashboard

**Layout:**
- Pending Approvals Queue
  - Columns: Property Address | Material Type (Brochure/Mailer/Feature Cards/Social Post) | Agent | Submitted Date | Status
  - Actions: View, approve, request changes, comment
  - Notifications badge with count

- Marketing Content Calendar
  - Timeline view of all marketing materials
  - By property address
  - Color-coded by type (brochure/mailer/cards/social)
  - Filter by property, agent, date range

- Completed Marketing Log
  - All published materials
  - By property and date
  - Links to files
  - Agent approval date

- Campaign Status
  - Just-Listed Reverse Prospecting: # emails sent, open rate, click rate
  - Just-Sold Postcards: # sent, delivery confirmed
  - Social Media: posts scheduled, posted, engagement

---

### 5.4 Local Assistant Dashboard

**Layout:**
- Printing/Distribution Task Queue
  - Columns: Property Address | Material Type | Quantity | Due Date | Status
  - Filters: By material type, status
  - Sort: by due date, property

- Approved Files Notification
  - Shows newly approved files ready for action
  - File download links
  - Task instructions per material type
  - Example: "Feature cards approved for [address] — proceed with printing"

- Task Completion Tracking
  - % of tasks completed this week/month
  - Timeline of completed distributions
  - Material inventory (optional)

---

### 5.5 Closing Concierge Dashboard

**Layout:**
- Assigned Transactions Only
  - Columns: Property Address | Buyer/Seller Name | Closing Date | Days Until Closing | Status
  - Links to full transaction detail

- Pre-Closing Checklists
  - Customized by transaction type
  - Checklist items: document review, inspection scheduling, final walkthrough, etc.
  - Track completion status

- Closing Week Timeline
  - Countdown to closing day
  - Key dates and deadlines
  - Party contact information
  - Next actions required

---

### 5.6 Admin Dashboard

**Layout:**
- Team Performance Metrics
  - Cards: Total Closed Sales (YTD), Total Pending, Team Commission Earned, Active Listings
  - Agent-by-agent breakdown table

- Sales Pipeline Overview
  - Funnel: New Leads → Under Contract → Closed
  - By transaction type
  - By lead source

- User Management Portal
  - User list with role, status (active/inactive), join date
  - Actions: Add user, edit role, deactivate, view activity

- System Configuration
  - Email templates management
  - Commission rate settings
  - Deadline templates
  - Integration status (ShowingTime, Skyslope, MLS, Google Calendar)

- Audit Trail & Analytics
  - User login activity
  - Transaction creation/modification log
  - Email sent log
  - Task completion statistics

---

## 6. EMAIL NOTIFICATIONS

### 6.1 Seller Listing Input Trigger

**Recipients:** Agent, TC, Marketing Manager (Stacey), Co-list agent (if applicable)  
**Template:** [HTML template to be built]  
**Content:**
- Property address
- Photography date
- Expected listing date
- Marketing timeline (brochure/mailer/feature cards dates)
- Links to Skyslope and MLS entry forms
- Next action items

---

### 6.2 Buyer Resale Under Contract Emails

#### Day 1: Insurance Recommendations
**Recipients:** All buyer contacts (primary + secondary/tertiary/quaternary) CC'd to agent  
**Template:** [HTML template to be built]  
**Content:**
- Professional branding (residence-logo.png color version)
- Agent headshot, name, title in signature
- Insurance options and recommendations
- Agent contact info (call/text format)

#### Day 1: Listing Photos Permission Request
**Recipients:** Cooperating agent (from Marketing Manager)  
**Template:** [HTML template to be built]  
**Content:**
- Permission request to use listing photos
- Marketing plans (social, brochure, mailer)
- Response deadline and contact info

#### Day 2: Home Inspection Preparation
**Recipients:** Buyer email distribution list  
**Template:** [HTML template to be built]  
**Content:**
- Tips for preparing for home inspection
- What to expect during inspection
- Common issues to look for
- Inspector contact & timing information

#### 7 Days Before Close: Financing Deadline Reminder
**Recipients:** Buyer email distribution list  
**Template:** [HTML template to be built]  
**Content:**
- Financing deadline date
- Current status of financing
- Lender contact information
- Action items required from buyer

#### 10 Days Before Close: Wire Fraud Warning
**Recipients:** Buyer email distribution list  
**Template:** [HTML template to be built]  
**Content:**
- Wire fraud awareness and prevention
- Verification procedures before wiring funds
- Safe wire practices
- Contact info for verification

#### 7 Days Before Close: Closing Week Preparation
**Recipients:** Buyer email distribution list  
**Template:** [HTML template to be built]  
**Content:**
- Closing date, time, location
- Parties present at closing
- Documents to bring
- Final walkthrough timing
- Title company contact info
- Lender contact info
- Agent contact info

---

### 6.3 Buyer New Construction Under Contract Emails

#### Day 10 After Under Contract: Insurance Recommendations
**Recipients:** Buyer email distribution list  
**Special:** Must NOT link insurance to builder incentives  
**Template:** [HTML template to be built]  
**Content:**
- Insurance options
- Emphasis that buyer choice is independent of incentives
- Lender and builder insurance requirements
- Timeline for insurance commitment

#### 2 Weeks Before Close: Closing Week Preparation
**Recipients:** Buyer email distribution list  
**Template:** [HTML template to be built]  
**Content:**
- Builder meeting walkthrough info
- Blue tape items and review procedures
- Builder orientation details
- Key pickup: ON CLOSING DAY ONLY (must include this requirement)
- Buyer must notify agent of walkthrough date
- Final walkthrough timing
- Closing logistics

#### 10 Days Before Close: Wire Fraud Warning
**Recipients:** Buyer email distribution list  
**Template:** [HTML template to be built]  
**Content:**
- Wire fraud awareness
- Verification procedures
- Safe wire practices

#### Day of Under Contract: Congratulations Email
**Recipients:** Buyer email distribution list  
**Template:** [HTML template to be built]  
**Content:**
- Congratulations on contract execution
- Celebration tone
- Builder contact information
- Next steps timeline
- Agent contact info

#### Post-Closing: 11-Month Warranty Expiration Reminder
**Recipient:** Buyer  
**Trigger:** 11 months after closing date  
**Template:** [HTML template to be built]  
**Content:**
- Warranty expiration date
- Actions needed before expiration
- Builder contact info for warranty claims

---

### 6.4 Title Initiation Email

**Trigger:** When Buyer Under Contract form submitted  
**Recipients:** Title company (Amy Earl, Heights Title) + TC (Tina Hochstaetter)  
**Template:** [HTML template to be built]  
**Content:**
- Transaction details
- All parties (buyer, seller, agent, agent)
- Key dates (under contract, financing deadline, inspection deadline, closing date)
- Document requirements
- Earnest money details

---

### 6.5 Earnest Money Confirmation Email

**Trigger:** When TC marks earnest money as confirmed  
**Recipients:** TC, Agent  
**Template:** [HTML template to be built]  
**Content:**
- Earnest money amount and deposit date
- 2nd deposit details (if applicable)
- Next deadline date
- Action confirmation

---

### 6.6 Auto-Declined Support Emails

**Do NOT forward to TC (Tina Hochstaetter):**
- Skyslope/DigiSign "Envelope completed" e-sign completion notices

**DO forward to TC (even though subject says "Do Not Forward"):**
- Builder DocuSign "Completed: Contract Documents" (include PDF attachments)

**DO forward to TC:**
- Lennar emails with access codes

**Special Handling:**
- Shore Dr property (27594 Shore Dr, Bonita Springs) emails: Forward to Sara Denmark (saradenmarkrealtor@gmail.com)

---

## 7. COMMISSION STRUCTURE

### 7.1 Commission Splits

**Kelly Olin (Team Leader)**
- Split with eXp: 80% Kelly, 20% eXp
- eXp cap: $16,000 per cap year (Aug 1 - Jul 31)
- After $16,000 cap reached: 100% Kelly commission
- No RESIDENCE team split on her commissions

**Team Agents**
- Split with eXp: 80% agent, 20% eXp
- eXp cap: $8,000 per cap year (Aug 1 - Jul 31)
- After $8,000 cap reached: 100% agent commission

**Lead Source Splits**
- **Agent-generated leads:** 25% to RESIDENCE, 75% to agent/eXp split
- **Team-generated leads:** 50% to RESIDENCE, 50% to agent/eXp split

### 7.2 Commission Dashboard

**Display per Agent:**
- Year-to-date earned commissions (post-close)
- Pending commissions (closed but unpaid)
- Sales volume (# closed + # pending)
- Live listings with estimated commission value
- Commission breakdown by lead source
- Commission breakdown by transaction type
- eXp cap progress (current year)

---

## 8. CALENDAR INTEGRATION

### 8.1 Google Calendar Sync

**Calendar Name:** "Transactions" calendar  
**Auto-Creates:** All-day events for actionable deadlines  
**Excludes:** "Effective dates" (informational only)

**Event Details:**
- Event title: deadline type + property address
- Example: "Earnest Money Due - 123 Main St, Estero"
- Date: All-day event on deadline date
- Invitees: TC (Tina Hochstaetter - solutionsbytina7@gmail.com), partner agent on transaction
- Reminders: Notifications sent to all invited parties

**Deadline Types to Include:**
- Earnest money due dates (1st & 2nd)
- Financing deadline
- Inspection deadline
- Due diligence deadline
- Closing date
- Listing photography date
- Marketing material approval deadlines

---

## 9. EXTERNAL INTEGRATIONS & CONTACTS

### 9.1 Pre-Populated External Contacts

**Title Company:**
- Name: Amy Earl
- Company: Heights Title
- Phone: (239) 676-7523
- Email: Amy@HeightsTitle.com

**Lender:**
- Name: Gregory Zajaczkowski
- Company: Hoot Home Loans
- Phone: (239) 919-6168
- Email: GZajac@HootHomeLoans.com

**Internal TC Contact:**
- Name: Tina Hochstaetter
- Email: solutionsbytina7@gmail.com
- (Receives calendar invites and forwarded emails)

**Special Property Handler:**
- Property: 27594 Shore Dr, Bonita Springs
- Contact: Sara Denmark
- Email: saradenmarkrealtor@gmail.com
- (Forward all emails related to this property)

### 9.2 Integration Requirements

- **Skyslope:** API integration for MLS entry (requirements TBD)
- **ShowingTime:** Setup by agent, integration requirements TBD
- **Google Calendar:** OAuth for automatic calendar sync
- **Gmail/Email:** Email sending capability for notifications
- **Google Photos/MLS:** Photo upload from listing photography
- **Matterport:** Auto-loads to Homes.com (scheduled 1 week after listing goes live)
- **Homes.com:** Premium listing requirements (Kelly as primary agent for boost & free Matterport)

---

## 10. BRANDING & DESIGN

### 10.1 Logo Assets

- **residence-logo.png:** Color version for light backgrounds
- **residence-logo-white.png:** White version for dark backgrounds (TBD)
- **favicon.ico:** Square icon for browser tab

### 10.2 Branding Guidelines

Replace all text-based "RESIDENCE | eXp Realty" with logo images  
Professional signature blocks in all emails:
- Agent headshot
- Agent name
- Agent title
- Agent phone (call/text format)
- Agent email

### 10.3 Design Tokens (CSS Variables)

**Colors:**
- Primary: Indigo (#4F46E5)
- Surface: Light background for cards/surfaces
- Text Primary/Secondary/Tertiary: Text hierarchy
- Border: Subtle dividers
- Danger: Red for critical/delete actions
- Success: Green for completed actions

**Typography:**
- Multiple font sizes for hierarchy
- Weight variations (400, 500, 600, 700)
- Letter-spacing for labels

**Spacing:**
- Consistent rem-based scale
- Padding and margin standardization

**Shadows:**
- Multiple shadow levels for depth

**Z-index:**
- Defined levels for stacking context (dropdown, modal, etc.)

---

## 11. MARKET & TARGET PROPERTIES

**Geographic Market:** Southwest Florida  
**Specialty Corridor:** Corkscrew corridor of Estero

### 11.1 Specialty Communities (Kingston Branding)

Use "Kingston Kelly" nickname in marketing for:
- The Place at Corkscrew
- Verdana Village
- Corkscrew Shores
- Kingston (new community in Estero)
- Kingston South
- Esplanade at Kingston

### 11.2 Broader Service Areas

- Bonita Springs
- Fort Myers
- Naples

### 11.3 Typical Price Range

$600,000 - $1,200,000  
Focus: Master-planned communities and builder new construction

---

## 12. BUSINESS LOGIC & SPECIAL RULES

### 12.1 Lead Tracking

**Source:** Google PPC ads  
**Data Captured:** Search area & average price point stored in BoldTrail prospect profile  
**Pre-built Leads:** Auto-tasks and value-based email sequences for:
- New construction properties
- Pool homes
- Home type videos

### 12.2 Co-Agent Workflow

- Identified on Resale Buyer form
- Receives email notifications for:
  - Marketing approval requests
  - Under contract notification
  - Any relevant transaction updates

### 12.3 Marketing Approval Workflow Details

1. Agent receives "Approve" button in Resi interface
2. Each marketing material type (brochure, mailer, feature cards, social) has separate approval flow
3. Agent clicks "Approve" for individual item
4. Auto-email sent to Local Assistant (Sue McGill) with:
   - File download link
   - Task instructions specific to material type
   - Example: "Feature cards approved for [property address] — proceed with printing"

### 12.4 Photography & Marketing Timeline

**Seller Listing:**
- Photography date → Agent schedules
- Script due: 3 days before photography
- Marketing materials due: 1 day after photography
  - Brochure
  - Mailer
  - Feature cards
  - Feature list (printed by agent from Sisu)
  - MLS sheets (printed by agent)

### 12.5 Matterport & Online Presence

**Matterport Scheduling:** 1 week after listing goes live  
**Auto-loads to:** Homes.com listing  

**Homes.com Premium Requirements:**
- Requires Kelly as primary/first listing agent
- Qualifies for: Boost feature + Free Matterport

### 12.6 Property-Specific Rules

**27594 Shore Dr, Bonita Springs:**
- Forward ALL emails to Sara Denmark (saradenmarkrealtor@gmail.com)
- Special handling for title/closing communications

---

## 13. TECHNICAL SPECIFICATIONS

### 13.1 Frontend Architecture

**Framework:** React 18.2.0 + Vite 5.4.21  
**Routing:** React Router DOM v6  
**Authentication:** JWT (localStorage)  
**Styling:** CSS Custom Properties + CSS Modules  
**State Management:** Context API (TBD: Redux if needed)

**Component Structure:**
```
src/
├── components/
│   ├── Layout.jsx (sidebar + header)
│   ├── ProtectedRoute.jsx
│   ├── TaskList.jsx
│   ├── TransactionTable.jsx
│   ├── Forms/
│   │   ├── BuyerInputForm.jsx
│   │   ├── SellerListingInputForm.jsx
│   │   └── [...all other forms]
│   └── Dashboards/
│       ├── AgentDashboard.jsx
│       ├── TCDashboard.jsx
│       └── [...role-specific dashboards]
├── pages/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   └── Transactions.jsx
├── styles/
│   ├── variables.css
│   ├── globals.css
│   ├── auth.css
│   ├── dashboard.css
│   └── layout.css
├── utils/
│   ├── api.js (API calls)
│   ├── auth.js (JWT handling)
│   └── formatters.js
└── App.jsx
```

### 13.2 Backend Requirements (To Be Built)

**Framework:** Node.js + Express  
**Database:** PostgreSQL (schema TBD)  
**Authentication:** JWT generation and validation

**Required Endpoints:**
- `POST /api/auth/login` - User authentication
- `GET /api/auth/me` - Verify current session
- `GET /api/users` - List users (Admin)
- `POST /api/users` - Create user (Admin)
- `GET /api/transactions` - Get transactions (role-filtered)
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `GET /api/tasks` - Get tasks (role-filtered)
- `PUT /api/tasks/:id/complete` - Mark task complete
- `POST /api/emails` - Send email notification
- `GET /api/dashboard/[role]` - Role-specific dashboard data
- `POST /api/calendar/sync` - Google Calendar sync

### 13.3 Database Schema (TBD)

**Tables Needed:**
- users (id, email, name, role, active, created_at)
- transactions (id, type, status, agent_id, property_address, created_at, updated_at, [...phase-specific fields])
- transaction_phases (id, transaction_id, phase_name, start_date, end_date)
- tasks (id, transaction_id, task_type, assigned_to, due_date, completed_at, status)
- emails (id, template_id, recipient, transaction_id, sent_at, status)
- commissions (id, transaction_id, agent_id, amount, lead_source, status)
- [... many more TBD based on full requirements]

---

## 14. BUILD PRIORITY & PHASES

### Phase 1: Core Infrastructure (In Progress)
✅ Login.jsx  
✅ Dashboard.jsx (basic)  
✅ Layout.jsx (sidebar + header)  
✅ ProtectedRoute.jsx  
✅ CSS variables & globals  
✅ Package.json & Vite config  

### Phase 2: Core Forms
- [ ] BuyerInputForm.jsx (Resale & New Construction variants)
- [ ] SellerListingInputForm.jsx
- [ ] LandlordInputForm.jsx
- [ ] TenantInputForm.jsx
- [ ] UserEnrollmentForm.jsx

### Phase 3: Under Contract Forms
- [ ] BuyerResaleUnderContractForm.jsx
- [ ] BuyerNewConstructionUnderContractForm.jsx
- [ ] SellerUnderContractForm.jsx
- [ ] LandlordUnderContractForm.jsx
- [ ] TenantUnderContractForm.jsx

### Phase 4: Supporting Components
- [ ] TaskList.jsx + TaskFilter.jsx
- [ ] TransactionTable.jsx + TransactionDetail.jsx
- [ ] MarketingApprovalCard.jsx + ApprovalModal.jsx
- [ ] CommissionDashboard.jsx

### Phase 5: Role-Specific Dashboards
- [ ] Complete AgentDashboard with all widgets
- [ ] Complete TCDashboard
- [ ] Complete MarketingManagerDashboard
- [ ] Complete LocalAssistantDashboard
- [ ] Complete ClosingConciergeDashboard
- [ ] Complete AdminDashboard

### Phase 6: Backend Integration
- [ ] Design database schema
- [ ] Build Node.js/Express API
- [ ] Connect frontend to API
- [ ] Google Calendar sync
- [ ] Email notification system

### Phase 7: Email Templates
- [ ] Build all 20+ email templates
- [ ] Email sending service integration
- [ ] Template management interface

### Phase 8: Deployment & Launch
- [ ] GitHub setup
- [ ] Netlify frontend deployment
- [ ] Backend hosting (AWS/Railway/Heroku)
- [ ] Database hosting
- [ ] Testing & QA
- [ ] Go live

---

## 15. OUTSTANDING QUESTIONS & TBD ITEMS

### For Discussion:
1. **Closing Concierge Workflow:** What specific tasks/duties should Closing Concierge have access to per transaction type?
2. **Under Contract Form Fields:** Detailed fields for BuyerResaleUnderContractForm, SellerUnderContractForm, etc.
3. **Additional form fields:** Complete field lists for all input forms
4. **Admin configuration:** What exactly should be configurable via Admin panel?
5. **Email templates:** Final HTML email template designs and branding

### TBD Integrations:
- Skyslope API details
- ShowingTime API details
- Google Calendar OAuth scope
- Gmail API configuration
- MLS data provider integration
- Matterport integration method

### TBD Database:
- Full PostgreSQL schema design
- Field validation rules
- Audit trail logging structure
- Transaction status enum values
- Task type enum values
- Commission calculation logic

---

## 16. DOCUMENT METADATA

**Created:** 2026-09-29  
**Version:** 1.0  
**Extracted From:** Full conversation transcript (Sept 27-29)  
**All User Roles:** ✅ Verified (6 roles)  
**All Transaction Types:** ✅ Verified (4 types)  
**All Forms:** ✅ Documented  
**All Workflows:** ✅ Documented  
**All Email Templates:** ✅ Listed  
**Commission Structure:** ✅ Documented  
**Dashboard Specifications:** ✅ Documented  

---

This document serves as the complete specification for the Resi transaction management platform. Refer to specific sections for implementation details during each build phase.
