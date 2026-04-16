# 🔧 Low-Level Design (LLD) — Shivam Surgicals

> **Version:** 1.0  
> **Date:** April 2026  
> **Author:** PriyankVyas31  
> **Status:** Implemented (Phase 1 — Frontend)

---

## 1. Introduction

### 1.1 Purpose
This document provides detailed low-level design specifications for the **Shivam Surgicals** e-commerce frontend, covering module definitions, function signatures, data models, DOM structure, CSS architecture, event handling, state management, and inter-module communication.

### 1.2 Related Documents
- [README.md](../README.md) — Project overview and setup
- [HLD.md](HLD.md) — High-level system architecture

---

## 2. Module Decomposition

### 2.1 Module Dependency Graph

```
┌────────────────────────────────────────────────┐
│                  HTML Pages                     │
│  (index, products, product-detail, cart, checkout) │
│                      │                          │
│           ┌──────────┴──────────┐               │
│           ▼                     ▼               │
│   ┌──────────────┐     ┌──────────────────┐     │
│   │ products-    │     │     app.js       │     │
│   │ data.js      │────►│                  │     │
│   │              │     │  ┌────────────┐  │     │
│   │ exports:     │     │  │ Cart Mgmt  │  │     │
│   │  - products  │     │  ├────────────┤  │     │
│   │   (Array)    │     │  │ Search     │  │     │
│   │              │     │  ├────────────┤  │     │
│   └──────────────┘     │  │ Filters    │  │     │
│                        │  ├────────────┤  │     │
│                        │  │ Renderers  │  │     │
│                        │  ├────────────┤  │     │
│                        │  │ Checkout   │  │     │
│                        │  ├────────────┤  │     │
│                        │  │ UI Utils   │  │     │
│                        │  └────────────┘  │     │
│                        └──────────────────┘     │
│                              │                  │
│                              ▼                  │
│                     ┌──────────────┐            │
│                     │ localStorage │            │
│                     │ (Cart State) │            │
│                     └──────────────┘            │
└────────────────────────────────────────────────┘
```

### 2.2 File Specifications

| File | Size | Lines | Responsibility |
|------|------|-------|---------------|
| `js/products-data.js` | ~28 KB | ~450 | Product catalog definition |
| `js/app.js` | ~29 KB | ~650 | All application logic |
| `css/style.css` | ~36 KB | ~1400 | All component styles |
| `index.html` | ~21 KB | ~350 | Homepage markup |
| `products.html` | ~12 KB | ~220 | Product listing markup |
| `product-detail.html` | ~7 KB | ~130 | Product detail markup |
| `cart.html` | ~5 KB | ~120 | Cart page markup |
| `checkout.html` | ~14 KB | ~280 | Checkout page markup |

---

## 3. Data Models

### 3.1 Product Schema

```javascript
/**
 * @typedef {Object} Product
 * @property {number}   id            - Unique product identifier (auto-increment, 1-36)
 * @property {string}   name          - Full product name (max 80 chars)
 * @property {string}   category      - Category slug (kebab-case, used in URLs)
 * @property {string}   categoryName  - Human-readable category label
 * @property {string}   brand         - Manufacturer/brand name
 * @property {number}   price         - Selling price in INR (integer)
 * @property {number}   originalPrice - MRP in INR (integer, >= price)
 * @property {number}   discount      - Discount percentage (0-100)
 * @property {number}   rating        - Average rating (1.0 - 5.0, one decimal)
 * @property {number}   reviews       - Total review count
 * @property {string}   image         - Image URL (empty string = placeholder)
 * @property {string}   icon          - Font Awesome icon class (e.g., "fa-scissors")
 * @property {string}   description   - Detailed product description (100-300 chars)
 * @property {string[]} features      - Key features list (3-5 items)
 * @property {string}   sku           - Stock Keeping Unit (format: "SS-XX-NNN")
 * @property {number}   stock         - Available inventory count
 * @property {boolean}  featured      - Display in homepage featured section
 * @property {string[]} tags          - Filterable tags: "bestseller" | "sale"
 */
```

