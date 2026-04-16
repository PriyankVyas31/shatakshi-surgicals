// ============================================================
// Shivam Surgicals - Main Application JavaScript
// ============================================================

// ==================== CART MANAGEMENT ====================
function getCart() {
    try {
        return JSON.parse(localStorage.getItem('Shivam_cart')) || [];
    } catch {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem('Shivam_cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badges = document.querySelectorAll('#cartCount');
    badges.forEach(badge => {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    });
}

function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const cart = getCart();
    const existing = cart.find(item => item.id === productId);

    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            icon: product.icon,
            category: product.categoryName,
            quantity: quantity
        });
    }

    saveCart(cart);
    showToast(`${product.name} added to cart!`, 'success');
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    renderCart();
}

function updateCartQuantity(productId, newQuantity) {
    const cart = getCart();
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, parseInt(newQuantity) || 1);
        saveCart(cart);
        renderCart();
    }
}

function getCartTotals() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= 5000 ? 0 : 199;
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + shipping + tax;
    return { subtotal, shipping, tax, total, itemCount: cart.length };
}

// ==================== TOAST NOTIFICATION ====================
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        ${escapeHtml(message)}
    `;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ==================== HTML ESCAPING ====================
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==================== FORMAT CURRENCY ====================
function formatPrice(price) {
    return '₹' + price.toLocaleString('en-IN');
}

// ==================== STAR RATING ====================
function getStars(rating) {
    let stars = '';
    const full = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;

    for (let i = 0; i < full; i++) stars += '<i class="fas fa-star"></i>';
    if (hasHalf) stars += '<i class="fas fa-star-half-alt"></i>';
    const empty = 5 - full - (hasHalf ? 1 : 0);
    for (let i = 0; i < empty; i++) stars += '<i class="far fa-star"></i>';

    return stars;
}

// ==================== PRODUCT CARD GENERATOR ====================
function createProductCard(product) {
    const badgeHtml = product.tags && product.tags.includes('sale')
        ? '<span class="product-badge sale">SALE</span>'
        : product.tags && product.tags.includes('bestseller')
            ? '<span class="product-badge new">BEST SELLER</span>'
            : '';

    return `
        <div class="product-card">
            ${badgeHtml}
            <div class="product-image">
                <i class="fas ${product.icon}" style="font-size:4rem; color:var(--gray-400);"></i>
                <div class="product-actions-overlay">
                    <button title="Quick View" onclick="window.location.href='product-detail.html?id=${product.id}'">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button title="Add to Cart" onclick="event.stopPropagation(); addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <div class="product-category">${escapeHtml(product.categoryName)}</div>
                <h3 class="product-name">
                    <a href="product-detail.html?id=${product.id}">${escapeHtml(product.name)}</a>
                </h3>
                <div class="product-rating">
                    <span class="stars">${getStars(product.rating)}</span>
                    <span class="rating-count">(${product.reviews})</span>
                </div>
                <div class="product-price">
                    <span class="price-current">${formatPrice(product.price)}</span>
                    ${product.originalPrice > product.price ? `
                        <span class="price-original">${formatPrice(product.originalPrice)}</span>
                        <span class="price-discount">${product.discount}% OFF</span>
                    ` : ''}
                </div>
                <button class="btn btn-primary btn-sm" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
            </div>
        </div>
    `;
}

// ==================== SEARCH FUNCTIONALITY ====================
let searchTimeout;
function searchProducts(query) {
    clearTimeout(searchTimeout);
    const resultsDiv = document.getElementById('searchResults');
    if (!resultsDiv) return;

    if (!query || query.length < 2) {
        resultsDiv.style.display = 'none';
        return;
    }

    searchTimeout = setTimeout(() => {
        const q = query.toLowerCase();
        const results = products.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.categoryName.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q)
        ).slice(0, 8);

        if (results.length === 0) {
            resultsDiv.innerHTML = '<div style="padding:16px; color:var(--gray-600); text-align:center;">No products found</div>';
        } else {
            resultsDiv.innerHTML = results.map(p => `
                <a href="product-detail.html?id=${p.id}" style="display:flex; align-items:center; gap:12px; padding:12px 16px; border-bottom:1px solid #eee; color:var(--gray-800);"
                   onmouseover="this.style.background='var(--gray-100)'" onmouseout="this.style.background='transparent'">
                    <i class="fas ${p.icon}" style="font-size:1.2rem; color:var(--primary); width:30px; text-align:center;"></i>
                    <div style="flex:1;">
                        <div style="font-size:0.9rem; font-weight:600;">${escapeHtml(p.name)}</div>
                        <div style="font-size:0.8rem; color:var(--gray-600);">${escapeHtml(p.categoryName)}</div>
                    </div>
                    <div style="font-weight:700; color:var(--primary);">${formatPrice(p.price)}</div>
                </a>
            `).join('');
        }

        resultsDiv.style.display = 'block';
    }, 300);
}

// Close search on click outside
document.addEventListener('click', function(e) {
    const resultsDiv = document.getElementById('searchResults');
    const searchBar = document.querySelector('.search-bar');
    if (resultsDiv && searchBar && !searchBar.contains(e.target)) {
        resultsDiv.style.display = 'none';
    }
});

// ==================== MOBILE MENU ====================
function toggleMobileMenu() {
    const navList = document.getElementById('navList');
    if (navList) navList.classList.toggle('show');
}

// ==================== PRODUCTS PAGE ====================
function initProductsPage() {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');
    const tag = params.get('tag');
    const search = params.get('search');

    // Set page title
    const pageTitle = document.getElementById('pageTitle');
    const breadcrumb = document.getElementById('breadcrumbCurrent');

    if (category) {
        const catNames = {
            'surgical-instruments': 'Surgical Instruments',
            'diagnostic-equipment': 'Diagnostic Equipment',
            'hospital-furniture': 'Hospital Furniture',
            'ot-equipment': 'OT Equipment',
            'disposables': 'Disposables & Consumables',
            'orthopaedic': 'Orthopaedic Supplies',
            'pharmaceuticals': 'Pharmaceuticals'
        };
        const name = catNames[category] || 'Products';
        if (pageTitle) pageTitle.textContent = name;
        if (breadcrumb) breadcrumb.textContent = name;

        // Check the corresponding filter checkbox
        const checkbox = document.querySelector(`input[value="${category}"]`);
        if (checkbox) checkbox.checked = true;
    } else if (tag === 'bestseller') {
        if (pageTitle) pageTitle.textContent = 'Best Sellers';
        if (breadcrumb) breadcrumb.textContent = 'Best Sellers';
    } else if (tag === 'sale') {
        if (pageTitle) pageTitle.textContent = 'Special Offers';
        if (breadcrumb) breadcrumb.textContent = 'Special Offers';
    }

    applyFilters();
}

function applyFilters() {
    const params = new URLSearchParams(window.location.search);
    const urlCategory = params.get('category');
    const urlTag = params.get('tag');

    // Get checked categories
    const checkedCategories = Array.from(document.querySelectorAll('.filter-group input[type="checkbox"]:not(.brand-filter):not(.rating-filter):checked'))
        .map(cb => cb.value);

    // Get checked brands
    const checkedBrands = Array.from(document.querySelectorAll('.brand-filter:checked'))
        .map(cb => cb.value);

    // Get checked ratings
    const checkedRatings = Array.from(document.querySelectorAll('.rating-filter:checked'))
        .map(cb => parseFloat(cb.value));

    // Get price range
    const priceMin = parseFloat(document.getElementById('priceMin')?.value) || 0;
    const priceMax = parseFloat(document.getElementById('priceMax')?.value) || Infinity;

    // Get sort
    const sortValue = document.getElementById('sortSelect')?.value || 'default';

    let filtered = [...products];

    // Apply URL filters
    if (urlCategory && checkedCategories.length === 0) {
        filtered = filtered.filter(p => p.category === urlCategory);
    }

    if (urlTag) {
        filtered = filtered.filter(p => p.tags && p.tags.includes(urlTag));
    }

    // Apply sidebar filters
    if (checkedCategories.length > 0) {
        filtered = filtered.filter(p => checkedCategories.includes(p.category));
    }

    if (checkedBrands.length > 0) {
        filtered = filtered.filter(p => checkedBrands.includes(p.brand));
    }

    if (checkedRatings.length > 0) {
        const minRating = Math.min(...checkedRatings);
        filtered = filtered.filter(p => p.rating >= minRating);
    }

    // Price filter
    filtered = filtered.filter(p => p.price >= priceMin && p.price <= priceMax);

    // Sort
    switch (sortValue) {
        case 'price-low':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'name-az':
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-za':
            filtered.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'rating':
            filtered.sort((a, b) => b.rating - a.rating);
            break;
    }

    // Render
    const grid = document.getElementById('productsGrid');
    const count = document.getElementById('resultCount');

    if (grid) {
        if (filtered.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align:center; padding:60px 20px;">
                    <i class="fas fa-search" style="font-size:3rem; color:var(--gray-400); margin-bottom:16px;"></i>
                    <h3 style="margin-bottom:8px; color:var(--dark);">No products found</h3>
                    <p style="color:var(--gray-600);">Try adjusting your filters or search terms</p>
                    <button class="btn btn-primary mt-2" onclick="clearFilters()">Clear Filters</button>
                </div>
            `;
        } else {
            grid.innerHTML = filtered.map(p => createProductCard(p)).join('');
        }
    }

    if (count) {
        count.textContent = `Showing ${filtered.length} product${filtered.length !== 1 ? 's' : ''}`;
    }
}

