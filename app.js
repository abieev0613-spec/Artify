/* =========================================
   ARTIFY - SHARED JAVASCRIPT
========================================= */

/* =========================================
   1. LOCAL STORAGE DATA
========================================= */

let currentUser = JSON.parse(
    localStorage.getItem('artify_user') || 'null'
);

// Migrate sessions saved by older builds, which stored the full API response.
if (currentUser && currentUser.user && !currentUser.id) {
    currentUser = currentUser.user;
    try { localStorage.setItem('artify_user', JSON.stringify(currentUser)); } catch (error) {}
}

let cart = JSON.parse(
    localStorage.getItem('artify_cart') || '[]'
);

let cartQty = JSON.parse(
    localStorage.getItem('_cart_qty') || '{}'
);

let wishlist = JSON.parse(
    localStorage.getItem('artify_wishlist') || '[]'
);

let feedback = JSON.parse(
    localStorage.getItem('artify_feedback') || '{}'
);


/* =========================================
   2. COMMON HELPER FUNCTIONS
========================================= */

const $ = (selector, root = document) =>
    root.querySelector(selector);

const $$ = (selector, root = document) =>
    [...root.querySelectorAll(selector)];

const money = value =>
    `₹${Number(value).toLocaleString('en-IN')}`;

const page = () =>
    location.pathname.split('/').pop().toLowerCase() || 'home.html';


/* =========================================
   3. SAVE DATA
========================================= */

function persist() {
    localStorage.setItem(
        'artify_user',
        JSON.stringify(currentUser)
    );

    localStorage.setItem(
        'artify_cart',
        JSON.stringify(cart)
    );

    localStorage.setItem(
        'artify_cart_qty',
        JSON.stringify(cartQty)
    );

    localStorage.setItem(
        'artify_wishlist',
        JSON.stringify(wishlist)
    );

    localStorage.setItem(
        'artify_feedback',
        JSON.stringify(feedback)
    );
    if (window.artifySaveLocalState) window.artifySaveLocalState(cart, wishlist);
}


/* =========================================
   4. TOAST MESSAGE
========================================= */

function toast(message) {
    let box = $('#toast');

    if (!box) {
        box = document.createElement('div');

        box.id = 'toast';
        box.className = 'toast';

        box.setAttribute('role', 'status');
        box.setAttribute('aria-live', 'polite');

        document.body.appendChild(box);
    }

    box.textContent = message;
    box.classList.add('show');

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {
        box.classList.remove('show');
    }, 2600);
}


/* =========================================
   5. CART AND WISHLIST COUNTS
========================================= */

function counts() {
    const cartCount = cart.reduce(
        (sum, id) => sum + Number(cartQty[id] || 1),
        0
    );

    $$('[data-cart-count]').forEach(element => {
        element.textContent = cartCount;
    });

    $$('[data-wish-count]').forEach(element => {
        element.textContent = wishlist.length;
    });
}


/* =========================================
   6. LIGHT / DARK THEME
========================================= */

function setTheme(theme) {
    const selected = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.dataset.theme = selected;
    document.body.classList.toggle('dark', selected === 'dark');
    try { localStorage.setItem('artify_theme', selected); } catch (error) {}
    document.querySelectorAll('[data-theme-choice]').forEach(el => {
        el.classList.toggle('active', el.dataset.themeChoice === selected);
    });
}

function themeInit() {
    let savedTheme = 'light';
    try { savedTheme = localStorage.getItem('artify_theme') || 'light'; } catch (error) {}
    setTheme(savedTheme);
}

function toggleTheme() {
    const currentlyDark = document.body.classList.contains('dark') || document.documentElement.dataset.theme === 'dark';
    setTheme(currentlyDark ? 'light' : 'dark');
}

window.addEventListener('storage', event => {
    if (event.key === 'artify_theme') setTheme(event.newValue || 'light');
});


/* =========================================
   7. PRODUCT CATEGORIES
========================================= */

const artifyCategories = [
    {
        label: 'All Products',
        href: 'products.html',
        icon: '✦',
        key: 'products.html'
    },
    {
        label: 'Paintings',
        href: 'paintings.html',
        icon: '🎨',
        key: 'paintings.html'
    },
    {
        label: 'Crafts',
        href: 'crafts.html',
        icon: '🧵',
        key: 'crafts.html'
    },
    {
        label: 'Bouquets',
        href: 'bouquets.html',
        icon: '💐',
        key: 'bouquets.html'
    },
    {
        label: 'Jewellery',
        href: 'jewellery.html',
        icon: '💍',
        key: 'jewellery.html'
    },
    {
        label: 'Crochet',
        href: 'crochet.html',
        icon: '🧶',
        key: 'crochet.html'
    },
    {
        label: 'Home Decor',
        href: 'home-decor.html',
        icon: '🏺',
        key: 'home-decor.html'
    }
];


/* =========================================
   8. HEADER WITH MENU BUTTON
========================================= */