**SKU Format:** `SS-{CategoryCode}-{SequenceNumber}`

| Category Code | Category |
|--------------|----------|
| `SI` | Surgical Instruments |
| `DE` | Diagnostic Equipment |
| `HF` | Hospital Furniture |
| `OT` | OT Equipment |
| `DC` | Disposables & Consumables |
| `OR` | Orthopaedic Supplies |
| `PH` | Pharmaceuticals |

### 3.2 Cart Item Schema

```javascript
/**
 * @typedef {Object} CartItem
 * @property {number} id            - Product ID (FK to Product.id)
 * @property {string} name          - Product name (denormalized for display)
 * @property {number} price         - Unit price at time of adding (INR)
 * @property {number} originalPrice - Original price (INR)
 * @property {string} icon          - Font Awesome icon class
 * @property {string} category      - Category display name
 * @property {number} quantity      - Quantity in cart (min: 1)
 */
```

**Storage Key:** `Shivam_cart`  
**Storage Format:** `JSON.stringify(CartItem[])`

### 3.3 Cart Totals Schema

```javascript
/**
 * @typedef {Object} CartTotals
 * @property {number} subtotal  - Sum of (price × quantity) for all items
 * @property {number} shipping  - 0 if subtotal >= 5000, else 199
 * @property {number} tax       - Math.round(subtotal × 0.18) — GST 18%
 * @property {number} total     - subtotal + shipping + tax
 * @property {number} itemCount - Number of unique items in cart
 */
```

### 3.4 Checkout Form Schema

```javascript
/**
 * @typedef {Object} CheckoutForm
 * @property {string} firstName  - Required, text
 * @property {string} lastName   - Required, text
 * @property {string} company    - Optional, text (hospital/clinic name)
 * @property {string} email      - Required, email format
 * @property {string} phone      - Required, pattern: [0-9+\-\s]{10,15}
 * @property {string} address1   - Required, street address
 * @property {string} address2   - Optional, apartment/suite
 * @property {string} city       - Required, text
 * @property {string} state      - Required, select from Indian states
 * @property {string} pincode    - Required, pattern: [0-9]{6}
 * @property {string} gst        - Optional, GST number
 * @property {string} notes      - Optional, textarea
 * @property {string} payment    - Required, radio: "cod" | "bank" | "upi" | "online"
 */
```

---

## 4. Function Specifications

### 4.1 Cart Management Module

```
┌──────────────────────────────────────────────────────────────┐
│                    CART MANAGEMENT                            │
│                                                              │
│  getCart()           ──► Read & parse cart from localStorage  │
│  saveCart(cart)       ──► Serialize & write cart to storage   │
│  updateCartCount()   ──► Update badge in all pages           │
│  addToCart(id, qty)  ──► Add/increment item in cart          │
│  removeFromCart(id)  ──► Remove item, re-render cart         │
│  updateCartQuantity()──► Change item quantity, re-render     │
│  getCartTotals()     ──► Calculate subtotal, shipping, tax   │
└──────────────────────────────────────────────────────────────┘
```

#### `getCart(): CartItem[]`
```
Input:  none
Output: CartItem[] (empty array if error or no data)
Logic:
  1. Read localStorage key "Shivam_cart"
  2. JSON.parse the value
  3. Return parsed array or [] on any error (try-catch)
Side Effects: none
```

#### `saveCart(cart: CartItem[]): void`
```
Input:  cart — array of CartItem objects
Output: void
Logic:
  1. JSON.stringify(cart)
  2. Write to localStorage key "Shivam_cart"
  3. Call updateCartCount()
Side Effects: localStorage write, DOM update (badge)
```

#### `updateCartCount(): void`
```
Input:  none
Output: void
Logic:
  1. Call getCart()
  2. Sum all item.quantity values using reduce()
  3. Find all DOM elements with id="cartCount"
  4. Set textContent to count
  5. Set display: "flex" if count > 0, "none" if 0
Side Effects: DOM update
```