function clearFilters() {
    // Clear all checkboxes
    document.querySelectorAll('.sidebar input[type="checkbox"]').forEach(cb => cb.checked = false);

    // Clear price inputs
    const minInput = document.getElementById('priceMin');
    const maxInput = document.getElementById('priceMax');
    if (minInput) minInput.value = '';
    if (maxInput) maxInput.value = '';

    // Reset sort
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) sortSelect.value = 'default';

    // Remove URL params and reload
    window.history.replaceState({}, '', 'products.html');
    applyFilters();
}

// ==================== PRODUCT DETAIL PAGE ====================
function initProductDetailPage() {
    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get('id'));

    const product = products.find(p => p.id === productId);
    const detailContainer = document.getElementById('productDetail');
    const breadcrumb = document.getElementById('breadcrumbProduct');

    if (!product || !detailContainer) {
        if (detailContainer) {
            detailContainer.innerHTML = `
                <div style="grid-column:1/-1; text-align:center; padding:60px;">
                    <i class="fas fa-exclamation-triangle" style="font-size:3rem; color:var(--warning); margin-bottom:16px;"></i>
                    <h2>Product Not Found</h2>
                    <p style="color:var(--gray-600); margin:12px 0 24px;">The product you're looking for doesn't exist or has been removed.</p>
                    <a href="products.html" class="btn btn-primary">Browse Products</a>
                </div>
            `;
        }
        return;
    }

    if (breadcrumb) breadcrumb.textContent = product.name;
    document.title = `${product.name} - Shivam Surgicals`;

    detailContainer.innerHTML = `
        <!-- Product Gallery -->
        <div class="product-gallery">
            <div class="product-main-image">
                <i class="fas ${product.icon}" style="font-size:6rem; color:var(--gray-400);"></i>
            </div>
            <div class="product-thumbnails">
                <div class="thumb active"><i class="fas ${product.icon}" style="font-size:1.2rem; color:var(--gray-400);"></i></div>
                <div class="thumb"><i class="fas ${product.icon}" style="font-size:1.2rem; color:var(--gray-400);"></i></div>
                <div class="thumb"><i class="fas ${product.icon}" style="font-size:1.2rem; color:var(--gray-400);"></i></div>
            </div>
        </div>

        <!-- Product Info -->
        <div class="product-details-info">
            <div class="product-category">${escapeHtml(product.categoryName)}</div>
            <h1>${escapeHtml(product.name)}</h1>

            <div class="product-rating">
                <span class="stars">${getStars(product.rating)}</span>
                <span class="rating-count">${product.rating} (${product.reviews} reviews)</span>
            </div>

            <div class="product-price">
                <span class="price-current">${formatPrice(product.price)}</span>
                ${product.originalPrice > product.price ? `
                    <span class="price-original">${formatPrice(product.originalPrice)}</span>
                    <span class="price-discount">${product.discount}% OFF</span>
                ` : ''}
            </div>

            <p class="product-description">${escapeHtml(product.description)}</p>

            <div class="product-meta">
                <div class="meta-item"><strong>Brand:</strong> <span>${escapeHtml(product.brand)}</span></div>
                <div class="meta-item"><strong>SKU:</strong> <span>${escapeHtml(product.sku)}</span></div>
                <div class="meta-item"><strong>Availability:</strong> <span style="color:${product.stock > 0 ? 'var(--success)' : 'var(--danger)'};">${product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}</span></div>
                <div class="meta-item"><strong>Category:</strong> <span><a href="products.html?category=${product.category}" style="color:var(--primary);">${escapeHtml(product.categoryName)}</a></span></div>
            </div>

            ${product.features ? `
                <div style="margin-bottom:24px;">
                    <h3 style="font-size:1rem; margin-bottom:10px;">Key Features:</h3>
                    <ul style="display:flex; flex-direction:column; gap:6px;">
                        ${product.features.map(f => `<li style="display:flex; align-items:center; gap:8px; font-size:0.9rem; color:var(--gray-700);"><i class="fas fa-check-circle" style="color:var(--success);"></i> ${escapeHtml(f)}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}

            <div style="display:flex; align-items:center; gap:16px; margin-bottom:24px;">
                <span style="font-weight:600;">Quantity:</span>
                <div class="quantity-selector">
                    <button onclick="changeDetailQty(-1)">-</button>
                    <input type="number" id="detailQty" value="1" min="1" max="${product.stock}">
                    <button onclick="changeDetailQty(1)">+</button>
                </div>
            </div>

            <div class="product-actions">
                <button class="btn btn-primary btn-lg" onclick="addToCart(${product.id}, parseInt(document.getElementById('detailQty').value) || 1)">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
                <button class="btn btn-secondary btn-lg" onclick="buyNow(${product.id})">
                    <i class="fas fa-bolt"></i> Buy Now
                </button>
            </div>

            <div style="margin-top:24px; display:flex; gap:24px; flex-wrap:wrap;">
                <div style="display:flex; align-items:center; gap:8px; font-size:0.85rem; color:var(--gray-600);">
                    <i class="fas fa-truck" style="color:var(--primary);"></i> Free shipping above ₹5,000
                </div>
                <div style="display:flex; align-items:center; gap:8px; font-size:0.85rem; color:var(--gray-600);">
                    <i class="fas fa-undo" style="color:var(--primary);"></i> 15-day returns
                </div>
                <div style="display:flex; align-items:center; gap:8px; font-size:0.85rem; color:var(--gray-600);">
                    <i class="fas fa-shield-alt" style="color:var(--primary);"></i> Genuine product
                </div>
            </div>
        </div>
    `;

    // Related products
    const related = products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    const relatedGrid = document.getElementById('relatedProducts');
    if (relatedGrid) {
        relatedGrid.innerHTML = related.map(p => createProductCard(p)).join('');
    }
}

function changeDetailQty(delta) {
    const input = document.getElementById('detailQty');
    if (!input) return;
    let val = parseInt(input.value) || 1;
    val = Math.max(1, val + delta);
    input.value = val;
}

function buyNow(productId) {
    const qty = parseInt(document.getElementById('detailQty')?.value) || 1;
    addToCart(productId, qty);
    window.location.href = 'checkout.html';
}

// ==================== CART PAGE ====================
function renderCart() {
    const cartPage = document.getElementById('cartPage');
    if (!cartPage) return;

    const cart = getCart();

    if (cart.length === 0) {
        cartPage.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart" style="font-size:5rem; color:var(--gray-300); margin-bottom:20px;"></i>
                <h2>Your Cart is Empty</h2>
                <p>Looks like you haven't added anything to your cart yet. Browse our products and find what you need!</p>
                <a href="products.html" class="btn btn-primary btn-lg"><i class="fas fa-shopping-bag"></i> Start Shopping</a>
            </div>
        `;
        return;
    }

    const totals = getCartTotals();

    cartPage.innerHTML = `
        <div class="cart-layout">
            <div class="cart-items">
                <div class="cart-header">
                    <span>Product</span>
                    <span>Price</span>
                    <span>Quantity</span>
                    <span>Total</span>
                    <span></span>
                </div>
                ${cart.map(item => `
                    <div class="cart-item">
                        <div class="cart-product">
                            <div class="cart-product-image">
                                <i class="fas ${item.icon}" style="font-size:1.5rem; color:var(--gray-400);"></i>
                            </div>
                            <div class="cart-product-info">
                                <h3><a href="product-detail.html?id=${item.id}" style="color:var(--dark);">${escapeHtml(item.name)}</a></h3>
                                <p>${escapeHtml(item.category)}</p>
                            </div>
                        </div>
                        <div class="cart-item-price">${formatPrice(item.price)}</div>
                        <div>
                            <div class="quantity-selector">
                                <button onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                                <input type="number" value="${item.quantity}" min="1" onchange="updateCartQuantity(${item.id}, this.value)">
                                <button onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                            </div>
                        </div>
                        <div class="cart-item-total">${formatPrice(item.price * item.quantity)}</div>
                        <button class="cart-item-remove" onclick="removeFromCart(${item.id})" title="Remove item">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                `).join('')}
            </div>

            <div class="cart-summary">
                <h3>Order Summary</h3>
                <div class="summary-row">
                    <span>Subtotal (${cart.length} items)</span>
                    <span>${formatPrice(totals.subtotal)}</span>
                </div>
                <div class="summary-row">
                    <span>Shipping</span>
                    <span style="color:${totals.shipping === 0 ? 'var(--success)' : 'inherit'};">
                        ${totals.shipping === 0 ? 'FREE' : formatPrice(totals.shipping)}
                    </span>
                </div>
                <div class="summary-row">
                    <span>GST (18%)</span>
                    <span>${formatPrice(totals.tax)}</span>
                </div>
                ${totals.shipping > 0 ? `
                    <div style="background:var(--gray-100); padding:10px; border-radius:8px; margin:10px 0; font-size:0.85rem; color:var(--gray-600);">
                        <i class="fas fa-info-circle" style="color:var(--primary);"></i>
                        Add ${formatPrice(5000 - totals.subtotal)} more for free shipping!
                    </div>
                ` : ''}
                <div class="summary-row total">
                    <span>Total</span>
                    <span>${formatPrice(totals.total)}</span>
                </div>

                <div class="coupon-input">
                    <input type="text" placeholder="Coupon code">
                    <button class="btn btn-outline-primary btn-sm">Apply</button>
                </div>

                <a href="checkout.html" class="btn btn-primary btn-lg btn-block">
                    <i class="fas fa-lock"></i> Proceed to Checkout
                </a>
                <a href="products.html" class="btn btn-outline-primary btn-sm btn-block mt-1" style="border-radius:50px;">
                    <i class="fas fa-arrow-left"></i> Continue Shopping
                </a>
            </div>
        </div>
    `;
}

// ==================== CHECKOUT PAGE ====================
function renderCheckout() {
    const cart = getCart();
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }

    const totals = getCartTotals();

    // Render order items
    const orderItems = document.getElementById('orderItems');
    if (orderItems) {
        orderItems.innerHTML = cart.map(item => `
            <div class="order-item">
                <div class="item-name">
                    <span>${escapeHtml(item.name)}</span>
                    <span class="item-qty">x${item.quantity}</span>
                </div>
                <span class="item-price">${formatPrice(item.price * item.quantity)}</span>
            </div>
        `).join('');
    }

    // Update totals
    const subtotalEl = document.getElementById('checkoutSubtotal');
    const shippingEl = document.getElementById('checkoutShipping');
    const taxEl = document.getElementById('checkoutTax');
    const totalEl = document.getElementById('checkoutTotal');

    if (subtotalEl) subtotalEl.textContent = formatPrice(totals.subtotal);
    if (shippingEl) {
        shippingEl.textContent = totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping);
        shippingEl.style.color = totals.shipping === 0 ? 'var(--success)' : 'inherit';
    }
    if (taxEl) taxEl.textContent = formatPrice(totals.tax);
    if (totalEl) totalEl.textContent = formatPrice(totals.total);
}

function selectPayment(radio) {
    document.querySelectorAll('.payment-method').forEach(pm => pm.classList.remove('selected'));
    radio.closest('.payment-method').classList.add('selected');
}

function handleCheckout(event) {
    event.preventDefault();

    const form = document.getElementById('checkoutForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Generate order ID
    const orderId = 'SS-' + Date.now().toString().slice(-6);

    // Show confirmation
    const checkoutPage = document.getElementById('checkoutPage');
    const confirmation = document.getElementById('orderConfirmation');
    const orderIdEl = document.getElementById('confirmOrderId');

    if (checkoutPage) checkoutPage.style.display = 'none';
    if (confirmation) confirmation.style.display = 'block';
    if (orderIdEl) orderIdEl.textContent = `Order #${orderId}`;

    // Clear cart
    localStorage.removeItem('Shivam_cart');
    updateCartCount();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==================== BACK TO TOP ====================
window.addEventListener('scroll', function() {
    const btn = document.getElementById('backToTop');
    if (btn) {
        if (window.scrollY > 400) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    }
});

// ==================== INITIALIZE ====================
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
});