function header() {
    return `
        <header class="site-header">

            <div class="header-inner">

                <button
                    class="menu-toggle"
                    id="menuToggle"
                    type="button"
                    aria-label="Open category menu"
                    aria-controls="shopDrawer"
                    aria-expanded="false"
                >
                    ☰
                </button>

                <a class="brand" href="home.html">

                    <span class="brand-mark">✿</span>

                    <span>
                        Artify64
                        <small>THE HANDMADE UNIVERSE</small>
                    </span>

                </a>

                <div class="header-tools">

                    <a
                        class="icon-link"
                        href="wishlist.html"
                        aria-label="Wishlist"
                    >
                        ♡
                        <b data-wish-count>0</b>
                    </a>

                    <a
                        class="icon-link"
                        href="cart.html"
                        aria-label="Shopping cart"
                    >
                        <span class="cart-icon-large">🛍</span>
                        <b data-cart-count>0</b>
                    </a>

                    <a class="profile-link user-profile-link" href="profile.html" aria-label="My account" title="My account">
                        <span class="user-logo" aria-hidden="true">👤</span>
                        <span class="user-profile-label">Account</span>
                    </a>

                </div>

            </div>

        </header>


        <!-- Background overlay -->

        <div
            class="drawer-scrim"
            id="drawerScrim"
            aria-hidden="true"
        ></div>


        <!-- Sliding left menu -->

        <aside
            class="shop-drawer"
            id="shopDrawer"
            aria-label="Artify navigation menu"
            aria-hidden="true"
            inert
        >

            <!-- Logo -->

            <div class="drawer-brand">

                <span class="drawer-logo">✿</span>

                <div>
                    <strong>Artify</strong>
                    <small>MADE WITH SOUL</small>
                </div>

                <button
                    id="drawerClose"
                    class="drawer-close"
                    type="button"
                    aria-label="Close category menu"
                >
                    ×
                </button>

            </div>


            <!-- Categories -->

            <p class="drawer-kicker">
                EXPLORE THE COLLECTION
            </p>

            <nav
                class="drawer-categories"
                aria-label="Product categories"
            >

                ${artifyCategories.map(category => {
                    const active =
                        page() === category.key;

                    return `
                        <a
                            href="${category.href}"
                            class="${active ? 'active' : ''}"
                            ${active ? 'aria-current="page"' : ''}
                        >
                            <span>${category.icon}</span>

                            ${category.label}

                            <b></b>
                        </a>
                    `;
                }).join('')}

            </nav>


            <div class="drawer-divider"></div>


            <!-- Other website pages -->

            <nav
                class="drawer-extra"
                aria-label="More Artify pages"
            >

                <a href="offers.html">
                    ✧ Offers & little surprises
                </a>

                <a href="custom-art.html">
                    ✎ Request custom art
                </a>

                <a href="orders.html">
                    ▤ My orders
                </a>

                <a href="track-order.html">
                    ⌁ Track an order
                </a>

                <a href="about.html">
                    ♡ Our story
                </a>

                <a href="help-center.html">
                    ☏ Help centre
                </a>

                <a href="contact.html">
                    ✉ Contact us
                </a>

            </nav>


            <!-- Theme button -->

            <div class="drawer-bottom">

                <span>Choose your studio mood</span>

                <button
                    class="drawer-theme"
                    type="button"
                    onclick="toggleTheme()"
                >
                    ◐ Switch light / dark
                </button>

                <small>
                    © 2026 Artify · Handmade with love
                </small>

            </div>

        </aside>
    `;
}


/* =========================================
   9. FOOTER
========================================= */

function footer() {
    return `
        <footer class="footer">

            <div>
                <strong>Artify</strong>
                <span>Handmade. Unique. Creative.</span>
            </div>

            <div class="footer-links">
                <a href="about.html">About</a>
                <a href="faq.html">FAQ</a>
                <a href="contact.html">Contact</a>
                <a href="help-center.html">Help Center</a>
            </div>

            <small>
                © 2026 Artify Handmade
            </small>

        </footer>
    `;
}


/* =========================================
   10. INITIALISE SHARED PAGE ELEMENTS
========================================= */

function base() {
    const isHome = page() === 'home.html';

    if (!isHome && !$('.site-header')) {
        document.body.insertAdjacentHTML(
            'afterbegin',
            header()
        );
    }

    if (!isHome && !$('.footer')) {
        document.body.insertAdjacentHTML(
            'beforeend',
            footer()
        );
    }

    if (!$('#toast')) {
        document.body.insertAdjacentHTML(
            'beforeend',
            `
                <div
                    id="toast"
                    class="toast"
                    role="status"
                    aria-live="polite"
                ></div>
            `
        );
    }

    themeInit();
    counts();

    $('#themeBtn')?.addEventListener(
        'click',
        toggleTheme
    );

    initDrawer();
}


/* =========================================
   11. SLIDING MENU CONTROLS
========================================= */