#### `addToCart(productId: number, quantity?: number): void`
```
Input:  productId — product ID to add
        quantity — number of units (default: 1)
Output: void
Logic:
  1. Find product in products array by id
  2. If not found, return
  3. Call getCart()
  4. Find existing item with same id
  5. If exists: increment quantity
  6. If new: push new CartItem with denormalized fields
  7. Call saveCart()
  8. Call showToast() with success message
Side Effects: localStorage write, DOM toast + badge update
```

#### `removeFromCart(productId: number): void`
```
Input:  productId — product ID to remove
Output: void
Logic:
  1. Call getCart()
  2. Filter out item with matching id
  3. Call saveCart()
  4. Call renderCart() to re-render page
Side Effects: localStorage write, DOM re-render
```

#### `updateCartQuantity(productId: number, newQuantity: number): void`
```
Input:  productId — product ID
        newQuantity — new quantity value
Output: void
Logic:
  1. Call getCart()
  2. Find item with matching id
  3. Set quantity = Math.max(1, parseInt(newQuantity) || 1)
  4. Call saveCart()
  5. Call renderCart()
Side Effects: localStorage write, DOM re-render
```

#### `getCartTotals(): CartTotals`
```
Input:  none
Output: CartTotals object
Logic:
  1. Call getCart()
  2. subtotal = reduce sum of (item.price × item.quantity)
  3. shipping = subtotal >= 5000 ? 0 : 199
  4. tax = Math.round(subtotal × 0.18)
  5. total = subtotal + shipping + tax
  6. itemCount = cart.length
  7. Return { subtotal, shipping, tax, total, itemCount }
Side Effects: none (pure function)
```

### 4.2 Search Module

#### `searchProducts(query: string): void`
```
Input:  query — search string from input field
Output: void
Logic:
  1. Clear existing timeout (debounce)
  2. If query length < 2, hide dropdown, return
  3. Set 300ms timeout, then:
     a. Convert query to lowercase
     b. Filter products array where name, categoryName, brand,
        or description includes the query (case-insensitive)
     c. Limit to 8 results
     d. If no results: show "No products found" message
     e. Else: render result items as clickable links
     f. Show dropdown
Side Effects: DOM update (search dropdown)
Debounce: 300ms (cancels previous pending search)
```

**Search Result Item DOM Structure:**
```html
<a href="product-detail.html?id={id}" style="display:flex; ...">
    <i class="fas {icon}"></i>
    <div>
        <div>{name}</div>
        <div>{categoryName}</div>
    </div>
    <div>{price}</div>
</a>
```

### 4.3 Product Filter & Sort Module

#### `initProductsPage(): void`
```
Input:  none (reads from URL)
Output: void
Logic:
  1. Parse URL parameters: category, tag, search
  2. Update page title and breadcrumb based on params
  3. Pre-check corresponding filter checkbox if category param exists
  4. Call applyFilters()
Side Effects: DOM updates (title, breadcrumb, checkboxes), triggers filter
```

#### `applyFilters(): void`
```
Input:  none (reads from DOM + URL)
Output: void
Logic:
  1. Read URL params (category, tag)
  2. Collect checked category checkboxes → checkedCategories[]
  3. Collect checked brand checkboxes → checkedBrands[]
  4. Collect checked rating checkboxes → checkedRatings[]
  5. Read priceMin, priceMax from inputs (default 0, Infinity)
  6. Read sort select value
  7. Start with full products array copy
  8. Apply filters in order:
     a. URL category (if no sidebar categories checked)
     b. URL tag filter
     c. Sidebar category filter
     d. Brand filter
     e. Rating filter (minimum rating from checked values)
     f. Price range filter
  9. Apply sort:
     - "price-low":  sort by price ascending
     - "price-high": sort by price descending
     - "name-az":    sort by name A→Z
     - "name-za":    sort by name Z→A
     - "rating":     sort by rating descending
     - "default":    no sort (original order)
  10. Render filtered array to products grid
  11. Update result count text
  12. If empty: show "No products found" message with clear button
Side Effects: DOM update (product grid, result count)
```

**Filter Priority:** URL params → Sidebar checkboxes → Price range → Sort

