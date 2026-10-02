// Mock transaction data
export const mockTransactions = [
  // BUYER - RESALE TRANSACTIONS
  {
    id: 'txn-001',
    type: 'buyer-resale',
    agent: 'user-002', // Amanda
    status: 'under-contract',
    propertyAddress: '27594 Shore Dr, Bonita Springs, FL 34134',
    propertyCity: 'Bonita Springs',
    county: 'Lee',
    transactionType: 'resale',
    buyerPrimary: 'John Smith',
    buyerEmail: 'john.smith@email.com',
    sellerName: 'Robert Wilson',
    cooperatingAgent: 'TBD',
    contractDate: '2026-09-15',
    closingDate: '2026-11-15',
    purchasePrice: 850000,
    earnestMoney: 25000,
    earnestMoneyDueDate: '2026-09-22',
    inspectionDeadline: '2026-10-01',
    financingDeadline: '2026-11-01',
    commission: 25500, // 3%
    commissionType: 'agent-generated',
    leadSource: 'sphere-of-influence',
    createDate: '2026-09-15',
    tasks: ['txn-001-task-1', 'txn-001-task-2', 'txn-001-task-3'],
  },
  {
    id: 'txn-002',
    type: 'buyer-resale',
    agent: 'user-003', // James
    status: 'under-contract',
    propertyAddress: '12450 Collier Blvd, Naples, FL 34119',
    propertyCity: 'Naples',
    county: 'Collier',
    transactionType: 'resale',
    buyerPrimary: 'Elizabeth Brown',
    buyerEmail: 'elizabeth.brown@email.com',
    sellerName: 'Margaret Davis',
    cooperatingAgent: 'TBD',
    contractDate: '2026-09-10',
    closingDate: '2026-11-10',
    purchasePrice: 950000,
    earnestMoney: 28000,
    earnestMoneyDueDate: '2026-09-17',
    inspectionDeadline: '2026-09-28',
    financingDeadline: '2026-10-28',
    commission: 28500,
    commissionType: 'team-generated',
    leadSource: 'google-ppc',
    createDate: '2026-09-10',
    tasks: [],
  },
  {
    id: 'txn-003',
    type: 'buyer-resale',
    agent: 'user-004', // Sarah
    status: 'closed',
    propertyAddress: '8765 Grand Bay Court, Estero, FL 33928',
    propertyCity: 'Estero',
    county: 'Lee',
    transactionType: 'resale',
    buyerPrimary: 'David Garcia',
    buyerEmail: 'david.garcia@email.com',
    sellerName: 'Christopher Moore',
    cooperatingAgent: 'TBD',
    contractDate: '2026-07-15',
    closingDate: '2026-09-15',
    purchasePrice: 725000,
    earnestMoney: 21500,
    earnestMoneyDueDate: '2026-07-22',
    inspectionDeadline: '2026-07-31',
    financingDeadline: '2026-08-31',
    commission: 21750,
    commissionType: 'agent-generated',
    leadSource: 'farming',
    createDate: '2026-07-15',
    tasks: [],
  },

  // BUYER - NEW CONSTRUCTION TRANSACTIONS
  {
    id: 'txn-004',
    type: 'buyer-new-construction',
    agent: 'user-002', // Amanda
    status: 'under-contract',
    propertyAddress: 'Kingston at Estero - Lot 45, Estero, FL 33928',
    propertyCity: 'Estero',
    county: 'Lee',
    transactionType: 'new-construction',
    builderName: 'Lennar',
    community: 'Kingston at Estero',
    lotNumber: '45',
    floorPlan: 'Azalea',
    buyerPrimary: 'Michael Anderson',
    buyerEmail: 'michael.anderson@email.com',
    contractDate: '2026-08-01',
    closingDate: '2026-12-01',
    purchasePrice: 650000,
    selectionsCompleted: true,
    builderMeetingDate: '2026-10-15',
    blueTapeWalkthrough: '2026-11-15',
    commission: 19500,
    commissionType: 'agent-generated',
    leadSource: 'personal-referral',
    createDate: '2026-08-01',
    tasks: ['txn-004-task-1'],
  },
  {
    id: 'txn-005',
    type: 'buyer-new-construction',
    agent: 'user-003', // James
    status: 'pending',
    propertyAddress: 'Kingston South - Lot 12, Estero, FL 33928',
    propertyCity: 'Estero',
    county: 'Lee',
    transactionType: 'new-construction',
    builderName: 'Meritage Homes',
    community: 'Kingston South',
    lotNumber: '12',
    floorPlan: 'Caladium',
    buyerPrimary: 'Jennifer Martinez',
    buyerEmail: 'jennifer.martinez@email.com',
    contractDate: '2026-09-20',
    closingDate: '2027-01-20',
    purchasePrice: 725000,
    selectionsCompleted: false,
    commission: 21750,
    commissionType: 'team-generated',
    leadSource: 'listing-meta-ad',
    createDate: '2026-09-20',
    tasks: [],
  },

  // SELLER TRANSACTIONS
  {
    id: 'txn-006',
    type: 'seller',
    agent: 'user-004', // Sarah
    status: 'listing-active',
    propertyAddress: '5678 Island Harbor Lane, Bonita Springs, FL 34134',
    propertyCity: 'Bonita Springs',
    county: 'Lee',
    listingPrice: 1200000,
    propertyType: 'single-family',
    yearBuilt: 2015,
    squareFootage: 4250,
    bedrooms: 4,
    bathrooms: 3,
    anticipatedListingDate: '2026-09-25',
    photographyDate: '2026-09-22',
    listingVideoScriptDueDate: '2026-09-19',
    showingTimeSetupDate: '2026-09-25',
    daysOnMarket: 5,
    coListAgent: 'user-005', // Michael
    createDate: '2026-09-20',
    tasks: ['txn-006-task-1', 'txn-006-task-2'],
  },
  {
    id: 'txn-007',
    type: 'seller',
    agent: 'user-005', // Michael
    status: 'under-contract',
    propertyAddress: '3456 Corkscrew Rd, Estero, FL 33928',
    propertyCity: 'Estero',
    county: 'Lee',
    listingPrice: 495000,
    propertyType: 'condo',
    yearBuilt: 2010,
    squareFootage: 1850,
    bedrooms: 2,
    bathrooms: 2,
    anticipatedListingDate: '2026-08-15',
    photographyDate: '2026-08-12',
    listingVideoScriptDueDate: '2026-08-09',
    showingTimeSetupDate: '2026-08-15',
    listingDate: '2026-08-15',
    daysOnMarket: 32,
    soldPrice: 480000,
    createDate: '2026-08-10',
    tasks: [],
  },

  // LANDLORD TRANSACTIONS
  {
    id: 'txn-008',
    type: 'landlord',
    agent: 'user-002', // Amanda
    status: 'active',
    propertyAddress: '27594 Shore Dr, Bonita Springs, FL 34134',
    propertyCity: 'Bonita Springs',
    county: 'Lee',
    propertyType: 'multi-unit',
    landlordName: 'Catherine Walsh',
    landlordEmail: 'catherine.walsh@email.com',
    landlordPhone: '239-555-1001',
    businessName: 'Shore Properties LLC',
    managementCompany: 'Southwest Property Management',
    annualRentIncome: 145000,
    createDate: '2026-09-01',
    tasks: [],
  },

  // TENANT TRANSACTIONS
  {
    id: 'txn-009',
    type: 'tenant',
    agent: 'user-004', // Sarah
    status: 'searching',
    tenantName: 'Robert Johnson',
    tenantEmail: 'robert.johnson@email.com',
    tenantPhone: '239-555-2001',
    budgetMin: 2000,
    budgetMax: 3500,
    bedroomPreference: '2-3',
    bathroomPreference: '2',
    locationPreferences: 'Estero, Bonita Springs',
    desiredMoveDate: '2026-11-01',
    createDate: '2026-09-15',
    tasks: [],
  },
];

export const getTransactionsByAgent = (agentId) => {
  return mockTransactions.filter(t => t.agent === agentId);
};

export const getTransactionsByStatus = (status) => {
  return mockTransactions.filter(t => t.status === status);
};

export const getTransactionById = (id) => {
  return mockTransactions.find(t => t.id === id);
};

export const getTransactionsByType = (type) => {
  return mockTransactions.filter(t => t.type === type);
};