function initDrawer() {
    const drawer = $('#shopDrawer');
    const scrim = $('#drawerScrim');
    const toggle = $('#menuToggle');
    const closeButton = $('#drawerClose');

    if (!drawer || !scrim || !toggle || !closeButton) {
        return;
    }

    if (drawer.dataset.initialized === 'true') {
        return;
    }

    drawer.dataset.initialized = 'true';

    let previousFocus = null;

    function openDrawer() {
        previousFocus = document.activeElement;

        drawer.inert = false;

        drawer.setAttribute(
            'aria-hidden',
            'false'
        );

        scrim.setAttribute(
            'aria-hidden',
            'false'
        );

        drawer.classList.add('open');
        scrim.classList.add('visible');

        toggle.setAttribute(
            'aria-expanded',
            'true'
        );

        document.body.classList.add('drawer-open');

        closeButton.focus();
    }

    function closeDrawer() {
        drawer.classList.remove('open');
        scrim.classList.remove('visible');

        drawer.setAttribute(
            'aria-hidden',
            'true'
        );

        scrim.setAttribute(
            'aria-hidden',
            'true'
        );

        toggle.setAttribute(
            'aria-expanded',
            'false'
        );

        document.body.classList.remove('drawer-open');

        drawer.inert = true;

        if (
            previousFocus &&
            typeof previousFocus.focus === 'function'
        ) {
            previousFocus.focus();
        }
    }

    toggle.addEventListener(
        'click',
        openDrawer
    );

    closeButton.addEventListener(
        'click',
        closeDrawer
    );

    scrim.addEventListener(
        'click',
        closeDrawer
    );

    drawer.querySelectorAll('a').forEach(link => {
        link.addEventListener(
            'click',
            closeDrawer
        );
    });

    document.addEventListener('keydown', event => {
        if (
            event.key === 'Escape' &&
            drawer.classList.contains('open')
        ) {
            closeDrawer();
        }
    });
}


/* =========================================
   12. PAGE NAVIGATION
========================================= */

function go(url) {
    location.href = url;
}


/* =========================================
   13. FIND PRODUCT BY ID
========================================= */

/* =========================================
   LOAD LATEST PRODUCTS FROM SERVER
========================================= */