#### `clearFilters(): void`
```
Input:  none
Output: void
Logic:
  1. Uncheck all sidebar checkboxes
  2. Clear price min/max inputs
  3. Reset sort select to "default"
  4. Remove URL parameters via history.replaceState()
  5. Call applyFilters()
Side Effects: DOM update, URL update
```

### 4.4 Renderer Module

#### `createProductCard(product: Product): string`
```
Input:  product — Product object
Output: HTML string for one product card
Logic:
  1. Determine badge: "SALE" (red) if tag "sale", "BEST SELLER" (green) if tag "bestseller"
  2. Build product card HTML with:
     - Badge overlay
     - Product image/icon placeholder
     - Hover overlay with Quick View + Add to Cart buttons
     - Category label
     - Product name (linked to detail page)
     - Star rating
     - Price (current, original, discount %)
     - Add to Cart button
  3. All text rendered via escapeHtml()
  4. Return complete HTML string
Side Effects: none (pure function)
```

**Product Card DOM Structure:**
```html
<div class="product-card">
    <span class="product-badge sale|new">BADGE</span>
    <div class="product-image">
        <i class="fas {icon}"></i>
        <div class="product-actions-overlay">
            <button>Quick View</button>
            <button>Add to Cart</button>
        </div>
    </div>
    <div class="product-info">
        <div class="product-category">CATEGORY</div>
        <h3 class="product-name"><a href="...">NAME</a></h3>
        <div class="product-rating">
            <span class="stars">★★★★☆</span>
            <span class="rating-count">(N)</span>
        </div>
        <div class="product-price">
            <span class="price-current">₹X,XXX</span>
            <span class="price-original">₹X,XXX</span>
            <span class="price-discount">XX% OFF</span>
        </div>
        <button class="btn btn-primary btn-sm">Add to Cart</button>
    </div>
</div>
```

#### `initProductDetailPage(): void`
```
Input:  none (reads ?id= from URL)
Output: void
Logic:
  1. Parse product ID from URL
  2. Find product in products array
  3. If not found: show error message, return
  4. Update breadcrumb and page title
  5. Render product detail HTML:
     - Gallery section (icon placeholder + thumbnails)
     - Info section (category, name, rating, price, description)
     - Meta info (brand, SKU, stock, category link)
     - Features list with checkmark icons
     - Quantity selector
     - Add to Cart + Buy Now buttons
     - Trust badges
  6. Render related products (same category, exclude current, max 4)
Side Effects: DOM update, document.title update
```

#### `renderCart(): void`
```
Input:  none
Output: void
Logic:
  1. Call getCart()
  2. If empty: render empty cart state with CTA
  3. If has items:
     a. Calculate totals via getCartTotals()
     b. Render cart layout (items + summary)
     c. Each item: product info, price, quantity selector, total, remove button
     d. Summary: subtotal, shipping, tax, free shipping threshold hint, total
     e. Coupon input
     f. Proceed to Checkout button
     g. Continue Shopping link
Side Effects: DOM update
```

#### `renderCheckout(): void`
```
Input:  none
Output: void
Logic:
  1. Call getCart()
  2. If empty: redirect to cart.html
  3. Calculate totals
  4. Render order items in summary sidebar
  5. Update subtotal, shipping, tax, total display elements
Side Effects: DOM update, possible redirect
```

### 4.5 Checkout Module

#### `handleCheckout(event: SubmitEvent): void`
```
Input:  event — form submit event
Output: void
Logic:
  1. event.preventDefault()
  2. Validate form via checkValidity()
  3. If invalid: call reportValidity(), return
  4. Generate order ID: "SS-" + last 6 digits of Date.now()
  5. Hide checkout form container
  6. Show order confirmation container
  7. Set order ID text
  8. Clear cart from localStorage
  9. Call updateCartCount()
  10. Scroll to top
Side Effects: DOM update, localStorage clear, scroll
```

#### `selectPayment(radio: HTMLInputElement): void`
```
Input:  radio — the selected radio input element
Output: void
Logic:
  1. Remove "selected" class from all .payment-method elements
  2. Add "selected" class to the parent .payment-method of clicked radio
Side Effects: DOM class toggle
```

