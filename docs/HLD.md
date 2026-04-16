# 📐 High-Level Design (HLD) — Shatakshi Surgicals

> **Version:** 1.0  
> **Date:** April 2026  
> **Author:** PriyankVyas31  
> **Status:** Implemented (Phase 1 — Frontend)

---

## 1. Introduction

### 1.1 Purpose
This document describes the high-level architecture and design of the **Shatakshi Surgicals** e-commerce platform — a web application for browsing, searching, and purchasing surgical instruments, medical equipment, and pharmaceutical products.

### 1.2 Scope
The current implementation covers **Phase 1** — a complete frontend-only e-commerce experience. The architecture is designed to be extensible for future backend integration (Phase 2), payment gateway (Phase 3), and advanced features (Phase 4).

### 1.3 Target Audience
- Developers contributing to the project
- Stakeholders evaluating the system design
- Technical reviewers and interviewers

---

## 2. System Overview

### 2.1 System Context Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        INTERNET                                  │
│                                                                  │
│   ┌──────────┐         ┌──────────────────────┐                 │
│   │          │  HTTPS  │   GitHub Pages CDN    │                 │
│   │   User   │◄───────►│   (Static Hosting)    │                 │
│   │ (Browser)│         │                      │                 │
│   │          │         │  ┌────────────────┐  │                 │
│   └──────────┘         │  │  HTML / CSS /   │  │                 │
│                        │  │  JavaScript     │  │                 │
│                        │  └────────────────┘  │                 │
│                        └──────────────────────┘                 │
│                                                                  │
│   ┌──────────────────┐     ┌──────────────────┐                 │
│   │   Font Awesome   │     │   Browser        │                 │
│   │   CDN (Icons)    │     │   localStorage   │                 │
│   └──────────────────┘     │   (Cart Data)    │                 │
│                            └──────────────────┘                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 System Description
The system is a **static single-page-like application** consisting of 5 HTML pages that share common JavaScript modules. It operates entirely in the browser with no server-side processing.

| Aspect | Current (Phase 1) | Future (Phase 2+) |
|--------|-------------------|-------------------|
| Hosting | GitHub Pages (static) | Cloud (AWS/Vercel) |
| Data Storage | In-memory JS + localStorage | Database (MongoDB/PostgreSQL) |
| Authentication | None | JWT-based auth |
| Payment | Placeholder (COD/UPI) | Razorpay/Stripe |
| API | None | REST API (Node.js/Django) |

---

## 3. Architecture

### 3.1 Architecture Style
**Client-Side Rendered (CSR) Monolithic Frontend**

The entire application runs in the browser. Product data is embedded in a JavaScript file, cart state is managed via localStorage, and all rendering is done through DOM manipulation.

### 3.2 High-Level Architecture Diagram