async function loadUpdatedProducts() {
    try {
        const response = await fetch('/api/products', {
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(
                'Unable to load updated products.'
            );
        }

        const data = await response.json();

        const updatedProducts = Array.isArray(data)
            ? data
            : data.products;

        if (!Array.isArray(updatedProducts)) {
            throw new Error(
                'Invalid products data received from server.'
            );
        }

        updatedProducts.forEach(updatedProduct => {
            const existingProduct = products.find(
                product =>
                    Number(product.id) ===
                    Number(updatedProduct.id)
            );

            if (existingProduct) {
                existingProduct.price = Number(updatedProduct.price);
                if (updatedProduct.name) existingProduct.name = updatedProduct.name;
                if (updatedProduct.description !== undefined) existingProduct.description = updatedProduct.description;
                if (updatedProduct.palette) existingProduct.palette = updatedProduct.palette;
                if (updatedProduct.image) existingProduct.image = updatedProduct.image;
            }
        });

        return true;

    } catch (error) {
        console.error(
            'Product price loading error:',
            error
        );

        return false;
    }
}



function productById(id) {
    return products.find(
        product => product.id === Number(id)
    );
}


/* =========================================
   14. WISHLIST
========================================= */

function toggleWishlist(id) {
    const product = productById(id);

    if (!product) {
        return;
    }

    const exists = wishlist.includes(product.id);

    wishlist = exists
        ? wishlist.filter(item => item !== product.id)
        : [...wishlist, product.id];

    persist();
    counts();

    // Update this product's heart immediately without waiting for a page refresh.
    document.querySelectorAll(`.heart[onclick="toggleWishlist(${product.id})"]`).forEach(button => {
        const nowWished = wishlist.includes(product.id);
        button.classList.toggle('active', nowWished);
        button.textContent = nowWished ? '♥' : '♡';
        button.setAttribute('aria-pressed', String(nowWished));
        button.setAttribute('aria-label', nowWished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`);
    });

    toast(
        `${product.name} ${exists ? 'removed from wishlist' : 'added to wishlist'}`
    );

    if (page() === 'wishlist.html') {
        if (typeof renderWishlist === 'function') {
            renderWishlist();
        }
    }
}


/* =========================================
   15. ADD PRODUCT TO CART
========================================= */

function addToCart(id) {
    const product = productById(id);

    if (!product) {
        return;
    }

    if (!cart.includes(product.id)) {
        cart.push(product.id);

        cartQty[product.id] = 1;

        toast(`${product.name} added to cart`);
    } else {
        cartQty[product.id] =
            Number(cartQty[product.id] || 1) + 1;

        toast(`${product.name} quantity increased`);
    }

    persist();
    counts();

    if (
        page() === 'cart.html' &&
        typeof renderCart === 'function'
    ) {
        renderCart();
    }
}


/* =========================================
   16. DECREASE CART QUANTITY
========================================= */

function decreaseCartQuantity(id) {
    const productId = Number(id);
    const product = productById(productId);

    if (!product) {
        return;
    }

    const quantity = Number(
        cartQty[productId] || 1
    );

    if (quantity > 1) {
        cartQty[productId] = quantity - 1;

        toast(
            `${product.name} quantity decreased`
        );
    } else {
        removeFromCart(productId);
        return;
    }

    persist();
    counts();

    if (typeof renderCart === 'function') {
        renderCart();
    }
}


/* =========================================
   17. INCREASE CART QUANTITY
========================================= */

function increaseCartQuantity(id) {
    addToCart(Number(id));
}


/* =========================================
   18. REMOVE FROM CART
========================================= */

function removeFromCart(id) {
    const productId = Number(id);
    const product = productById(productId);

    cart = cart.filter(
        itemId => itemId !== productId
    );

    delete cartQty[productId];

    persist();
    counts();

    if (product) {
        toast(`${product.name} removed from cart`);
    }

    if (
        page() === 'cart.html' &&
        typeof renderCart === 'function'
    ) {
        renderCart();
    }
}

/* =========================================
ARTIFY OFFER CALCULATION SYSTEM
========================================= */

/*
OFFER RULES

Welcome Offer : ₹100 off first order
Free Delivery : Subtotal >= ₹999
Combo Offer   : 5% off when buying 2+ products

Category Offers:
Paintings     : 10%
Crafts        : 8%
Crochet       : 10%
Jewellery     : 5%
Bouquets      : 10%
Home Decor    : 8%

Only the highest category discount is applied.
Combo discount is calculated separately.
*/

/* =========================================

1. OFFER CONFIGURATION
   ========================================= */

const ARTIFY_OFFERS = {
welcome: {
id: 'WELCOME100',
name: 'Welcome Offer',
type: 'fixed',
value: 100,
description: '₹100 off your first successful order'
},

freeDelivery: {
    id: 'FREEDELIVERY',
    name: 'Free Delivery',
    minimum: 999,
    description: 'Free delivery on orders of ₹999 or more'
},

combo: {
    id: 'HANDMADECOMBO',
    name: 'Handmade Combo Offer',
    minimumProducts: 2,
    value: 5,
    description: '5% off when you buy 2 or more products'
},

category: {
    'Paintings': {
        id: 'PAINT10',
        name: 'Painting Offer',
        value: 10
    },

    'Crafts': {
        id: 'CRAFT8',
        name: 'Craft Offer',
        value: 8
    },

    'Crochet': {
        id: 'CROCHET10',
        name: 'Crochet Offer',
        value: 10
    },

    'Jewellery': {
        id: 'JEWEL5',
        name: 'Jewellery Offer',
        value: 5
    },

    'Bouquets': {
        id: 'BOUQUET10',
        name: 'Bouquet Offer',
        value: 10
    },

    'Home Decor': {
        id: 'DECOR8',
        name: 'Home Decor Offer',
        value: 8
    }
}


};

/* =========================================
2. GET CART ITEMS WITH QUANTITIES
========================================= */

function getCartItems() {
return cart
.map(id => {
const product = productById(id);

        if (!product) {
            return null;
        }

        const quantity = Math.max(
            1,
            Number(cartQty[id] || 1)
        );

        return {
            ...product,
            quantity,
            lineTotal: Number(product.price) * quantity
        };
    })
    .filter(Boolean);

}

/* =========================================
3. GET PREVIOUS SUCCESSFUL ORDERS
========================================= */

/*
This function uses artify_orders as the order
history storage key.

Orders should be saved here only after a
successful checkout.
*/

function getSuccessfulOrders() {
try {
const orders = JSON.parse(
localStorage.getItem('artify_orders') || '[]'
);

    return Array.isArray(orders) ? orders : [];
} catch (error) {
    return [];
}
```

}

/* =========================================
4. CHECK WELCOME OFFER ELIGIBILITY
========================================= */

function isWelcomeOfferEligible() {
const orders = getSuccessfulOrders();

```
return orders.length === 0;
```

}

/* =========================================
5. CALCULATE CATEGORY DISCOUNT
========================================= */

/*
The highest eligible category discount is used.
Different category discounts are not stacked.
*/

function calculateCategoryDiscount(items) {
const categoryTotals = {};

```
items.forEach(item => {
    const category = item.category;

    if (!ARTIFY_OFFERS.category[category]) {
        return;
    }

    if (!categoryTotals[category]) {
        categoryTotals[category] = 0;
    }

    categoryTotals[category] += item.lineTotal;
});

let bestOffer = null;

Object.entries(categoryTotals).forEach(
    ([category, subtotal]) => {
        const offer = ARTIFY_OFFERS.category[category];

        if (!offer) {
            return;
        }

        const discount = Math.round(
            subtotal * offer.value / 100
        );

        if (
            !bestOffer ||
            discount > bestOffer.discount
        ) {
            bestOffer = {
                id: offer.id,
                name: offer.name,
                category,
                rate: offer.value,
                eligibleSubtotal: subtotal,
                discount
            };
        }
    }
);

return bestOffer || {
    id: null,
    name: null,
    category: null,
    rate: 0,
    eligibleSubtotal: 0,
    discount: 0
};

}

/* =========================================
6. CALCULATE COMBO DISCOUNT
========================================= */

function calculateComboDiscount(items) {
const uniqueProductCount = items.length;

```
if (
    uniqueProductCount <
    ARTIFY_OFFERS.combo.minimumProducts
) {
    return {
        id: null,
        name: null,
        rate: 0,
        discount: 0
    };
}

const subtotal = items.reduce(
    (sum, item) => sum + item.lineTotal,
    0
);

const discount = Math.round(
    subtotal * ARTIFY_OFFERS.combo.value / 100
);

return {
    id: ARTIFY_OFFERS.combo.id,
    name: ARTIFY_OFFERS.combo.name,
    rate: ARTIFY_OFFERS.combo.value,
    discount
};
```

}

/* =========================================
7. CALCULATE COMPLETE ORDER TOTAL
========================================= */

function calculateOfferTotals(options = {}) {
const items = getCartItems();

```
const subtotal = items.reduce(
    (sum, item) => sum + item.lineTotal,
    0
);

/*
   A welcome offer is automatically selected
   for eligible first-time customers.

   Pass { useWelcome: false } to exclude it.
*/

const useWelcome = options.useWelcome !== false;

const welcomeEligible =
    isWelcomeOfferEligible();

const welcomeDiscount =
    useWelcome &&
    welcomeEligible &&
    subtotal > 0
        ? Math.min(
            ARTIFY_OFFERS.welcome.value,
            subtotal
        )
        : 0;

/*
   Apply the highest single category offer.
*/

const categoryOffer =
    calculateCategoryDiscount(items);

/*
   Combo offer applies separately.
*/

const comboOffer =
    calculateComboDiscount(items);

/*
   Prevent total discounts from exceeding subtotal.
*/

const totalDiscount = Math.min(
    subtotal,
    welcomeDiscount +
    categoryOffer.discount +
    comboOffer.discount
);

const discountedSubtotal = Math.max(
    0,
    subtotal - totalDiscount
);

/*
   Demo delivery fee.
   Replace this value if your project uses
   a different delivery charge.
*/

const standardDelivery = 60;

const freeDeliveryEligible =
    subtotal >= ARTIFY_OFFERS.freeDelivery.minimum;

const deliveryFee =
    subtotal === 0 || freeDeliveryEligible
        ? 0
        : standardDelivery;

const grandTotal =
    discountedSubtotal + deliveryFee;

return {
    items,

    subtotal,

    categoryOffer,
    comboOffer,

    welcomeDiscount,
    welcomeEligible,
    welcomeOfferApplied: welcomeDiscount > 0,

    categoryDiscount: categoryOffer.discount,
    comboDiscount: comboOffer.discount,

    totalDiscount,

    discountedSubtotal,

    standardDelivery,
    freeDeliveryEligible,
    deliveryFee,

    grandTotal,

    savings: totalDiscount + (
        freeDeliveryEligible && subtotal > 0
            ? standardDelivery
            : 0
    )
};
```

}

/* =========================================
8. DISPLAY AVAILABLE OFFERS
========================================= */

function getAvailableOffers() {
const items = getCartItems();

const subtotal = items.reduce(
    (sum, item) => sum + item.lineTotal,
    0
);

const categoryOffer =
    calculateCategoryDiscount(items);

const comboOffer =
    calculateComboDiscount(items);

const offers = [];

if (isWelcomeOfferEligible()) {
    offers.push({
        id: ARTIFY_OFFERS.welcome.id,
        name: ARTIFY_OFFERS.welcome.name,
        description: ARTIFY_OFFERS.welcome.description,
        eligible: subtotal > 0,
        discount: Math.min(
            ARTIFY_OFFERS.welcome.value,
            subtotal
        )
    });
}

offers.push({
    id: ARTIFY_OFFERS.freeDelivery.id,
    name: ARTIFY_OFFERS.freeDelivery.name,
    description: ARTIFY_OFFERS.freeDelivery.description,
    eligible:
        subtotal >= ARTIFY_OFFERS.freeDelivery.minimum,
    discount: 0
});

offers.push({
    id: ARTIFY_OFFERS.combo.id,
    name: ARTIFY_OFFERS.combo.name,
    description: ARTIFY_OFFERS.combo.description,
    eligible: comboOffer.discount > 0,
    discount: comboOffer.discount
});

if (categoryOffer.id) {
    offers.push({
        id: categoryOffer.id,
        name: categoryOffer.name,
        description:
            `${categoryOffer.rate}% off eligible ${categoryOffer.category} products`,
        eligible: categoryOffer.discount > 0,
        discount: categoryOffer.discount
    });
}

return offers;
```

}

/* =========================================
9. FORMAT OFFER SUMMARY
========================================= */

function getOfferSummary(options = {}) {
const totals = calculateOfferTotals(options);

```
const lines = [];

lines.push(
    `Subtotal: ${money(totals.subtotal)}`
);

if (totals.welcomeDiscount > 0) {
    lines.push(
        `Welcome Offer: -${money(totals.welcomeDiscount)}`
    );
}

if (totals.categoryDiscount > 0) {
    lines.push(
        `${totals.categoryOffer.name}: -${money(totals.categoryDiscount)}`
    );
}

if (totals.comboDiscount > 0) {
    lines.push(
        `${totals.comboOffer.name}: -${money(totals.comboDiscount)}`
    );
}

lines.push(
    `Total Discount: -${money(totals.totalDiscount)}`
);

lines.push(
    `Delivery: ${
        totals.deliveryFee === 0
            ? 'FREE'
            : money(totals.deliveryFee)
    }`
);

lines.push(
    `Grand Total: ${money(totals.grandTotal)}`
);

return lines.join('\n');
```

}

/* =========================================
10. RENDER OFFER SUMMARY IN CART
========================================= */

/*
Add <div id="offerSummary"></div> to cart.html
where you want the summary to appear.
*/

function renderOfferSummary() {
const container = $('#offerSummary');

```
if (!container) {
    return;
}

const totals = calculateOfferTotals();

const discountRows = [];

if (totals.welcomeDiscount > 0) {
    discountRows.push(`
        <div class="offer-total-row">
            <span>Welcome Offer</span>
            <strong>−${money(totals.welcomeDiscount)}</strong>
        </div>
    `);
}

if (totals.categoryDiscount > 0) {
    discountRows.push(`
        <div class="offer-total-row">
            <span>${totals.categoryOffer.name}</span>
            <strong>−${money(totals.categoryDiscount)}</strong>
        </div>
    `);
}

if (totals.comboDiscount > 0) {
    discountRows.push(`
        <div class="offer-total-row">
            <span>${totals.comboOffer.name}</span>
            <strong>−${money(totals.comboDiscount)}</strong>
        </div>
    `);
}

container.innerHTML = `
    <section class="offer-summary-card">

        <h3>✧ Your Artify Offers</h3>

        <div class="offer-total-row">
            <span>Subtotal</span>
            <strong>${money(totals.subtotal)}</strong>
        </div>

        ${discountRows.join('')}

        <div class="offer-total-row">
            <span>Total Discount</span>
            <strong>−${money(totals.totalDiscount)}</strong>
        </div>

        <div class="offer-total-row">
            <span>Delivery</span>
            <strong>
                ${
                    totals.deliveryFee === 0
                        ? 'FREE'
                        : money(totals.deliveryFee)
                }
            </strong>
        </div>

        <hr>

        <div class="offer-total-row offer-grand-total">
            <span>Grand Total</span>
            <strong>${money(totals.grandTotal)}</strong>
        </div>

        <p class="offer-savings">
            ${
                totals.savings > 0
                    ? `You save ${money(totals.savings)}! ♡`
                    : 'Add more handmade treasures to discover available offers.'
            }
        </p>

    </section>
`;
```

}

/* =========================================
11. OFFER SUMMARY STYLES
========================================= */

/*
Move these styles to style.css if you prefer
to keep all styling in one stylesheet.
*/

function addOfferSummaryStyles() {
if ($('#offerSummaryStyles')) {
return;
}

```
const style = document.createElement('style');

style.id = 'offerSummaryStyles';

style.textContent = `
    .offer-summary-card {
        padding: 22px;
        margin-top: 20px;
        border: 1px solid var(--line);
        border-radius: 18px;
        background: var(--surface);
        color: var(--text);
    }

    .offer-summary-card h3 {
        margin-bottom: 18px;
    }

    .offer-total-row {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 15px;
        margin: 12px 0;
        line-height: 1.6;
    }

    .offer-total-row span {
        color: var(--muted);
    }

    .offer-total-row strong {
        text-align: right;
    }

    .offer-summary-card hr {
        border: 0;
        border-top: 1px solid var(--line);
        margin: 16px 0;
    }

    .offer-grand-total {
        font-size: 1.15rem;
    }

    .offer-savings {
        margin-top: 15px;
        color: var(--accent);
        font-weight: 700;
        line-height: 1.7;
    }
`;

document.head.appendChild(style);

}

/* =========================================
12. INITIALISE OFFER SUMMARY
========================================= */

function initOfferCalculations() {
addOfferSummaryStyles();
renderOfferSummary();
}

/* =========================================
END OF OFFER CALCULATION SYSTEM
========================================= */



/* =========================================
   19. PRODUCT CARD
========================================= */

function productCard(product) {
    const wished = wishlist.includes(product.id);

    return `
        <article class="product-card">

            <button
                class="heart ${wished ? 'active' : ''}"
                onclick="toggleWishlist(${product.id})"
                aria-label="${wished ? 'Remove' : 'Add'} ${product.name} ${wished ? 'from' : 'to'} wishlist"
                aria-pressed="${wished}"
            >
                ${wished ? '♥' : '♡'}
            </button>

            <button
                class="visual ${product.palette}"
                onclick="openProduct(${product.id})"
            >
                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                >

                <small>${product.category}</small>
            </button>

            <div class="product-info">

                <div class="eyebrow">
                    ${product.category}
                </div>

                <h3>${product.name}</h3>

                <p>${product.description}</p>

                <div class="rating">
                    ★ ${product.rating}
                </div>

                <div class="product-bottom">

                    <strong>
                        ${money(product.price)}
                    </strong>

                    <div class="card-actions">

                        <button
                            class="btn small"
                            onclick="openProduct(${product.id})"
                        >
                            View Product
                        </button>

                        <button
                            class="mini-cart"
                            onclick="addToCart(${product.id})"
                            aria-label="Add ${product.name} to cart"
                        >
                            ＋
                        </button>

                    </div>

                </div>

            </div>

        </article>
    `;
}


/* =========================================
   20. PRODUCT DETAILS POPUP
========================================= */

function openProduct(id) {
    const product = productById(id);

    if (!product) {
        return;
    }

    const existing = $('#productModal');

    if (existing) {
        existing.remove();
    }

    const reviewData = JSON.parse(localStorage.getItem('artify_product_reviews') || '{}');
    const ownReview = (Array.isArray(reviewData[product.id]) ? reviewData[product.id] : [])
        .find(r => currentUser && Number(r.userId) === Number(currentUser.id));

    const modal = document.createElement('div');

    modal.id = 'productModal';
    modal.className = 'modal show';

    modal.innerHTML = `
        <div class="modal-panel">

            <button
                class="modal-close"
                onclick="this.closest('.modal').remove()"
                aria-label="Close product details"
            >
                ×
            </button>

            <div class="detail-grid">

                <div>
                    <div
                        id="detailVisual"
                        class="detail-visual ${product.palette}"
                    >
                        <img
                            src="${product.image}"
                            alt="${product.name}"
                        >
                    </div>
                </div>

                <div>

                    <div class="eyebrow">
                        ${product.category}
                    </div>

                    <h2>${product.name}</h2>

                    <div class="rating">
                        ★ ${product.rating} · Handmade original
                    </div>

                    <p class="detail-description">
                        ${product.description}
                    </p>

                    <div class="detail-price">
                        ${money(product.price)}
                    </div>

                    <div class="detail-actions">

                        <button
                            class="btn"
                            onclick="addToCart(${product.id})"
                        >
                            Add to Cart
                        </button>

                        <button
                            class="btn secondary"
                            onclick="toggleWishlist(${product.id})"
                        >
                            ${
                                wishlist.includes(product.id)
                                    ? '♥ Wishlisted'
                                    : '♡ Add to Wishlist'
                            }
                        </button>

                    </div>

                    <div class="feedback-box">

                        <h3>Customers' Feedback</h3>

                        ${ownReview ? `
                            <p class="form-hint">You have already submitted feedback for this product. Submitted feedback cannot be edited.</p>
                        ` : `
                            <textarea id="reviewInput" placeholder="Share your experience..." maxlength="1200" aria-label="Write product feedback"></textarea>
                            <button class="btn small" onclick="saveFeedback(${product.id})">Submit Feedback</button>
                        `}
                        <div id="productReviews" class="product-reviews">
                            ${renderProductReviews(id)}
                        </div>

                    </div>

                </div>

            </div>

        </div>
    `;

    document.body.appendChild(modal);

    modal.addEventListener('click', event => {
        if (event.target === modal) {
            modal.remove();
        }
    });
}


/* =========================================
   21. SAVE PRODUCT FEEDBACK
========================================= */

async function saveFeedback(id) {
    const text = $('#reviewInput')?.value.trim() || '';
    if (!text) { toast('Please write your feedback first.'); return; }
    if (!currentUser || !currentUser.id) {
        toast('Please log in to submit feedback.');
        setTimeout(() => go('login.html'), 500);
        return;
    }
    const key = 'artify_product_reviews';
    const all = JSON.parse(localStorage.getItem(key) || '{}');
    const list = Array.isArray(all[id]) ? all[id] : [];
    const alreadySubmitted = list.some(r => Number(r.userId) === Number(currentUser.id));
    if (alreadySubmitted) {
        toast('You have already submitted feedback for this product. Feedback cannot be edited.');
        const reviewBox = $('#productReviews');
        if (reviewBox) reviewBox.innerHTML = renderProductReviews(id);
        return;
    }
    const review = {
        userId: Number(currentUser.id),
        userName: currentUser.name || 'Artify customer',
        text,
        createdAt: new Date().toISOString()
    };
    list.push(review);
    all[id] = list;
    localStorage.setItem(key, JSON.stringify(all));
    feedback[id] = text;
    persist();
    // Reopen the details view so the submitted form is replaced by a locked confirmation.
    openProduct(id);
    toast('Thanks! Your feedback has been submitted and cannot be edited.');
}

function renderProductReviews(id) {
    const all = JSON.parse(localStorage.getItem('artify_product_reviews') || '{}');
    const list = Array.isArray(all[id]) ? all[id] : [];
    if (!list.length) return '<p class="muted">No customer feedback yet. Be the first to share your experience.</p>';
    return `<div class="review-list">${list.map(r => `<article class="customer-review"><strong>${escapeHTML(r.userName || 'Artify customer')}</strong><p>${escapeHTML(r.text)}</p><small>${new Date(r.createdAt || r.updatedAt || Date.now()).toLocaleDateString('en-IN')}</small></article>`).join('')}</div>`;
}

/* =========================================
   22. FILTER AND SORT PRODUCTS
========================================= */

function getFiltered(category = 'All') {
    const query = (
        $('#search')?.value || ''
    ).trim().toLowerCase();

    const max = Number(
        $('#price')?.value || 999999
    );

    const rating = Number(
        $('#rating')?.value || 0
    );

    const sort = $('#sort')?.value || 'default';

    let result = products.filter(product => {
        const matchesCategory =
            category === 'All' ||
            product.category === category;

        const matchesPrice =
            product.price <= max;

        const matchesRating =
            Number(product.rating) >= rating;

        const matchesSearch =
            product.name.toLowerCase().includes(query);

        return (
            matchesCategory &&
            matchesPrice &&
            matchesRating &&
            matchesSearch
        );
    });

    if (sort === 'low') {
        result.sort(
            (a, b) => a.price - b.price
        );
    }

    if (sort === 'high') {
        result.sort(
            (a, b) => b.price - a.price
        );
    }

    if (sort === 'rating') {
        result.sort(
            (a, b) => Number(b.rating) - Number(a.rating)
        );
    }

    if (sort === 'name') {
        result.sort(
            (a, b) => a.name.localeCompare(b.name)
        );
    }

    return result;
}


/* =========================================
   23. ALL PRODUCTS AND CATEGORY PAGES
========================================= */

async function initShop(category = 'All') {
    base();

    await loadUpdatedProducts();

    const grid = $('#productGrid');

    if (!grid) {
        return;
    }

    const searchInput = $('#search');
    const priceFilter = $('#price');
    const ratingFilter = $('#rating');
    const sortFilter = $('#sort');

    const gridButton = $('#gridBtn');
    const listButton = $('#listBtn');

    const categoryButtons = $('#categoryButtons');


    /* Category navigation buttons */

    if (categoryButtons) {
        categoryButtons.innerHTML =
            artifyCategories.map(item => {
                const active =
                    category === 'All'
                        ? item.label === 'All Products'
                        : item.label === category;

                return `
                    <a
                        class="category-chip ${active ? 'active' : ''}"
                        href="${item.href}"
                        ${active ? 'aria-current="page"' : ''}
                    >
                        ${item.label}
                    </a>
                `;
            }).join('');
    }


    /* Display products */

    function render() {
        const filteredProducts = getFiltered(category);

        const currentView =
            grid.dataset.view || 'grid';

        grid.className =
            currentView === 'list'
                ? 'product-grid list-view'
                : 'product-grid';

        if (filteredProducts.length > 0) {
            grid.innerHTML = filteredProducts
                .map(productCard)
                .join('');
        } else {
            grid.innerHTML = `
                <div class="no-results">

                    <span>⌕</span>

                    <h2>No products found</h2>

                    <p>
                        Try another search term or change your filters.
                    </p>

                </div>
            `;
        }

        const resultCount = $('#resultCount');

        if (resultCount) {
            resultCount.textContent =
                `${filteredProducts.length} product` +
                `${filteredProducts.length === 1 ? '' : 's'} found`;
        }
    }


    /* Search and filters */

    [
        searchInput,
        priceFilter,
        ratingFilter,
        sortFilter
    ].forEach(element => {
        if (element) {
            element.addEventListener('input', render);
            element.addEventListener('change', render);
        }
    });


    /* Grid view */

    if (gridButton) {
        gridButton.addEventListener('click', () => {
            grid.dataset.view = 'grid';

            gridButton.classList.add('active');
            listButton?.classList.remove('active');

            render();
        });
    }


    /* List view */

    if (listButton) {
        listButton.addEventListener('click', () => {
            grid.dataset.view = 'list';

            listButton.classList.add('active');
            gridButton?.classList.remove('active');

            render();
        });
    }


    /* Initial display */

    grid.dataset.view = 'grid';

    gridButton?.classList.add('active');
    listButton?.classList.remove('active');

    render();
}


/* =========================================
   24. PAGES THAT ONLY NEED SHARED ELEMENTS
========================================= */

function simplePage() {
    base();
}


/* =========================================
   END OF SHARED JAVASCRIPT
========================================= */

/* Reviews shown directly beneath the product feedback form */