#### `buyNow(productId: number): void`
```
Input:  productId — product to buy immediately
Output: void
Logic:
  1. Read quantity from #detailQty input (default: 1)
  2. Call addToCart(productId, quantity)
  3. Redirect to checkout.html
Side Effects: localStorage write, page redirect
```

### 4.6 UI Utilities Module

#### `showToast(message: string, type?: string): void`
```
Input:  message — notification text
        type — "success" (default) or "error"
Output: void
Logic:
  1. Find #toast element
  2. Set className to "toast {type}"
  3. Set innerHTML with icon + escaped message
  4. Add "show" class (triggers CSS transition)
  5. setTimeout 3000ms: remove "show" class
Side Effects: DOM update, timer
```

#### `escapeHtml(text: string): string`
```
Input:  text — raw string to escape
Output: HTML-safe string
Logic:
  1. Create temporary div element
  2. Set div.textContent = text (auto-escapes)
  3. Return div.innerHTML
Side Effects: none (creates temporary element, not appended to DOM)
Escapes: &, <, >, ", '
```

#### `formatPrice(price: number): string`
```
Input:  price — number in INR
Output: Formatted string like "₹1,23,456"
Logic:  Return "₹" + price.toLocaleString("en-IN")
Side Effects: none
```

#### `getStars(rating: number): string`
```
Input:  rating — number (1.0 to 5.0)
Output: HTML string of star icons
Logic:
  1. full = Math.floor(rating)
  2. hasHalf = (rating % 1 >= 0.5)
  3. Generate full star icons (fa-star)
  4. If hasHalf: add half star (fa-star-half-alt)
  5. Fill remaining with empty stars (far fa-star)
  6. Return concatenated HTML string
Side Effects: none
```

#### `toggleMobileMenu(): void`
```
Input:  none
Output: void
Logic:  Toggle "show" class on #navList element
Side Effects: DOM class toggle
```

#### `changeDetailQty(delta: number): void`
```
Input:  delta — +1 or -1
Output: void
Logic:
  1. Read current value from #detailQty input
  2. New value = Math.max(1, current + delta)
  3. Set input value
Side Effects: DOM update
```

---

## 5. CSS Architecture

### 5.1 CSS Custom Properties (Design Tokens)

```css
:root {
    /* Colors */
    --primary:      #0d6efd;     /* Blue — buttons, links, accents */
    --primary-dark: #0a58ca;     /* Blue dark — hover states */
    --secondary:    #00b894;     /* Green — success, CTA */
    --accent:       #e17055;     /* Orange — badges, alerts */
    --dark:         #1a1a2e;     /* Dark navy — headers, footer */
    --dark-light:   #16213e;     /* Lighter navy — footer */
    --success:      #28a745;     /* Green — stock, confirmation */
    --danger:       #dc3545;     /* Red — errors, sale badges */
    --warning:      #ffc107;     /* Yellow — stars, warnings */

    /* Grays */
    --gray-100 to --gray-800;    /* Gray scale for text/bg */

    /* Layout */
    --shadow:       0 2px 15px rgba(0,0,0,0.08);   /* Card shadow */
    --shadow-lg:    0 5px 30px rgba(0,0,0,0.12);   /* Elevated shadow */
    --radius:       8px;         /* Default border radius */
    --radius-lg:    12px;        /* Card border radius */
    --transition:   all 0.3s ease;  /* Default transition */
    --font-main:    'Segoe UI', system fonts;
}
```

### 5.2 Component Hierarchy