```
┌───────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                      │
│                                                            │
│  ┌──────────┐ ┌──────────┐ ┌────────┐ ┌──────┐ ┌───────┐│
│  │  index   │ │ products │ │product │ │ cart │ │check- ││
│  │  .html   │ │  .html   │ │detail  │ │.html │ │out    ││
│  │          │ │          │ │.html   │ │      │ │.html  ││
│  │ Homepage │ │ Catalog  │ │ Detail │ │ Cart │ │Checkout││
│  └────┬─────┘ └────┬─────┘ └───┬────┘ └──┬───┘ └───┬───┘│
│       │             │           │         │         │     │
│       └─────────────┴───────┬───┴─────────┴─────────┘     │
│                             │                              │
├─────────────────────────────┼──────────────────────────────┤
│                    BUSINESS LOGIC LAYER                     │
│                             │                              │
│  ┌──────────────────────────┴───────────────────────────┐  │
│  │                     app.js                            │  │
│  │                                                       │  │
│  │  ┌─────────────┐ ┌──────────────┐ ┌───────────────┐  │  │
│  │  │    Cart      │ │   Search     │ │   Products    │  │  │
│  │  │  Management  │ │   Engine     │ │   Filter &    │  │  │
│  │  │  Module      │ │   Module     │ │   Sort Module │  │  │
│  │  └─────────────┘ └──────────────┘ └───────────────┘  │  │
│  │                                                       │  │
│  │  ┌─────────────┐ ┌──────────────┐ ┌───────────────┐  │  │
│  │  │  Checkout   │ │    UI        │ │   Product     │  │  │
│  │  │  Handler    │ │  Utilities   │ │   Renderer    │  │  │
│  │  │  Module     │ │  Module      │ │   Module      │  │  │
│  │  └─────────────┘ └──────────────┘ └───────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                      DATA LAYER                              │
│                                                              │
│  ┌───────────────────┐     ┌──────────────────────────────┐  │
│  │ products-data.js  │     │     Browser localStorage     │  │
│  │                   │     │                              │  │
│  │ 36 products       │     │  Key: shatakshi_cart         │  │
│  │ 7 categories      │     │  Value: JSON array of items  │  │
│  │ Static catalog    │     │  Persists across sessions    │  │
│  └───────────────────┘     └──────────────────────────────┘  │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                    STYLING LAYER                             │
│                                                              │
│  ┌───────────────────┐     ┌──────────────────────────────┐  │
│  │    style.css      │     │   Font Awesome 6.5 (CDN)     │  │
│  │                   │     │                              │  │
│  │ CSS Variables     │     │  Icons for UI elements       │  │
│  │ Component Styles  │     │  Product category icons      │  │
│  │ Responsive Rules  │     │  Action icons                │  │
│  └───────────────────┘     └──────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

### 3.3 Component Overview

| Component | File | Responsibility |
|-----------|------|---------------|
| **Homepage** | `index.html` | Landing page, featured products, categories, testimonials |
| **Product Catalog** | `products.html` | Product listing with filters, sorting, pagination |
| **Product Detail** | `product-detail.html` | Individual product view, add to cart, buy now |
| **Shopping Cart** | `cart.html` | Cart management, quantity updates, order summary |
| **Checkout** | `checkout.html` | Billing form, payment selection, order placement |
| **Stylesheet** | `css/style.css` | All visual styling, responsive design, animations |
| **Product Database** | `js/products-data.js` | Static product catalog (36 items) |
| **App Logic** | `js/app.js` | All business logic, DOM rendering, state management |

---

## 4. Data Flow

### 4.1 User Browse Flow

```
User visits homepage
       │
       ▼
index.html loads ──► products-data.js (product catalog)
       │                    │
       ▼                    ▼
Hero + Categories    Featured Products rendered
       │              via createProductCard()
       ▼
User clicks category/product
       │
       ▼
products.html?category=X  ──► URL params parsed
       │                            │
       ▼                            ▼
Sidebar filters applied     Products filtered & sorted
       │                            │
       ▼                            ▼
                Products grid re-rendered
```

### 4.2 Add to Cart Flow

```
User clicks "Add to Cart"
       │
       ▼
addToCart(productId, qty)
       │
       ▼
Read cart from localStorage ──► getCart()
       │
       ▼
Product exists in cart?
       │
  ┌────┴────┐
  │ YES     │ NO
  ▼         ▼
Increment   Push new item
quantity    to cart array
  │         │
  └────┬────┘
       │
       ▼
Save to localStorage ──► saveCart()
       │
       ▼
Update cart badge count ──► updateCartCount()
       │
       ▼
Show toast notification ──► showToast()
```

### 4.3 Checkout Flow

```
User clicks "Proceed to Checkout"
       │
       ▼
checkout.html loads
       │
       ▼
renderCheckout() reads cart ──► getCart()
       │
       ▼
Order summary displayed ──► Items + Subtotal + Shipping + GST + Total
       │
       ▼
User fills billing form
       │
       ▼
User selects payment method (COD / Bank / UPI / Online)
       │
       ▼
handleCheckout(event) triggered on form submit
       │
       ▼
Form validation ──► HTML5 built-in + pattern matching
       │
       ▼
Generate order ID ──► "SS-" + timestamp
       │
       ▼
