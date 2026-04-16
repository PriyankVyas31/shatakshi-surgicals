// ============================================================
// Shivam Surgicals - Product Chatbot
// ============================================================

(function () {
    'use strict';

    // ==================== CHATBOT STATE ====================
    let chatOpen = false;
    let conversationHistory = [];

    // ==================== INJECT CHATBOT HTML ====================
    function initChatbot() {
        const chatHTML = `
            <!-- Chatbot Toggle Button -->
            <button class="chatbot-toggle" id="chatbotToggle" onclick="toggleChatbot()" title="Chat with us">
                <i class="fas fa-comment-medical" id="chatbotIcon"></i>
                <span class="badge-dot" id="chatbotDot"></span>
            </button>

            <!-- Chatbot Window -->
            <div class="chatbot-window" id="chatbotWindow">
                <div class="chatbot-header">
                    <div class="chatbot-header-info">
                        <div class="chatbot-avatar">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div class="chatbot-header-text">
                            <h4>Shivam Assistant</h4>
                            <p><i class="fas fa-circle" style="font-size:0.5rem;color:#4ade80;"></i> Online — Ask me about products</p>
                        </div>
                    </div>
                    <button class="chatbot-close" onclick="toggleChatbot()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <div class="chatbot-messages" id="chatMessages">
                </div>

                <div class="chatbot-input">
                    <input type="text" id="chatInput" placeholder="Ask about products, prices, categories..."
                           onkeydown="if(event.key==='Enter') sendChatMessage()">
                    <button onclick="sendChatMessage()">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatHTML);

        // Show welcome message after short delay
        setTimeout(() => {
            addBotMessage(getWelcomeMessage());
        }, 800);
    }

    // ==================== TOGGLE CHATBOT ====================
    window.toggleChatbot = function () {
        const win = document.getElementById('chatbotWindow');
        const icon = document.getElementById('chatbotIcon');
        const dot = document.getElementById('chatbotDot');
        if (!win) return;

        chatOpen = !chatOpen;
        win.classList.toggle('open', chatOpen);
        icon.className = chatOpen ? 'fas fa-times' : 'fas fa-comment-medical';
        if (dot) dot.style.display = chatOpen ? 'none' : 'block';

        if (chatOpen) {
            setTimeout(() => {
                document.getElementById('chatInput')?.focus();
            }, 300);
        }
    };

    // ==================== SEND MESSAGE ====================
    window.sendChatMessage = function () {
        const input = document.getElementById('chatInput');
        if (!input) return;

        const text = input.value.trim();
        if (!text) return;

        input.value = '';
        addUserMessage(text);
        conversationHistory.push({ role: 'user', text: text });

        // Show typing indicator
        showTyping();

        // Process after a short delay for natural feel
        setTimeout(() => {
            removeTyping();
            const response = generateResponse(text);
            addBotMessage(response);
            conversationHistory.push({ role: 'bot', text: response });
        }, 600 + Math.random() * 600);
    };

    // ==================== QUICK REPLY ====================
    window.chatQuickReply = function (text) {
        document.getElementById('chatInput').value = text;
        window.sendChatMessage();
    };

    // ==================== ADD MESSAGES ====================
    function addBotMessage(html) {
        const container = document.getElementById('chatMessages');
        if (!container) return;

        const msg = document.createElement('div');
        msg.className = 'chat-message bot';
        msg.innerHTML = `
            <div class="msg-avatar"><i class="fas fa-robot"></i></div>
            <div class="chat-bubble">${html}</div>
        `;
        container.appendChild(msg);
        container.scrollTop = container.scrollHeight;
    }

    function addUserMessage(text) {
        const container = document.getElementById('chatMessages');
        if (!container) return;

        const msg = document.createElement('div');
        msg.className = 'chat-message user';
        msg.innerHTML = `
            <div class="msg-avatar"><i class="fas fa-user"></i></div>
            <div class="chat-bubble">${escapeHtmlChat(text)}</div>
        `;
        container.appendChild(msg);
        container.scrollTop = container.scrollHeight;
    }

    function showTyping() {
        const container = document.getElementById('chatMessages');
        if (!container) return;

        const typing = document.createElement('div');
        typing.className = 'chat-message bot';
        typing.id = 'typingIndicator';
        typing.innerHTML = `
            <div class="msg-avatar"><i class="fas fa-robot"></i></div>
            <div class="chat-bubble">
                <div class="typing-indicator">
                    <span></span><span></span><span></span>
                </div>
            </div>
        `;
        container.appendChild(typing);
        container.scrollTop = container.scrollHeight;
    }

    function removeTyping() {
        document.getElementById('typingIndicator')?.remove();
    }

    function escapeHtmlChat(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ==================== WELCOME MESSAGE ====================
    function getWelcomeMessage() {
        return `
            👋 Hi! I'm <strong>Shivam Assistant</strong>. I can help you find surgical instruments, medical equipment, and pharmaceutical products.
            <div class="chat-quick-replies">
                <button onclick="chatQuickReply('Show all categories')">📂 Categories</button>
                <button onclick="chatQuickReply('Show best sellers')">🔥 Best Sellers</button>
                <button onclick="chatQuickReply('Show offers')">🏷️ Offers</button>
                <button onclick="chatQuickReply('Search stethoscope')">🔍 Search</button>
                <button onclick="chatQuickReply('Shipping info')">🚚 Shipping</button>
            </div>
        `;
    }

    // ==================== RESPONSE GENERATOR ====================
    function generateResponse(input) {
        const q = input.toLowerCase().trim();

        // Greetings
        if (/^(hi|hello|hey|namaste|good morning|good evening|hii+)/.test(q)) {
            return `Hello! 👋 Welcome to <strong>Shivam Surgicals</strong>. How can I help you today?
                <div class="chat-quick-replies">
                    <button onclick="chatQuickReply('Show categories')">Browse Categories</button>
                    <button onclick="chatQuickReply('Best sellers')">Best Sellers</button>
                    <button onclick="chatQuickReply('I need help')">I need help</button>
                </div>`;
        }

        // Thanks
        if (/thank|thanks|dhanyavaad|shukriya/.test(q)) {
            return `You're welcome! 😊 Feel free to ask if you need anything else.`;
        }

        // Help
        if (/^(help|i need help|what can you do|how can you help)/.test(q)) {
            return `I can help you with:
                <br>🔍 <strong>Search products</strong> — e.g. "search stethoscope"
                <br>📂 <strong>Browse categories</strong> — e.g. "show surgical instruments"
                <br>💰 <strong>Price info</strong> — e.g. "price of BP monitor"
                <br>📦 <strong>Stock availability</strong> — e.g. "is autoclave in stock?"
                <br>🔥 <strong>Best sellers & offers</strong>
                <br>🚚 <strong>Shipping & returns info</strong>
                <br>📞 <strong>Contact information</strong>
                <div class="chat-quick-replies">
                    <button onclick="chatQuickReply('Show categories')">Categories</button>
                    <button onclick="chatQuickReply('Search BP monitor')">Search BP Monitor</button>
                    <button onclick="chatQuickReply('Shipping info')">Shipping</button>
                </div>`;
        }

        // Categories
        if (/categor|all categor|show categor|browse categor|types|what do you sell/.test(q)) {
            return `We have <strong>7 categories</strong> of products:
                <div class="chat-quick-replies">
                    <button onclick="chatQuickReply('Show surgical instruments')">🔪 Surgical Instruments</button>
                    <button onclick="chatQuickReply('Show diagnostic equipment')">🩺 Diagnostics</button>
                    <button onclick="chatQuickReply('Show hospital furniture')">🛏️ Hospital Furniture</button>
                    <button onclick="chatQuickReply('Show OT equipment')">💡 OT Equipment</button>
                    <button onclick="chatQuickReply('Show disposables')">🧤 Disposables</button>
                    <button onclick="chatQuickReply('Show orthopaedic')">🦴 Orthopaedic</button>
                    <button onclick="chatQuickReply('Show pharmaceuticals')">💊 Pharmaceuticals</button>
                </div>`;
        }

        // Best sellers
        if (/best.?sell|popular|top.?sell|trending|most.?bought/.test(q)) {
            const bestsellers = products.filter(p => p.tags && p.tags.includes('bestseller')).slice(0, 5);
            return `🔥 Here are our <strong>Best Sellers</strong>:` + formatProductList(bestsellers) +
                `<br><a href="products.html?tag=bestseller" style="font-size:0.85rem;">View all best sellers →</a>`;
        }

        // Offers / Sales
        if (/offer|sale|discount|deal|cheap|save|coupon|promo/.test(q)) {
            const onSale = products.filter(p => p.tags && p.tags.includes('sale')).slice(0, 5);
            return `🏷️ Products on <strong>special offer</strong>:` + formatProductList(onSale) +
                `<br><a href="products.html?tag=sale" style="font-size:0.85rem;">View all offers →</a>`;
        }

        // Category-specific queries
        const categoryMap = {
            'surgical.?instrument|scissors|forceps|scalpel|retractor|needle.?holder|suture.?kit': 'surgical-instruments',
            'diagnostic|bp.?monitor|blood.?pressure|stethoscope|oximeter|thermometer|glucometer|nebulizer|ent.?set': 'diagnostic-equipment',
            'hospital.?furniture|bed|wheelchair|examination.?table|iv.?stand|trolley': 'hospital-furniture',
            'ot.?equipment|cautery|suction.?machine|autoclave|ot.?light|steriliz': 'ot-equipment',
            'disposable|glove|syringe|mask|cannula|cotton|consumable': 'disposables',
            'orthopaedic|orthopedic|knee.?support|cervical|walking.?stick|bandage|brace|splint': 'orthopaedic',
            'pharmaceutical|medicine|antiseptic|sanitizer|first.?aid|betadine|iodine|spirit|hydrogen': 'pharmaceuticals'
        };

        for (const [pattern, category] of Object.entries(categoryMap)) {
            if (new RegExp(pattern).test(q)) {
                const catProducts = products.filter(p => p.category === category);
                const catName = catProducts[0]?.categoryName || category;
                const display = catProducts.slice(0, 5);
                return `Here are products in <strong>${escapeHtmlChat(catName)}</strong> (${catProducts.length} items):` +
                    formatProductList(display) +
                    `<br><a href="products.html?category=${category}" style="font-size:0.85rem;">View all ${escapeHtmlChat(catName)} →</a>`;
            }
        }

        // Price query
        if (/price|cost|how much|kya rate|kitna|kitne|rate/.test(q)) {
            const found = searchInProducts(q.replace(/price|cost|of|how much|is|the|what|kya|rate|kitna|kitne/gi, '').trim());
            if (found.length > 0) {
                return `💰 Here are the prices:` + formatProductList(found.slice(0, 5));
            }
            return `Please specify a product name. For example: <em>"price of stethoscope"</em> or <em>"BP monitor cost"</em>
                <div class="chat-quick-replies">
                    <button onclick="chatQuickReply('Price of stethoscope')">Stethoscope</button>
                    <button onclick="chatQuickReply('Price of BP monitor')">BP Monitor</button>
                    <button onclick="chatQuickReply('Price of gloves')">Gloves</button>
                </div>`;
        }

        // Stock / availability
        if (/stock|availab|in.?stock|do you have/.test(q)) {
            const found = searchInProducts(q.replace(/stock|available|availability|in|is|do|you|have|the/gi, '').trim());
            if (found.length > 0) {
                const items = found.slice(0, 3).map(p => {
                    const status = p.stock > 0
                        ? `<span style="color:var(--success);">✅ In Stock (${p.stock} units)</span>`
                        : `<span style="color:var(--danger);">❌ Out of Stock</span>`;
                    return `<br>• <strong>${escapeHtmlChat(p.name)}</strong> — ${status}`;
                }).join('');
                return `📦 Availability check:${items}`;
            }
            return `Please specify a product. For example: <em>"is autoclave in stock?"</em>`;
        }

        // Brand query
        if (/brand|brands|company|manufacturer/.test(q)) {
            const brands = [...new Set(products.map(p => p.brand))];
            return `We carry products from <strong>${brands.length} brands</strong>:
                <br><br>${brands.map(b => `• ${escapeHtmlChat(b)}`).join('<br>')}
                <div class="chat-quick-replies">
                    <button onclick="chatQuickReply('Show 3M products')">3M</button>
                    <button onclick="chatQuickReply('Show Omron products')">Omron</button>
                    <button onclick="chatQuickReply('Show Ethicon products')">Ethicon</button>
                </div>`;
        }

        // Brand-specific
        const brandSearch = q.match(/(?:show |from |by )?(?:brand )?(3m|omron|philips|ethicon|b\.?braun|dr\.?\s*morepen|hindustan|shivam)\s*(?:products)?/i);
        if (brandSearch) {
            const brandName = brandSearch[1];
            const brandProducts = products.filter(p => p.brand.toLowerCase().includes(brandName.toLowerCase()));
            if (brandProducts.length > 0) {
                return `Products from <strong>${escapeHtmlChat(brandProducts[0].brand)}</strong>:` +
                    formatProductList(brandProducts.slice(0, 5));
            }
        }

        // Shipping
        if (/shipping|delivery|deliver|ship|free shipping|kab milega/.test(q)) {
            return `🚚 <strong>Shipping Information:</strong>
                <br><br>• <strong>Free shipping</strong> on orders above ₹5,000
                <br>• Standard delivery: <strong>3-5 business days</strong>
                <br>• Express delivery: <strong>1-2 business days</strong> (extra charges)
                <br>• We deliver across <strong>all of India</strong>
                <br>• Flat ₹199 shipping for orders under ₹5,000`;
        }

        // Returns
        if (/return|refund|exchange|cancel|replace/.test(q)) {
            return `↩️ <strong>Return & Refund Policy:</strong>
                <br><br>• <strong>15-day</strong> hassle-free returns
                <br>• Product must be <strong>unused and in original packaging</strong>
                <br>• Refund processed within <strong>5-7 business days</strong>
                <br>• Defective products replaced <strong>free of cost</strong>
                <br><br>Contact us at <strong>+91-98765-43210</strong> for returns.`;
        }

        // Payment
        if (/payment|pay|how to pay|payment method|cod|upi/.test(q)) {
            return `💳 <strong>Payment Methods:</strong>
                <br><br>• 💵 Cash on Delivery (COD)
                <br>• 🏦 Direct Bank Transfer
                <br>• 📱 UPI (Google Pay, PhonePe, Paytm)
                <br>• 💳 Online Payment (coming soon)
                <br><br>All transactions are <strong>safe and secure</strong>.`;
        }

        // Contact
        if (/contact|phone|call|email|address|location|reach|where/.test(q)) {
            return `📞 <strong>Contact Shivam Surgicals:</strong>
                <br><br>📱 Phone: <strong>+91-98765-43210</strong>
                <br>📱 Phone: <strong>+91-87654-32109</strong>
                <br>📧 Email: <strong>info@shivamsurgicals.com</strong>
                <br>📍 Address: 123, Medical Market, Sadar Bazaar, Agra, UP - 282001
                <br>🕐 Mon-Sat: 9AM-8PM | Sun: 10AM-4PM`;
        }

        // Cart
        if (/cart|my cart|what.?s in my cart|view cart/.test(q)) {
            if (typeof getCart === 'function') {
                const cart = getCart();
                if (cart.length === 0) {
                    return `Your cart is empty. <a href="products.html">Browse products</a> to start shopping!`;
                }
                const items = cart.map(item =>
                    `<br>• ${escapeHtmlChat(item.name)} × ${item.quantity} — <strong>₹${(item.price * item.quantity).toLocaleString('en-IN')}</strong>`
                ).join('');
                return `🛒 <strong>Your Cart:</strong>${items}
                    <br><br><a href="cart.html">View full cart →</a>`;
            }
        }

        // Search intent
        if (/^search |^find |^looking for |^i need |^show me |^i want /.test(q)) {
            const query = q.replace(/^(search|find|looking for|i need|show me|i want)\s*/i, '').trim();
            const found = searchInProducts(query);
            if (found.length > 0) {
                return `🔍 Found <strong>${found.length} product(s)</strong> matching "${escapeHtmlChat(query)}":` +
                    formatProductList(found.slice(0, 5)) +
                    (found.length > 5 ? `<br><a href="products.html?search=${encodeURIComponent(query)}" style="font-size:0.85rem;">View all ${found.length} results →</a>` : '');
            }
            return `Sorry, I couldn't find products matching "<strong>${escapeHtmlChat(query)}</strong>". Try different keywords or <a href="products.html">browse all products</a>.`;
        }

        // General product search (fallback)
        const found = searchInProducts(q);
        if (found.length > 0) {
            return `I found <strong>${found.length} product(s)</strong> related to your query:` +
                formatProductList(found.slice(0, 4)) +
                `<div class="chat-quick-replies">
                    <button onclick="chatQuickReply('Show categories')">Browse Categories</button>
                    <button onclick="chatQuickReply('Show offers')">View Offers</button>
                </div>`;
        }

        // Fallback
        return `I'm not sure I understand. Here's what I can help with:
            <div class="chat-quick-replies">
                <button onclick="chatQuickReply('Show categories')">📂 Categories</button>
                <button onclick="chatQuickReply('Best sellers')">🔥 Best Sellers</button>
                <button onclick="chatQuickReply('Shipping info')">🚚 Shipping</button>
                <button onclick="chatQuickReply('Contact info')">📞 Contact</button>
                <button onclick="chatQuickReply('Help')">❓ Help</button>
            </div>`;
    }

    // ==================== SEARCH HELPER ====================
    function searchInProducts(query) {
        if (!query || query.length < 2) return [];
        const q = query.toLowerCase();
        const words = q.split(/\s+/).filter(w => w.length >= 2);

        return products.filter(p => {
            const searchable = (p.name + ' ' + p.categoryName + ' ' + p.brand + ' ' + p.description).toLowerCase();
            return words.some(word => searchable.includes(word));
        }).sort((a, b) => {
            // Prioritize name matches
            const aNameMatch = words.some(w => a.name.toLowerCase().includes(w)) ? 1 : 0;
            const bNameMatch = words.some(w => b.name.toLowerCase().includes(w)) ? 1 : 0;
            return bNameMatch - aNameMatch;
        });
    }

    // ==================== FORMAT HELPERS ====================
    function formatProductList(items) {
        if (!items || items.length === 0) return '<br>No products found.';

        return '<div style="margin-top:8px;">' + items.map(p => {
            const discount = p.originalPrice > p.price
                ? ` <span style="text-decoration:line-through;color:var(--gray-500);font-size:0.78rem;">₹${p.originalPrice.toLocaleString('en-IN')}</span> <span style="color:var(--success);font-size:0.78rem;">${p.discount}% off</span>`
                : '';
            return `<a href="product-detail.html?id=${p.id}" class="product-chip">
                        <i class="fas ${p.icon}" style="color:var(--primary);"></i>
                        <span style="flex:1;font-weight:500;">${escapeHtmlChat(p.name).substring(0, 40)}${p.name.length > 40 ? '...' : ''}</span>
                        <span class="chip-price">₹${p.price.toLocaleString('en-IN')}</span>
                    </a>`;
        }).join('') + '</div>';
    }

    // ==================== INIT ON DOM READY ====================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChatbot);
    } else {
        initChatbot();
    }

})();
