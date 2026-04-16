# 🏥 Shatakshi Surgicals

> **E-commerce platform for surgical instruments, medical equipment & pharmaceutical products**

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge&logo=github)](https://priyankvyas31.github.io/shatakshi-surgicals/)
[![GitHub Pages](https://img.shields.io/badge/Hosted%20on-GitHub%20Pages-blue?style=for-the-badge&logo=github)](https://priyankvyas31.github.io/shatakshi-surgicals/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)]()
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)]()
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)]()

---

## 📋 Table of Contents

- [Overview](#overview)
- [Live Demo](#live-demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Pages & Modules](#pages--modules)
- [Product Categories](#product-categories)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Future Enhancements](#future-enhancements)
- [Design Documents](#design-documents)
- [Contributing](#contributing)
- [License](#license)

---

## 🔎 Overview

**Shatakshi Surgicals** is a fully functional, frontend-only e-commerce website built for a surgical equipment and pharmaceutical shop. It allows users to browse products across multiple categories, search and filter them, add items to a cart, and proceed through a complete checkout flow — all without a backend server.

The application uses **localStorage** for cart persistence and is designed to be easily extended with a backend API and payment gateway integration in the future.

---

## 🌐 Live Demo

**🔗 [https://priyankvyas31.github.io/shatakshi-surgicals/](https://priyankvyas31.github.io/shatakshi-surgicals/)**

---

## ✨ Features

### 🛒 Shopping Experience
| Feature | Description |
|---------|-------------|
| **Product Catalog** | 36 products across 7 categories with images, ratings, pricing |
| **Product Search** | Real-time search with dropdown suggestions (debounced, 300ms) |
| **Category Filtering** | Filter by category, brand, price range, and rating |
| **Sorting** | Sort by price (low/high), name (A-Z/Z-A), or rating |
| **Product Detail** | Detailed product page with features, specs, and related products |
| **Add to Cart** | Add products from listing page, detail page, or search results |
| **Buy Now** | One-click buy that adds to cart and redirects to checkout |

### 🛍️ Cart & Checkout
| Feature | Description |
|---------|-------------|
| **Cart Management** | Add, remove, update quantities with real-time total calculation |
| **Persistent Cart** | Cart data persists across sessions using localStorage |
| **Order Summary** | Subtotal, shipping (free above ₹5,000), GST (18%), and total |
| **Coupon Code** | Coupon input field (ready for backend integration) |
| **Checkout Form** | Full billing/shipping form with validation |
| **Payment Options** | COD, Bank Transfer, UPI, Online Payment (placeholder) |
| **Order Confirmation** | Success page with generated order ID |

### 🎨 UI/UX
| Feature | Description |
|---------|-------------|
| **Responsive Design** | Mobile-first, works on phones, tablets, and desktops |
| **Sticky Header** | Navigation stays visible while scrolling |
| **Toast Notifications** | Non-intrusive success/error messages |
| **Hover Effects** | Product cards with overlay actions on hover |
| **Loading States** | Skeleton loading animation classes ready |
| **Back to Top** | Floating button appears on scroll |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **HTML5** | Semantic page structure |
| **CSS3** | Styling with CSS Custom Properties (variables), Flexbox, Grid |
| **Vanilla JavaScript** | Application logic, DOM manipulation, state management |
| **Font Awesome 6.5** | Icon library (CDN) |
| **localStorage** | Client-side cart data persistence |
| **GitHub Pages** | Static site hosting |

> **No frameworks, no build tools, no dependencies** — pure HTML/CSS/JS for maximum simplicity and performance.

---

## 📁 Project Structure

```
shatakshi-surgicals/
├── index.html                 # Homepage (hero, categories, featured, testimonials)
├── products.html              # Product listing with filters & sorting
├── product-detail.html        # Individual product detail page
├── cart.html                  # Shopping cart page
├── checkout.html              # Checkout form & order placement
├── css/
│   └── style.css              # Complete stylesheet (35KB, all components)
├── js/
│   ├── products-data.js       # Product database (36 products, 7 categories)
│   └── app.js                 # Application logic (cart, search, filters, checkout)
├── images/                    # Image assets directory (placeholder)
├── docs/
│   ├── HLD.md                 # High-Level Design Document
│   └── LLD.md                 # Low-Level Design Document
└── README.md                  # This file
```

---

## 📄 Pages & Modules

### 1. Homepage (`index.html`)
- Top bar with contact info and announcements
- Sticky header with logo, search bar, and cart icon
- Navigation bar with dropdown menus
- Hero banner with CTA buttons
- Trust badges (Free Shipping, Genuine Products, Easy Returns, 24/7 Support)
- Category grid (7 categories with icons)
- Featured Products section (8 products)
- CTA banner for bulk orders
- Best Sellers section (4 products)
- Trusted Brands ticker
- Customer testimonials (3 cards)
- Newsletter subscription
- Full footer with links, contact info, and social icons

### 2. Products Page (`products.html`)
- Dynamic page header based on URL parameters
- Sidebar filters: category, price range, brand, rating
- Sorting: default, price, name, rating
- Product grid with cards
- URL parameter support: `?category=`, `?tag=`, `?search=`
- Clear all filters button
- Product count display

### 3. Product Detail (`product-detail.html`)
- Product image gallery (placeholder with icons)
- Product info: name, category, rating, price, description
- Key features list
- Product metadata (brand, SKU, stock, category)
- Quantity selector
- Add to Cart & Buy Now buttons
- Trust badges (shipping, returns, genuine)
- Related products section

### 4. Cart (`cart.html`)
- Cart items table (product, price, quantity, total)
- Quantity adjustment controls
- Remove item button
- Order summary sidebar
- Coupon code input
- Free shipping threshold indicator
- Proceed to Checkout / Continue Shopping buttons
- Empty cart state with CTA

### 5. Checkout (`checkout.html`)
- Billing & shipping form (name, email, phone, address, state, PIN)
- Optional fields: company/hospital, apartment, GST number, order notes
- Form validation (required fields, patterns)
- Payment method selection (COD, Bank Transfer, UPI, Online)
- Order summary with item list and totals
- Secure checkout badge
- Order confirmation page with order ID

---

## 🏷️ Product Categories

| # | Category | Products | Description |
|---|---------|----------|-------------|
| 1 | Surgical Instruments | 6 | Scissors, forceps, needle holders, scalpels, retractors, suture kits |
| 2 | Diagnostic Equipment | 7 | BP monitors, oximeters, thermometers, stethoscopes, glucometers, ENT sets, nebulizers |
| 3 | Hospital Furniture | 4 | Hospital beds, wheelchairs, examination tables, IV stands |
| 4 | OT Equipment | 4 | Cautery units, suction machines, autoclaves, OT lights |
| 5 | Disposables & Consumables | 6 | Gloves, syringes, masks, sutures, IV cannulas, cotton rolls |
| 6 | Orthopaedic Supplies | 4 | Knee supports, cervical collars, walking sticks, crepe bandages |
| 7 | Pharmaceuticals | 5 | Antiseptics, sanitizers, hydrogen peroxide, first aid kits, surgical spirit |

**Total: 36 products** with detailed descriptions, features, pricing, ratings, and stock info.

---

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Edge, Safari)
- No server or build tools required

### Run Locally

```bash
# Clone the repository
git clone https://github.com/PriyankVyas31/shatakshi-surgicals.git

# Navigate to the project
cd shatakshi-surgicals

# Open in browser (any of these)
start index.html          # Windows
open index.html           # macOS
xdg-open index.html       # Linux

# Or use a local server (optional, for best experience)
npx serve .
# or
python -m http.server 8000
```

### Using VS Code
1. Open the `shatakshi-surgicals` folder in VS Code
2. Install the **Live Server** extension
3. Right-click `index.html` → **Open with Live Server**

---

## 🌍 Deployment

The site is deployed on **GitHub Pages** using the `main` branch.

### Deploy Steps
```bash
# Push changes to main branch
git add -A
git commit -m "your commit message"
git push origin main

# GitHub Pages auto-deploys from main branch
# Site available at: https://priyankvyas31.github.io/shatakshi-surgicals/
```

### Custom Domain (Optional)
1. Go to repo **Settings → Pages**
2. Add your custom domain under "Custom domain"
3. Create a `CNAME` file in the repo root with your domain

---

## 🔮 Future Enhancements

### Phase 2 — Backend Integration
- [ ] Node.js/Express or Django REST API backend
- [ ] MongoDB/PostgreSQL database for products and orders
- [ ] User authentication (registration, login, JWT)
- [ ] Admin dashboard for product & order management
- [ ] Real inventory management with stock tracking

### Phase 3 — Payment Gateway
- [ ] Razorpay / Stripe payment integration
- [ ] UPI deep-link integration
- [ ] Payment confirmation and receipt generation
- [ ] Refund management

### Phase 4 — Advanced Features
- [ ] Product image uploads with CDN
- [ ] Product reviews and ratings by users
- [ ] Wishlist functionality
- [ ] Order tracking with status updates
- [ ] Email notifications (order confirmation, shipping, delivery)
- [ ] Invoice PDF generation
- [ ] Multi-language support (Hindi, English)
- [ ] PWA (Progressive Web App) for offline access
- [ ] Analytics dashboard (sales, traffic, conversion)
- [ ] SEO optimization with meta tags and structured data

---

## 📐 Design Documents

| Document | Description | Link |
|----------|-------------|------|
| **HLD** | High-Level Design — system architecture, component overview, data flow | [docs/HLD.md](docs/HLD.md) |
| **LLD** | Low-Level Design — module details, function specs, data models, API contracts | [docs/LLD.md](docs/LLD.md) |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📞 Contact

**Shatakshi Surgicals**
- 📧 Email: info@shatakshisurgicals.com
- 📱 Phone: +91-98765-43210
- 📍 Address: 123, Medical Market, Sadar Bazaar, Agra, UP - 282001

**Developer**
- GitHub: [@PriyankVyas31](https://github.com/PriyankVyas31)
- Email: priyankvyas001@gmail.com

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/PriyankVyas31">PriyankVyas31</a>
</p>