Clear cart from localStorage
       │
       ▼
Show order confirmation page with order ID
```

---

## 5. Data Architecture

### 5.1 Product Data Model

```javascript
Product {
    id:            Number     // Unique identifier (1-36)
    name:          String     // Product name
    category:      String     // Category slug (e.g., "surgical-instruments")
    categoryName:  String     // Display name (e.g., "Surgical Instruments")
    brand:         String     // Brand name
    price:         Number     // Current selling price (INR)
    originalPrice: Number     // MRP / original price (INR)
    discount:      Number     // Discount percentage
    rating:        Number     // Average rating (1.0 - 5.0)
    reviews:       Number     // Number of reviews
    image:         String     // Image URL (placeholder)
    icon:          String     // Font Awesome icon class
    description:   String     // Detailed description
    features:      String[]   // Key features list
    sku:           String     // Stock Keeping Unit
    stock:         Number     // Available stock quantity
    featured:      Boolean    // Show in featured section
    tags:          String[]   // Tags: "bestseller", "sale"
}
```

### 5.2 Cart Data Model (localStorage)

```javascript
// Key: "shatakshi_cart"
// Value: JSON array
CartItem {
    id:            Number     // Product ID (references Product.id)
    name:          String     // Product name (denormalized)
    price:         Number     // Unit price at time of adding
    originalPrice: Number     // Original price
    icon:          String     // Font Awesome icon class
    category:      String     // Category display name
    quantity:      Number     // Quantity in cart (≥ 1)
}
```

### 5.3 Category Taxonomy

```
Categories (7)
├── surgical-instruments     → Surgical Instruments (6 products)
├── diagnostic-equipment     → Diagnostic Equipment (7 products)
├── hospital-furniture       → Hospital Furniture (4 products)
├── ot-equipment            → OT Equipment (4 products)
├── disposables             → Disposables & Consumables (6 products)
├── orthopaedic             → Orthopaedic Supplies (4 products)
└── pharmaceuticals         → Pharmaceuticals (5 products)
```

---

## 6. URL Routing & Navigation

### 6.1 URL Structure

| URL | Page | Parameters |
|-----|------|-----------|
| `/` or `/index.html` | Homepage | — |
| `/products.html` | All Products | `?category=slug`, `?tag=name`, `?search=query` |
| `/product-detail.html` | Product Detail | `?id=productId` |
| `/cart.html` | Shopping Cart | — |
| `/checkout.html` | Checkout | — |

### 6.2 Navigation Map

```
                    ┌──────────────┐
                    │   Homepage   │
                    │  index.html  │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
       ┌──────────┐ ┌──────────┐ ┌──────────┐
       │ Products │ │ Products │ │ Contact  │
       │ (All)    │ │ (Filter) │ │ (Footer) │
       └─────┬────┘ └─────┬────┘ └──────────┘
             │             │
             └──────┬──────┘
                    ▼
            ┌──────────────┐
            │Product Detail│
            │product-detail│
            └──────┬───────┘
                   │
                   ▼
            ┌──────────────┐
            │  Cart Page   │
            │  cart.html   │
            └──────┬───────┘
                   │
                   ▼
            ┌──────────────┐
            │  Checkout    │
            │checkout.html │
            └──────┬───────┘
                   │
                   ▼
            ┌──────────────┐
            │   Order      │
            │ Confirmation │
            └──────────────┘
```

---

## 7. UI/UX Design

### 7.1 Design System

| Element | Value |
|---------|-------|
| **Primary Color** | `#0d6efd` (Blue) |
| **Secondary Color** | `#00b894` (Green) |
| **Accent Color** | `#e17055` (Orange) |
| **Dark** | `#1a1a2e` |
| **Font** | Segoe UI, system fonts |
| **Border Radius** | 8px (default), 12px (cards) |
| **Shadows** | `0 2px 15px rgba(0,0,0,0.08)` |
| **Transitions** | `all 0.3s ease` |

### 7.2 Responsive Breakpoints

