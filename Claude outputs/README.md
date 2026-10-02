# RESIDENCE | eXp Realty - Transaction Management System

A complete, production-ready React application for managing real estate transactions across all team roles.

## Features

### Six Role-Based Dashboards
- **Agent Dashboard**: Transaction tracking, commission metrics, task management
- **Transaction Coordinator Dashboard**: Skyslope/MLS entry tracking, deadline management
- **Marketing Manager Dashboard**: Content approval queue, asset creation tracking
- **Local Assistant Dashboard**: Print distribution and task workflow
- **Closing Concierge Dashboard**: Closing coordination and checklist management
- **Admin Dashboard**: System-wide metrics, user management, transaction overview

### Core Functionality
- 7 comprehensive transaction forms (Buyer, Seller, Landlord, Tenant, Under-Contract workflows)
- Role-based access control with 6 distinct user roles
- Task management system with filtering, priority, and status tracking
- Mock backend API with persistence across session
- JWT-like authentication with token management
- Responsive design with mobile support

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm start
```

The application will open at `http://localhost:3000`

### 3. Login Credentials

**Admin (Full Access)**
- Email: kelly.olin@eXpRealty.com
- Password: password123

**Agent**
- Email: amanda@residence.local
- Password: password123

**Transaction Coordinator**
- Email: patricia@residence.local
- Password: password123

**Marketing Manager**
- Email: stacey@residence.local
- Password: password123

**Local Assistant**
- Email: sue@residence.local
- Password: password123

**Closing Concierge**
- Email: diana@residence.local
- Password: password123

## Architecture

### Folder Structure
```
src/
├── components/
│   ├── AgentDashboard.jsx
│   ├── TCDashboard.jsx
│   ├── MarketingManagerDashboard.jsx
│   ├── LocalAssistantDashboard.jsx
│   ├── ClosingConciergeDashboard.jsx
│   ├── AdminDashboard.jsx
│   ├── TaskList.jsx
│   ├── TaskItem.jsx
│   ├── TaskFilter.jsx
│   └── forms/
│       ├── BuyerInputForm.jsx
│       ├── SellerListingInputForm.jsx
│       ├── LandlordInputForm.jsx
│       ├── TenantInputForm.jsx
│       ├── BuyerResaleUnderContractForm.jsx
│       ├── BuyerNewConstructionUnderContractForm.jsx
│       └── UserEnrollmentForm.jsx
├── data/
│   ├── mockUsers.js (11 test users with credentials)
│   ├── mockTransactions.js (9 sample transactions)
│   └── mockTasks.js (20+ tasks across all roles)
├── hooks/
│   └── useTaskManagement.js (Task filtering and management)
├── utils/
│   ├── authUtils.js (JWT token, login/logout)
│   └── apiUtils.js (Mock API with CRUD operations)
├── styles/
│   └── forms.css (Form styling with CSS variables)
├── pages/
│   └── LoginPage.jsx
└── App.jsx (Main app with routing)
```

### Key Technologies
- **React 18.2**: Latest React with hooks
- **React Router v6**: Client-side navigation
- **Mock Backend**: Mock API simulating real endpoints
- **CSS-in-JS & External CSS**: Flexible styling
- **localStorage**: Client-side authentication persistence

## User Roles & Permissions

### Agent
- View own transactions
- Create new transactions
- Manage own tasks
- Approve marketing assets

### Transaction Coordinator (TC)
- View all transactions
- Manage deadlines
- Enter Skyslope/MLS data
- Manage system tasks

### Marketing Manager
- Create marketing content
- Approve workflow items
- Manage marketing tasks
- Track asset creation

### Local Assistant
- Manage print distribution
- Complete assigned tasks
- Track distribution status

### Closing Concierge
- View assigned transactions
- Manage closing checklists
- Coordinate closing workflow

### Admin
- Full system access
- User management
- View all transactions
- System analytics

## Form Workflows

### Buyer Input Form
- Supports Resale & New Construction transactions
- Primary buyer + up to 3 additional contacts
- Lead source tracking
- Property details with validation
- Conditional fields for builder new construction

### Seller Listing Form
- Auto-calculated video script deadline
- Photography and ShowingTime dates
- Co-list agent assignment
- Listing notes and special instructions

### Under-Contract Forms
- Buyer Resale: Contract details, earnest money, closing team
- Buyer New Construction: Builder coordination, warranty tracking

### Additional Forms
- Landlord Input: Property management & rental income
- Tenant Input: Search criteria & preferences
- User Enrollment: Admin tool for team onboarding

## Task Management

### Features
- Filter by status, priority, date range
- Sort by due date, priority, or status
- Search by description or transaction ID
- Overdue tracking with visual indicators
- Bulk status updates

### Task Types
- Transaction-related (create social media, confirm earnest money)
- TC tasks (enter Skyslope, enter MLS)
- Marketing tasks (create brochure, feature cards)
- Closing tasks (prepare checklists)
- Distribution tasks (print and distribute)

## API Mock Handler

The mock API (`apiUtils.js`) provides:
- Authentication endpoints (login/logout)
- Transaction CRUD operations
- Task CRUD operations
- User listing
- Persistent mock data across session

Simulates real API responses with 300ms network delay.

## Production Deployment

### Prerequisites
- Node.js 14+ 
- npm or yarn

### Build for Production
```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

### Deploy to Production
Choose your preferred hosting:

**Vercel** (Recommended for React)
```bash
npm install -g vercel
vercel
```

**Netlify**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

**Traditional Server (Apache/Nginx)**
1. Copy contents of `build/` to your web server
2. Configure server to serve `index.html` for all routes (for React Router)

### Environment Configuration
For production, update the API base URL in `apiUtils.js`:
```javascript
const API_BASE = 'https://your-api-server.com/api';
```

## Customization

### Update Company Branding
1. Modify app name in `App.jsx`, `LoginPage.jsx`
2. Update logo and colors in components
3. Adjust sidebar navigation

### Add Users
Edit `mockUsers.js` to add team members:
```javascript
{
  id: 'user-XXX',
  firstName: 'Name',
  lastName: 'Surname',
  email: 'email@company.com',
  password: 'password123',
  role: 'agent|tc|marketing|assistant|concierge|admin',
  team: 'Team Name',
  permissions: [...]
}
```

### Add Transactions
Edit `mockTransactions.js` to add sample data for testing.

### Customize Form Fields
Each form component accepts `currentUser` prop. Modify form sections or validation rules as needed.

## Testing

The application comes with sample data representing:
- 11 users across 6 roles
- 9 transactions covering all 4 transaction types
- 20+ tasks for various roles and statuses

Navigate through different user roles to see role-specific views and features.

## Troubleshooting

**Login fails**: Verify email and password match exactly (case-sensitive)

**Styles not loading**: Check that CSS files are in the correct import path

**Routes not working**: Ensure React Router is properly installed (`npm install react-router-dom`)

**API errors**: Check browser console for mock API handler errors

## Support

For issues or questions:
1. Check the console for error messages
2. Verify all dependencies are installed (`npm install`)
3. Clear browser cache and localStorage
4. Restart the development server

## License

Proprietary software for RESIDENCE | eXp Realty
