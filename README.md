# 🌾 Krishi Market — Farmer to Consumer Marketplace

A full-stack web application connecting farmers directly with consumers. Built with Next.js, Node.js/Express, and MongoDB.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (React), Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Auth | JWT + bcrypt |
| HTTP Client | Axios |
| Charts | Recharts |
| Deployment | Vercel (frontend) + Render (backend) + MongoDB Atlas |

---

## 📁 Project Structure

```
krishi-market/
├── backend/
│   ├── models/
│   │   ├── User.js          # User schema (customer/farmer/admin)
│   │   ├── FarmerProfile.js # Farmer details
│   │   ├── Product.js       # Product listings
│   │   ├── Cart.js          # Shopping cart
│   │   └── Order.js         # Orders with status tracking
│   ├── routes/
│   │   ├── auth.js          # Register, Login, Profile
│   │   ├── products.js      # CRUD for products
│   │   ├── cart.js          # Cart operations
│   │   ├── orders.js        # Order creation & management
│   │   ├── farmers.js       # Farmer profiles
│   │   └── admin.js         # Admin management
│   ├── middleware/
│   │   └── auth.js          # JWT protect, role authorize
│   ├── server.js            # Express app entry
│   ├── seed.js              # Demo data seed
│   └── package.json
│
└── frontend/
    ├── pages/
    │   ├── index.js              # Home page
    │   ├── auth/
    │   │   ├── login.js          # Login
    │   │   └── register.js       # Registration
    │   ├── products/
    │   │   ├── index.js          # Product listing
    │   │   └── [id].js           # Product detail
    │   ├── farmers/
    │   │   └── [id].js           # Farmer public profile
    │   ├── customer/
    │   │   ├── cart.js           # Shopping cart
    │   │   ├── checkout.js       # Checkout + address
    │   │   └── dashboard.js      # Orders + tracking
    │   ├── farmer/
    │   │   ├── dashboard.js      # Farmer overview + analytics
    │   │   ├── products.js       # Manage products
    │   │   ├── add-product.js    # Add product form
    │   │   ├── edit-product/[id].js # Edit product
    │   │   ├── orders.js         # Manage incoming orders
    │   │   └── profile.js        # Farm profile
    │   └── admin/
    │       └── dashboard.js      # Admin panel
    ├── components/
    │   ├── common/
    │   │   ├── Navbar.js
    │   │   ├── ProductCard.js
    │   │   └── StatusBadge.js
    │   └── farmer/
    │       └── FarmerSidebar.js
    └── lib/
        ├── api.js               # Axios + all API functions
        └── auth.js              # Auth context + hooks
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Clone & Install

```bash
# Backend
cd krishi-market/backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

**Backend** — create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/krishi-market
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

**Frontend** — create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Seed Demo Data (optional)

```bash
cd backend
node seed.js
```

### 4. Run Servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

App is at: http://localhost:3000  
API is at: http://localhost:5000

---

## 👤 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@krishi.com | admin123 |
| Farmer | ramesh@farm.com | farmer123 |
| Customer | customer@demo.com | customer123 |

---

## 🔐 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all (paginated, filterable) |
| GET | `/api/products/:id` | Product detail |
| POST | `/api/products` | Create (Farmer only) |
| PUT | `/api/products/:id` | Update (Farmer only) |
| DELETE | `/api/products/:id` | Delete (Farmer only) |
| GET | `/api/products/farmer/my-products` | Farmer's own products |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get cart |
| POST | `/api/cart/add` | Add to cart |
| PUT | `/api/cart/update` | Update quantity |
| DELETE | `/api/cart/remove` | Remove item |
| DELETE | `/api/cart/clear` | Clear cart |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders/create` | Place order |
| GET | `/api/orders/customer` | Customer's orders |
| GET | `/api/orders/farmer` | Farmer's received orders |
| PUT | `/api/orders/update-status` | Update order status |
| GET | `/api/orders/farmer/stats` | Sales statistics |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Platform analytics |
| GET | `/api/admin/farmers/pending` | Pending approvals |
| PUT | `/api/admin/farmers/approve/:id` | Approve farmer |
| GET | `/api/admin/users` | All users |
| GET | `/api/admin/orders` | All orders |

---

## 📦 Order Status Flow

```
Pending → Confirmed → Packed → Out for Delivery → Delivered
    └──────────────────────────────────────────→ Cancelled
```

---

## 🌐 Deployment

### Deploy Backend to Render

1. Push backend to GitHub
2. Create Web Service on render.com
3. Set environment variables:
   - `MONGODB_URI` (MongoDB Atlas connection string)
   - `JWT_SECRET`
   - `FRONTEND_URL` (Vercel URL)
4. Build command: `npm install`
5. Start command: `node server.js`

### Deploy Frontend to Vercel

1. Push frontend to GitHub
2. Import project on vercel.com
3. Set environment variable:
   - `NEXT_PUBLIC_API_URL` = Render backend URL + `/api`
4. Deploy

### MongoDB Atlas Setup

1. Create cluster at mongodb.com/atlas
2. Create database user
3. Whitelist all IPs (0.0.0.0/0) or specific Render IPs
4. Copy connection string to `MONGODB_URI`

---

## ✨ Features

### Customer
- ✅ Browse & search products by category
- ✅ Filter by organic / search text
- ✅ Product detail page with farmer info
- ✅ Add to cart with quantity control
- ✅ Checkout with address & delivery slot
- ✅ Order tracking with status timeline
- ✅ Order history dashboard

### Farmer
- ✅ Register & await admin approval
- ✅ Create/update farm profile
- ✅ Add products with image upload
- ✅ Edit/delete products, toggle visibility
- ✅ View & manage incoming orders
- ✅ Update order status step by step
- ✅ Sales analytics dashboard

### Admin
- ✅ Approve/reject farmer registrations
- ✅ View platform stats (users, revenue, orders)
- ✅ Monitor all orders
- ✅ Manage users

---

## 🔒 Security

- Passwords hashed with bcrypt (12 rounds)
- JWT tokens (7-day expiry)
- Role-based route protection
- Input validation with express-validator
- File upload type/size restrictions

---

Built with ❤️ for Indian farmers