| Breakpoint | Target | Layout Changes |
|-----------|--------|----------------|
| > 1024px | Desktop | Full sidebar, multi-column grids |
| 768px - 1024px | Tablet | Single column layout, inline sidebar |
| 480px - 768px | Mobile | Stacked layout, hamburger menu |
| < 480px | Small Mobile | Single column products, full-width elements |

### 7.3 Page Layout Structure

```
┌─────────────────────────────────────┐
│            Top Bar (dark)           │
├─────────────────────────────────────┤
│  Logo  │  Search Bar  │  Actions   │ ◄── Sticky Header
├─────────────────────────────────────┤
│         Navigation (blue)           │
├─────────────────────────────────────┤
│                                     │
│         Page Content Area           │
│                                     │
│   (varies by page — see sections)   │
│                                     │
├─────────────────────────────────────┤
│          Newsletter Bar             │
├─────────────────────────────────────┤
│            Footer Grid              │
│  About │ Links │ Categories │ Info  │
├─────────────────────────────────────┤
│          Footer Bottom              │
└─────────────────────────────────────┘
```

---

## 8. Security Considerations

| Concern | Mitigation |
|---------|-----------|
| **XSS (Cross-Site Scripting)** | All dynamic content rendered via `escapeHtml()` utility function |
| **Input Validation** | HTML5 form validation with `required`, `pattern`, `maxlength` attributes |
| **Data Integrity** | Cart data validated on read from localStorage with try-catch |
| **HTTPS** | Enforced by GitHub Pages |
| **No Sensitive Data** | No passwords, payment info, or PII stored client-side |

---

## 9. Performance Considerations

| Strategy | Implementation |
|----------|---------------|
| **No External Frameworks** | Zero JS library overhead (no React/Vue/jQuery) |
| **Single CSS File** | One HTTP request for all styles |
| **Debounced Search** | 300ms debounce on search input to reduce DOM operations |
| **CSS Variables** | Theme changes without rewriting styles |
| **Lazy Rendering** | Only visible products rendered (filtered list) |
| **CDN for Icons** | Font Awesome loaded from CDN with caching |
| **Minimal DOM Manipulation** | innerHTML batch updates instead of individual DOM ops |

---

## 10. Future Architecture (Phase 2+)

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────────┐
│              │     │                  │     │                  │
│   Frontend   │────►│   REST API       │────►│   Database       │
│   (Current)  │ API │   (Node.js /     │     │   (MongoDB /     │
│   HTML/CSS/  │     │    Express)      │     │    PostgreSQL)   │
│   JS         │◄────│                  │◄────│                  │
│              │     │   + Auth (JWT)   │     │                  │
└──────────────┘     │   + Validation   │     └──────────────────┘
                     │   + Rate Limit   │
       │             └────────┬─────────┘            │
       │                      │                      │
       ▼                      ▼                      ▼
┌──────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Razorpay /  │     │   Admin Panel    │     │   Redis Cache    │
│  Stripe      │     │   (Dashboard)    │     │   (Sessions)     │
│  Payment GW  │     │                  │     │                  │
└──────────────┘     └──────────────────┘     └──────────────────┘
```

---

## 11. Deployment Architecture

### Current (Phase 1)

```
Developer Machine
       │
       │  git push
       ▼
┌──────────────┐     ┌──────────────────┐
│   GitHub     │────►│  GitHub Pages    │────► Users (HTTPS)
│   Repository │     │  CDN (Auto)      │
└──────────────┘     └──────────────────┘
```

### Future (Phase 2+)

```
Developer Machine
       │
       │  git push
       ▼
┌──────────────┐     ┌──────────────────┐     ┌───────────────┐
│   GitHub     │────►│   CI/CD          │────►│  Cloud Host    │
│   Repository │     │   (GH Actions)   │     │  (Vercel/AWS)  │
└──────────────┘     └──────────────────┘     └───────────────┘
                                                     │
                                              ┌──────┴──────┐
                                              │  CDN Layer  │
                                              │ (CloudFront)│
                                              └─────────────┘
```

---

*End of High-Level Design Document*
