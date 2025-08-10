//server/app.js

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// ✅ Allowed origins list
const allowedOrigins = [
  'http://localhost:3000', // local dev
  'https://pizza-app-frontend-ebon.vercel.app', // old Vercel frontend
  'https://pizza-app-frontend-jzcn.vercel.app'  // new Vercel frontend
];

// ✅ Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// ✅ Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pizza-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// ✅ API Routes
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const authRoutes = require('./routes/authRoutes');
const pizzaRoutes = require('./routes/pizzaRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const userRoutes = require('./routes/userRouters');

app.use('/api/auth', authRoutes);
app.use('/api/pizza', pizzaRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/user', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);

// ✅ Root Test Routes
app.get('/api', (req, res) => {
  res.send('🚀 API is running...');
});

app.get('/', (req, res) => {
  res.send('👋 Welcome to the Pizza Delivery API Server!');
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error('🔥 Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// ✅ Start Server
const PORT = process.env.PORT || 55000;
app.listen(PORT, () => console.log(`🍕 Server running on port ${PORT}`));

app.listen(PORT, () => console.log(`🍕 Server running on port ${PORT}`));