```
style.css (single file, ~1400 lines)
│
├── Reset & Variables          (lines 1-60)
├── Global Elements            (lines 60-100)
├── Container                  (line ~100)
├── Top Bar                    (lines ~105-130)
├── Header / Navbar            (lines ~130-230)
├── Navigation                 (lines ~230-300)
├── Hero Banner                (lines ~300-380)
├── Buttons                    (lines ~380-460)
├── Section Styles             (lines ~460-490)
├── Categories Grid            (lines ~490-540)
├── Product Cards              (lines ~540-700)
├── Features Grid              (lines ~700-740)
├── CTA Banner                 (lines ~740-760)
├── Brands Section             (lines ~760-780)
├── Testimonials               (lines ~780-830)
├── Newsletter                 (lines ~830-870)
├── Footer                     (lines ~870-960)
├── Page Header                (lines ~960-990)
├── Products Page (sidebar)    (lines ~990-1080)
├── Product Detail             (lines ~1080-1170)
├── Cart Page                  (lines ~1170-1290)
├── Checkout Page              (lines ~1290-1400)
├── Toast Notification         (lines ~1400-1430)
├── Modal                      (lines ~1430-1460)
├── Back to Top                (lines ~1460-1490)
├── Responsive Breakpoints     (lines ~1490-1580)
│   ├── @media (max-width: 1024px)
│   ├── @media (max-width: 768px)
│   └── @media (max-width: 480px)
├── Skeleton Loading           (lines ~1580-1600)
└── Utility Classes            (lines ~1600-1620)
```

### 5.3 Responsive Behavior Matrix

| Component | Desktop (>1024px) | Tablet (768-1024px) | Mobile (<768px) |
|-----------|-------------------|---------------------|-----------------|
| Top Bar | Visible | Visible | Hidden |
| Search Bar | Inline with header | Inline | Full width, row 2 |
| Menu Toggle | Hidden | Hidden | Visible |
| Nav List | Horizontal | Horizontal | Vertical (toggled) |
| Hero | 2-column | 2-column | Single column, no visual |
| Products Grid | 4 columns | 3 columns | 2→1 columns |
| Products Page | Sidebar + Grid | Grid only | Grid only |
| Cart Layout | Items + Summary side | Stacked | Stacked, simplified |
| Checkout | Form + Summary side | Stacked | Stacked |
| Product Detail | Gallery + Info side | Stacked | Stacked |
| Footer | 4 columns | 2 columns | 1 column |

---

## 6. Event Handling

### 6.1 Event Listener Map

| Event | Element | Handler | Description |
|-------|---------|---------|-------------|
| `DOMContentLoaded` | `document` | Page-specific init | Initializes each page |
| `click` | `.btn` (Add to Cart) | `addToCart(id)` | Adds product to cart |
| `click` | `.btn` (Buy Now) | `buyNow(id)` | Add + redirect to checkout |
| `click` | `.cart-item-remove` | `removeFromCart(id)` | Removes from cart |
| `click` | `.quantity-selector button` | `updateCartQuantity()` | Changes quantity |
| `input` | `#searchInput` | `searchProducts(value)` | Debounced live search |
| `change` | `.filter-group checkbox` | `applyFilters()` | Re-filters products |
| `change` | `#sortSelect` | `applyFilters()` | Re-sorts products |
| `input` | `#priceMin, #priceMax` | `applyFilters()` | Price range filter |
| `change` | `payment radio` | `selectPayment(this)` | Highlights payment method |
| `submit` | `#checkoutForm` | `handleCheckout(e)` | Processes order |
| `submit` | `.newsletter-form` | (inline) | Shows toast |
| `click` | `#backToTop` | (inline) | Scrolls to top |
| `scroll` | `window` | (anonymous) | Shows/hides back-to-top |
| `click` | `document` | (anonymous) | Closes search dropdown |
| `click` | `.menu-toggle` | `toggleMobileMenu()` | Mobile nav toggle |

### 6.2 Event Flow Diagram — Add to Cart

```
User clicks "Add to Cart" button
         │
         ▼
onclick="addToCart(${product.id})"
         │
         ▼
┌────────────────────┐
│ addToCart(id, qty)  │
├────────────────────┤
│ 1. Find product    │──► products.find(p => p.id === id)
│ 2. Get cart        │──► getCart() ──► localStorage.getItem()
│ 3. Check existing  │──► cart.find(item => item.id === id)
│ 4. Update/Push     │──► increment qty OR push new item
│ 5. Save cart       │──► saveCart() ──► localStorage.setItem()
│ 6. Update badge    │──► updateCartCount() ──► DOM update
│ 7. Show toast      │──► showToast() ──► DOM animation
└────────────────────┘
```

