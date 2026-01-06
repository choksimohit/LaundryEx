# 🧺 LaundryEx - Laundry Management E-Commerce Platform

<div align="center">

![LaundryEx Logo](https://via.placeholder.com/150x150.png?text=LaundryEx)

**A modern, full-stack laundry service management platform built with React and FastAPI**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green.svg)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.x-brightgreen.svg)](https://www.mongodb.com/)

[Live Demo](https://your-demo-url.com) • [Documentation](#) • [Report Bug](#) • [Request Feature](#)

</div>

---

## 📖 What is LaundryEx?

**LaundryEx** is a comprehensive, multi-business laundry management platform that enables customers to order laundry services online and businesses to manage their operations efficiently. The platform provides a seamless experience from order placement to delivery, with integrated payment processing and automated email notifications.

### 🎯 Problem it Solves

Traditional laundry services face challenges with:
- Manual order management and tracking
- Limited payment options
- Poor customer communication
- Difficulty managing multiple service types and pricing

LaundryEx addresses these issues with a modern, automated solution that benefits both customers and laundry service providers.

---

## ✨ Key Features

### 👤 Customer Features
- 🔐 **User Authentication** - Secure registration and login with JWT tokens
- 📍 **Postcode Service Check** - Verify service availability in your area
- 🛍️ **Smart Product Catalog** - Browse 127+ laundry items organized by category and subcategory
  - Dry Cleaning
  - Wash & Iron
  - Ironing
  - Household & Bulk Laundry
- 🛒 **Shopping Cart** - Add, update, and manage items before checkout
- 📅 **Flexible Scheduling** - Choose convenient pickup and delivery times
- 💳 **Multiple Payment Options**
  - Cash on Delivery (COD)
  - Credit/Debit Card via Stripe
- 📧 **Email Notifications** - Receive order confirmations and status updates
- 📦 **Order Tracking** - View order history and current status in dashboard
- 🔢 **6-Digit Order Numbers** - Easy-to-remember order references

### 🔧 Admin Features
- 📊 **Admin Dashboard** - Overview of business statistics
- 👥 **User Management** - View and manage customer accounts
- 📦 **Order Management** - Update order status with automatic customer notifications
- 🏷️ **Product Management** - Full CRUD operations for products
  - Add, edit, delete products
  - Set custom pricing per business
  - Upload product images
- 🔄 **Drag-and-Drop Ordering** - Customize product display order within categories
- 📈 **Business Analytics** - Track orders, revenue, and performance
- 🎯 **Multi-Business Support** - Manage multiple laundry businesses
- 📍 **Postcode Management** - Configure service areas

### 🎨 Design Features
- 📱 **Fully Responsive** - Works seamlessly on mobile, tablet, and desktop
- 🎨 **Modern UI** - Clean, intuitive interface with Tailwind CSS
- 🌈 **Brand Colors** - Consistent blue and white theme
- ✉️ **Beautiful Email Templates** - Professional HTML emails with brand styling
- ♿ **Accessible** - WCAG compliant design

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18.x
- **Routing:** React Router v6
- **Styling:** Tailwind CSS 3.x
- **UI Components:** Shadcn/ui
- **Icons:** Lucide React
- **Notifications:** Sonner (Toast notifications)
- **Payments:** Stripe React Elements
- **Build Tool:** Craco
- **HTTP Client:** Axios

### Backend
- **Framework:** FastAPI 0.115
- **Language:** Python 3.12
- **Database:** MongoDB with Motor (async driver)
- **Authentication:** JWT (python-jose)
- **Password Hashing:** Passlib with bcrypt
- **Payments:** Stripe Python SDK
- **Email:** Resend API
- **Validation:** Pydantic v2
- **CORS:** FastAPI CORS Middleware

### Infrastructure
- **Database:** MongoDB (local or Atlas)
- **Process Manager:** Supervisor
- **Web Server:** Uvicorn
- **Environment:** Python venv
- **Package Management:** pip (backend), yarn (frontend)

---

## 🚀 Setup & Installation

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.12 or higher) - [Download](https://www.python.org/)
- **MongoDB** (v7 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Yarn** package manager - `npm install -g yarn`

### 📥 Clone the Repository

```bash
git clone https://github.com/yourusername/laundryex.git
cd laundryex
```

### 🔧 Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Create and activate virtual environment:**
```bash
python -m venv venv

# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Create `.env` file:**
```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your configuration
```

5. **Configure environment variables in `.env`:**
```env
MONGO_URL="mongodb://localhost:27017"
DB_NAME="laundry_express_db"
CORS_ORIGINS="*"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_ALGORITHM="HS256"
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"
RESEND_API_KEY="re_your_resend_api_key"
SENDER_EMAIL="support@laundry-express.co.uk"
ADMIN_EMAIL="support@laundry-express.co.uk"
```

6. **Seed the database with sample data:**
```bash
python seed_from_csv.py
```

This will create:
- Admin user: `admin@laundry-express.co.uk` / `admin123`
- 127 products across all categories
- Sample business with service areas

### 🎨 Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd ../frontend
```

2. **Install dependencies:**
```bash
yarn install
```

3. **Create `.env` file:**
```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your configuration
```

4. **Configure environment variables in `.env`:**
```env
REACT_APP_BACKEND_URL=http://localhost:8001
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

---

## 🏃 Running the Application

### Option 1: Run Both Services with Supervisor (Recommended)

If you're using the provided supervisor configuration:

```bash
# Start all services
sudo supervisorctl start all

# Check status
sudo supervisorctl status

# View logs
tail -f /var/log/supervisor/backend.log
tail -f /var/log/supervisor/frontend.log
```

### Option 2: Run Services Manually

#### Start Backend

```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

The backend API will be available at: **http://localhost:8001**

API Documentation (Swagger): **http://localhost:8001/docs**

#### Start Frontend

```bash
cd frontend
yarn start
```

The frontend will be available at: **http://localhost:3000**

### 🎉 Access the Application

- **Customer Portal:** http://localhost:3000
- **Admin Panel:** http://localhost:3000/admin
- **API Docs:** http://localhost:8001/docs

**Default Admin Credentials:**
- Email: `admin@laundry-express.co.uk`
- Password: `admin123`

**Test Postcodes:** CO27FQ, CO1, CO2, CO3, CO4, CO5

---

## 🧪 Testing

### Backend Tests

```bash
cd backend
pytest
```

### Frontend Tests

```bash
cd frontend
yarn test
```

### E2E Tests

```bash
yarn test:e2e
```

---

## 📁 Project Structure

```
laundryex/
├── backend/
│   ├── server.py              # FastAPI main application
│   ├── email_service.py       # Email notification service
│   ├── seed_from_csv.py       # Database seeding script
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Backend environment variables
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── ui/           # Shadcn UI components
│   │   │   ├── Navbar.js
│   │   │   └── Footer.js
│   │   ├── pages/            # Page components
│   │   │   ├── Landing.js
│   │   │   ├── Products.js
│   │   │   ├── Cart.js
│   │   │   ├── Checkout.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Admin.js
│   │   │   └── ProductManagement.js
│   │   ├── utils/
│   │   │   └── api.js        # API client configuration
│   │   ├── App.js            # Main app component
│   │   └── index.js          # Entry point
│   ├── package.json
│   ├── tailwind.config.js
│   └── .env                  # Frontend environment variables
│
└── README.md
```

---

## 🔐 Security Best Practices

### For Development
- ✅ Use test Stripe keys (prefix: `sk_test_`, `pk_test_`)
- ✅ Keep `.env` files in `.gitignore`
- ✅ Use strong JWT secrets
- ✅ Enable CORS only for trusted origins

### For Production
- 🔒 Use HTTPS/SSL certificates
- 🔒 Rotate JWT secrets regularly
- 🔒 Use production Stripe keys
- 🔒 Implement rate limiting
- 🔒 Enable database authentication
- 🔒 Set up monitoring and logging
- 🔒 Use environment-specific configurations
- 🔒 Verify email domain in Resend

---

## 🌐 Deployment

### Recommended Platforms

**Quick Deploy (Easiest):**
- Frontend: [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
- Backend: [Railway](https://railway.app) or [Render](https://render.com)
- Database: [MongoDB Atlas](https://mongodb.com/cloud/atlas)

**Self-Hosted:**
- [DigitalOcean App Platform](https://digitalocean.com/products/app-platform)
- [AWS EC2 + S3 + DocumentDB](https://aws.amazon.com)
- [Google Cloud Run](https://cloud.google.com/run)

### Deployment Checklist

- [ ] Update `REACT_APP_BACKEND_URL` to production URL
- [ ] Configure production database connection
- [ ] Add production Stripe keys
- [ ] Set up email domain verification (Resend)
- [ ] Enable HTTPS/SSL
- [ ] Set `CORS_ORIGINS` to production domain
- [ ] Update `JWT_SECRET` with strong random string
- [ ] Configure environment variables on hosting platform
- [ ] Run database migrations/seeding
- [ ] Set up monitoring and error tracking
- [ ] Configure backup strategy

---

## 🤝 How to Contribute

We welcome contributions from the community! Here's how you can help:

### 🐛 Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/yourusername/laundryex/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if applicable)
   - Environment details (OS, browser, versions)

### 💡 Suggesting Features

1. Search existing [Issues](https://github.com/yourusername/laundryex/issues) for similar suggestions
2. Create a new issue with the `enhancement` label
3. Clearly describe the feature and its benefits
4. Include mockups or examples if possible

### 🔧 Pull Requests

1. **Fork the repository**
```bash
git clone https://github.com/yourusername/laundryex.git
cd laundryex
```

2. **Create a feature branch**
```bash
git checkout -b feature/amazing-feature
```

3. **Make your changes**
   - Follow existing code style
   - Write clear commit messages
   - Add tests for new features
   - Update documentation as needed

4. **Test your changes**
```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
yarn test
```

5. **Commit your changes**
```bash
git add .
git commit -m "feat: add amazing feature"
```

Follow [Conventional Commits](https://www.conventionalcommits.org/) format:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

6. **Push to your fork**
```bash
git push origin feature/amazing-feature
```

7. **Open a Pull Request**
   - Provide a clear title and description
   - Reference any related issues
   - Add screenshots for UI changes
   - Wait for review and address feedback

### 📝 Code Style

**Python (Backend):**
- Follow PEP 8 guidelines
- Use type hints where applicable
- Write docstrings for functions and classes
- Maximum line length: 100 characters

**JavaScript (Frontend):**
- Use ES6+ syntax
- Follow Airbnb style guide
- Use functional components with hooks
- Write meaningful component names

### 🧪 Testing Guidelines

- Write unit tests for new features
- Maintain test coverage above 80%
- Test edge cases and error scenarios
- Include integration tests for API endpoints

---

## 📚 API Documentation

Full API documentation is available at `http://localhost:8001/docs` when running the backend.

### Key Endpoints

**Authentication:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

**Products:**
- `GET /api/products` - Get all products
- `GET /api/categories` - Get all categories

**Orders:**
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/{order_id}` - Get specific order

**Admin:**
- `GET /api/admin/orders` - Get all orders
- `PATCH /api/admin/orders/{order_id}/status` - Update order status
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/{product_id}` - Update product
- `DELETE /api/admin/products/{product_id}` - Delete product

**Payments:**
- `POST /api/payment/create-intent` - Create Stripe payment intent

---

## 🔗 External Services

### Stripe (Payment Processing)
- [Documentation](https://stripe.com/docs)
- [Dashboard](https://dashboard.stripe.com)
- Get API keys from: Dashboard → Developers → API keys

### Resend (Email Service)
- [Documentation](https://resend.com/docs)
- [Dashboard](https://resend.com/emails)
- Get API key from: Dashboard → API Keys

### MongoDB Atlas (Database)
- [Documentation](https://docs.mongodb.com/atlas/)
- [Dashboard](https://cloud.mongodb.com)
- Create free cluster (512MB)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 LaundryEx

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 🙏 Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/) - Modern web framework for Python
- [React](https://reactjs.org/) - JavaScript library for building UIs
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Stripe](https://stripe.com/) - Payment processing
- [Resend](https://resend.com/) - Email delivery
- [MongoDB](https://mongodb.com/) - Database

---

## 📞 Support

- 📧 Email: support@laundry-express.co.uk
- 💬 [Discord Community](#)
- 📖 [Documentation](#)
- 🐛 [Issue Tracker](https://github.com/yourusername/laundryex/issues)

---

## 🗺️ Roadmap

### Version 1.1 (Q1 2025)
- [ ] SMS notifications via Twilio
- [ ] Customer reviews and ratings
- [ ] Loyalty points system
- [ ] Promo codes and discounts

### Version 1.2 (Q2 2025)
- [ ] Mobile app (React Native)
- [ ] Real-time order tracking
- [ ] Live chat support
- [ ] Multi-language support

### Version 2.0 (Q3 2025)
- [ ] Driver assignment and tracking
- [ ] Route optimization
- [ ] Subscription plans
- [ ] API for third-party integrations

---

## 📊 Project Stats

![GitHub Stars](https://img.shields.io/github/stars/yourusername/laundryex?style=social)
![GitHub Forks](https://img.shields.io/github/forks/yourusername/laundryex?style=social)
![GitHub Issues](https://img.shields.io/github/issues/yourusername/laundryex)
![GitHub Pull Requests](https://img.shields.io/github/issues-pr/yourusername/laundryex)

---

<div align="center">

**Built with ❤️ by the LaundryEx Team**

[Website](#) • [Twitter](#) • [LinkedIn](#)

</div>
