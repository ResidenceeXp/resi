# 🚀 QUICK START - Get Running in 5 Minutes

## Step 1: Install (1 minute)
```bash
npm install
```

## Step 2: Start Server (30 seconds)
```bash
npm start
```

Browser will open to http://localhost:3000

## Step 3: Login (30 seconds)

Use **one** of these:

```
Email: kelly.olin@eXpRealty.com
Password: password123
(Admin - Full Access)

OR

Email: amanda@residence.local
Password: password123
(Agent)

OR

Email: patricia@residence.local
Password: password123
(Transaction Coordinator)
```

## That's It! 🎉

You now have:
- ✅ 6 role-specific dashboards
- ✅ 7 transaction forms
- ✅ Task management system
- ✅ Mock data with 11 users
- ✅ 9 sample transactions
- ✅ Complete authentication

## Explore

### As Admin (kelly.olin@eXpRealty.com)
- See all users
- Access all forms
- View system overview

### As Agent (amanda@residence.local)
- Create buyer transactions
- Track listings
- Manage your tasks

### As Coordinator (patricia@residence.local)
- Enter MLS/Skyslope data
- Manage deadlines
- View all transactions

## Next Steps

1. **Test Different Roles** - Login as each user to see different views
2. **Try Forms** - Create a test buyer transaction
3. **Check Tasks** - View the task management system
4. **Read README.md** - Full feature documentation
5. **Deploy** - See DEPLOYMENT_GUIDE.md for production

## Features At a Glance

### Dashboards
- 📊 Agent: YTD closed, commissions, listings
- 📋 TC: Skyslope/MLS tracking, deadlines
- 🎨 Marketing: Content approvals, asset tracking
- 📦 Assistant: Print distribution tasks
- 🏁 Concierge: Closing coordination
- ⚙️ Admin: System metrics, team management

### Forms
- 👥 Buyer Input (Resale & New Construction)
- 🏠 Seller Listing
- 🏘️ Landlord Input
- 👤 Tenant Input
- 📄 Buyer Resale Under-Contract
- 🆕 Buyer New Construction Under-Contract
- 👨‍💼 User Enrollment

### Core Features
- ✅ Role-based access control
- ✅ Task filtering & management
- ✅ Auto-calculated deadlines
- ✅ Form validation
- ✅ Responsive design
- ✅ Mock API
- ✅ Complete test data

## Files You'll Use

```
App.jsx                  Main application
LoginPage.jsx           Login screen
components/
  AgentDashboard.jsx    Agent view
  TCDashboard.jsx       Coordinator view
  *Dashboard.jsx        Other role views
  forms/                All transaction forms
  TaskList.jsx          Task management
utils/
  authUtils.js          Login/auth logic
  apiUtils.js           Mock API
data/
  mockUsers.js          Test users
  mockTransactions.js   Sample data
  mockTasks.js          Tasks
```

## Stuck?

1. Check **README.md** for detailed docs
2. Check **DEPLOYMENT_GUIDE.md** for production setup
3. See browser console for errors (F12)
4. Clear browser cache if pages look broken

## Ready to Deploy?

When ready for production:
```bash
npm run build
```

Then follow **DEPLOYMENT_GUIDE.md** for your hosting platform (Vercel, Netlify, etc.)

---

**Questions?** Everything is documented in the markdown files. Happy building! 🚀