---

## 7. State Management

### 7.1 Application State

The application has two types of state:

| State Type | Storage | Scope | Lifetime |
|-----------|---------|-------|----------|
| **Product Catalog** | In-memory (JS variable) | Global | Page load → unload |
| **Shopping Cart** | localStorage | Cross-session | Until cleared |
| **Filter State** | DOM (checkboxes/inputs) | Page | Page load → navigation |
| **URL Parameters** | URL query string | Shareable | Until navigation |

### 7.2 State Flow

```
┌─────────────────────────────────────────────────┐
│                   STATES                         │
│                                                  │
│  ┌────────────────┐    ┌──────────────────────┐  │
│  │ products[]     │    │ localStorage         │  │
│  │ (products-     │    │ Shivam_cart: [     │  │
│  │  data.js)      │    │   {id,name,price,    │  │
│  │                │    │    qty,...},          │  │
│  │ Read-only      │    │   ...                │  │
│  │ 36 items       │    │ ]                    │  │
│  └───────┬────────┘    └──────────┬───────────┘  │
│          │                        │               │
│          ▼                        ▼               │
│  ┌────────────────────────────────────────────┐  │
│  │              app.js functions              │  │
│  │                                            │  │
│  │  Reads products[] ──► Renders to DOM       │  │
│  │  Reads cart ──► Displays cart/checkout      │  │
│  │  Writes cart ◄── User actions (add/remove) │  │
│  └────────────────────────────────────────────┘  │
│                       │                           │
│                       ▼                           │
│  ┌────────────────────────────────────────────┐  │
│  │                   DOM                      │  │
│  │  Products grid, cart table, checkout form  │  │
│  │  Badge counts, toast notifications         │  │
│  └────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

---

## 8. Error Handling

| Scenario | Handling |
|---------|---------|
| `localStorage` corrupted/empty | `getCart()` returns `[]` via try-catch |
| Product ID not found in URL | Shows "Product Not Found" message with back link |
| Empty cart on checkout page | Redirects to `cart.html` |
| Search query < 2 chars | Hides dropdown, no API call |
| Form validation failure | Browser native `reportValidity()` |
| Invalid quantity input | `Math.max(1, parseInt(val) \|\| 1)` — defaults to 1 |
| `product` not found in `addToCart` | Early return, no action |

---

## 9. Pricing & Tax Logic

### 9.1 Pricing Rules

```
Selling Price = product.price (fixed, stored in database)
Original Price = product.originalPrice (MRP)
Discount = product.discount (pre-calculated percentage)

Display Format:
  ₹1,850  ₹2,500  26% OFF
  ▲       ▲       ▲
  current original discount
```

### 9.2 Cart Total Calculation

```
Subtotal = Σ (item.price × item.quantity)  for all items

Shipping:
  IF subtotal >= 5000 THEN shipping = 0 (Free)
  ELSE shipping = 199

Tax (GST):
  tax = Math.round(subtotal × 0.18)

Total = subtotal + shipping + tax
```

### 9.3 Order ID Generation

```
Format: "SS-" + last 6 digits of Date.now()
Example: SS-834521
Note: Not guaranteed unique — sufficient for demo, needs
      server-side generation in production.
