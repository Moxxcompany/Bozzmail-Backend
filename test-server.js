const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Mock JWT middleware
const validateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  const token = authHeader.split(' ')[1];
  
  // For testing, accept any token that starts with 'test-'
  if (token.startsWith('test-')) {
    req.userId = 'test-user-id';
    next();
  } else {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Mock data
const mockUserProfile = {
  id: 'test-user-id',
  fullName: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  profileImage: null,
  walletId: 'wallet-123',
  isActive: true
};

const mockShipments = [
  {
    id: 'shipment-1',
    trackingNumber: 'TRK123456789',
    status: 'in_transit',
    carrier: 'UPS',
    origin: 'New York, NY',
    destination: 'Los Angeles, CA',
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 'shipment-2',
    trackingNumber: 'TRK987654321',
    status: 'delivered',
    carrier: 'FedEx',
    origin: 'Chicago, IL',
    destination: 'Miami, FL',
    created_at: '2024-01-10T14:20:00Z'
  },
  {
    id: 'shipment-3',
    trackingNumber: 'TRK456789123',
    status: 'pending',
    carrier: 'DHL',
    origin: 'Seattle, WA',
    destination: 'Boston, MA',
    created_at: '2024-01-20T09:15:00Z'
  }
];

const mockTransactions = [
  {
    id: 'txn-1',
    amount: 25.50,
    status: 'successful',
    type: 'shipment_purchase',
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 'txn-2',
    amount: 18.75,
    status: 'successful',
    type: 'shipment_purchase',
    created_at: '2024-01-10T14:20:00Z'
  },
  {
    id: 'txn-3',
    amount: 32.00,
    status: 'successful',
    type: 'wallet_fund',
    created_at: '2024-01-05T16:45:00Z'
  }
];

const mockNotifications = [
  {
    id: 'notif-1',
    title: 'Shipment Delivered',
    message: 'Your shipment TRK987654321 has been delivered',
    isRead: false,
    created_at: '2024-01-12T15:30:00Z'
  },
  {
    id: 'notif-2',
    title: 'New Label Created',
    message: 'Your shipping label has been created successfully',
    isRead: true,
    created_at: '2024-01-15T10:30:00Z'
  }
];

const mockAddressBook = [
  {
    id: 'addr-1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '+1234567890',
    address: '123 Main St, New York, NY 10001'
  },
  {
    id: 'addr-2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    phone: '+1987654321',
    address: '456 Oak Ave, Los Angeles, CA 90210'
  }
];

// Dashboard endpoints
app.get('/api/user/dashboard/stats', validateToken, (req, res) => {
  const totalLabels = mockShipments.length;
  const inTransit = mockShipments.filter(s => s.status === 'in_transit').length;
  const monthlySpend = mockTransactions
    .filter(t => t.status === 'successful')
    .reduce((sum, t) => sum + t.amount, 0);
  const savedContacts = mockAddressBook.length;
  
  res.json({
    data: {
      totalLabels,
      inTransit,
      monthlySpend,
      savedContacts
    }
  });
});

app.get('/api/user/shipments/recent', validateToken, (req, res) => {
  const limit = parseInt(req.query.limit) || 5;
  const recentShipments = mockShipments.slice(0, limit);
  
  res.json({
    data: recentShipments,
    total: mockShipments.length
  });
});

app.get('/api/user/profile/summary', validateToken, (req, res) => {
  res.json({
    data: mockUserProfile
  });
});

app.get('/api/user/details', validateToken, (req, res) => {
  res.json({
    data: mockUserProfile
  });
});

app.get('/api/user/payment/wallet-balance', validateToken, (req, res) => {
  res.json({
    balance: 150.25
  });
});

app.get('/api/user/payment/transactions', validateToken, (req, res) => {
  res.json({
    data: mockTransactions
  });
});

app.get('/api/user/notifications', validateToken, (req, res) => {
  res.json({
    data: mockNotifications
  });
});

app.get('/api/address', validateToken, (req, res) => {
  res.json(mockAddressBook);
});

// Start server
app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('- GET /api/user/dashboard/stats');
  console.log('- GET /api/user/shipments/recent');
  console.log('- GET /api/user/profile/summary');
  console.log('- GET /api/user/details');
  console.log('- GET /api/user/payment/wallet-balance');
  console.log('- GET /api/user/payment/transactions');
  console.log('- GET /api/user/notifications');
  console.log('- GET /api/address');
}); 