```

---

## 10. API Contract (Future — Phase 2)

### 10.1 Proposed REST Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|-------------|----------|
| `GET` | `/api/products` | List all products | — | `Product[]` |
| `GET` | `/api/products/:id` | Get single product | — | `Product` |
| `GET` | `/api/products?category=X` | Filter by category | — | `Product[]` |
| `GET` | `/api/products?search=Q` | Search products | — | `Product[]` |
| `GET` | `/api/categories` | List categories | — | `Category[]` |
| `POST` | `/api/cart` | Add to cart | `{productId, qty}` | `Cart` |
| `GET` | `/api/cart` | Get user's cart | — | `Cart` |
| `PUT` | `/api/cart/:itemId` | Update quantity | `{quantity}` | `Cart` |
| `DELETE` | `/api/cart/:itemId` | Remove from cart | — | `Cart` |
| `POST` | `/api/orders` | Place order | `CheckoutForm` | `Order` |
| `GET` | `/api/orders/:id` | Get order details | — | `Order` |
| `POST` | `/api/auth/register` | Register user | `{name, email, pass}` | `{token}` |
| `POST` | `/api/auth/login` | Login | `{email, pass}` | `{token}` |
| `POST` | `/api/payments/create` | Init payment | `{orderId, amount}` | `{paymentUrl}` |
| `POST` | `/api/payments/verify` | Verify payment | `{paymentId, sig}` | `{status}` |

### 10.2 Proposed Database Schema (MongoDB)

```javascript
// Products Collection
{
  _id: ObjectId,
  name: String,
  slug: String,
  category: { type: ObjectId, ref: 'Category' },
  brand: String,
  price: Number,
  originalPrice: Number,
  images: [String],        // S3/CDN URLs
  description: String,
  features: [String],
  sku: String,
  stock: Number,
  rating: { average: Number, count: Number },
  tags: [String],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}

// Orders Collection
{
  _id: ObjectId,
  orderId: String,          // "SS-XXXXXX"
  user: { type: ObjectId, ref: 'User' },
  items: [{
    product: { type: ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    quantity: Number
  }],
  billing: {
    firstName: String, lastName: String,
    email: String, phone: String,
    address: String, city: String,
    state: String, pincode: String,
    gst: String
  },
  totals: {
    subtotal: Number,
    shipping: Number,
    tax: Number,
    total: Number
  },
  payment: {
    method: String,
    status: String,         // "pending", "completed", "failed"
    transactionId: String
  },
  status: String,           // "placed", "confirmed", "shipped", "delivered", "cancelled"
  notes: String,
  createdAt: Date,
  updatedAt: Date
}

// Users Collection
{
  _id: ObjectId,
  name: String,
  email: String,            // unique
  passwordHash: String,     // bcrypt
  phone: String,
  addresses: [Address],
  role: String,             // "customer", "admin"
  createdAt: Date
}
```

---

## 11. Testing Strategy (Recommended)

### 11.1 Manual Test Cases

| # | Test Case | Steps | Expected Result |
|---|-----------|-------|----------------|
| 1 | Homepage loads | Open index.html | All sections render, featured products visible |
| 2 | Category navigation | Click "Surgical Instruments" | products.html with filtered results |
| 3 | Product search | Type "stethoscope" in search | Dropdown shows matching products |
| 4 | Add to cart | Click "Add to Cart" on any product | Toast shows, badge increments |
| 5 | Cart persistence | Add item, close browser, reopen cart | Item still in cart |
| 6 | Quantity update | Change quantity in cart | Total recalculates |
| 7 | Remove from cart | Click trash icon | Item removed, totals update |
| 8 | Empty cart | Remove all items | Empty cart state shown |
| 9 | Buy Now | Click "Buy Now" on detail page | Added to cart + redirect to checkout |
| 10 | Checkout validation | Submit empty form | Browser validation errors shown |
| 11 | Order placement | Fill form, submit | Confirmation page with order ID |
| 12 | Filter by price | Set min=1000, max=5000 | Only products in range shown |
| 13 | Sort by price | Select "Price: Low to High" | Products sorted ascending |
| 14 | Mobile responsive | Resize to 375px width | Mobile layout, hamburger menu |
| 15 | Free shipping | Add items > ₹5,000 | Shipping shows "FREE" |

### 11.2 Automated Testing (Future)

```
Unit Tests (Jest):
  - getCart(), saveCart(), getCartTotals()
  - escapeHtml(), formatPrice(), getStars()
  - applyFilters() with mock DOM

Integration Tests (Cypress):
  - Full user flow: browse → search → detail → cart → checkout
  - Filter combinations
  - Cart persistence across pages

Performance Tests (Lighthouse):
  - Performance score > 90
  - Accessibility score > 90
  - Best Practices score > 90
```

---

*End of Low-Level Design Document*
