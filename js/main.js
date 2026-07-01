/* ═══════════════════════════════════════════════
   NEXUS — Premium E-Commerce  |  Shared Scripts
   ═══════════════════════════════════════════════ */

// ─── Product Data ───
const products = [
  { id: 1, name: 'Quantum Headphones', desc: 'Noise-cancelling with immersive 3D audio and premium build.', price: 299, oldPrice: 399, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80', badge: 'Sale', category: 'electronics' },
  { id: 2, name: 'Nexus Watch Pro', desc: 'Sapphire glass, 14-day battery, advanced health tracking.', price: 449, oldPrice: 549, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80', badge: 'New', category: 'accessories' },
  { id: 3, name: 'Aero Sneakers', desc: 'Ultra-light responsive cushioning for all-day comfort.', price: 189, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80', badge: null, category: 'fashion' },
  { id: 4, name: 'Lumina Desk Lamp', desc: 'Smart LED with wireless charging and adjustable warmth.', price: 129, oldPrice: 169, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', badge: 'Sale', category: 'home' },
  { id: 5, name: 'Phantom Hoodie', desc: 'Premium organic cotton with thermal regulation technology.', price: 89, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&q=80', badge: null, category: 'fashion' },
  { id: 6, name: 'Orbit Speaker', desc: '360° surround sound with RGB ambient light synchronization.', price: 199, image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80', badge: 'New', category: 'electronics' },
  { id: 7, name: 'Echo Backpack', desc: 'Waterproof, anti-theft design with built-in USB charging port.', price: 109, oldPrice: 139, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80', badge: 'Popular', category: 'accessories' },
  { id: 8, name: 'Zen Diffuser', desc: 'Ultrasonic aromatherapy diffuser with ambient mood lighting.', price: 59, image: 'https://images.unsplash.com/photo-1600612253971-422e7f7faeb6?w=400&q=80', badge: null, category: 'home' },
  { id: 9, name: 'Arc Mouse', desc: 'Ergonomic wireless mouse with silent clicks and RGB.', price: 79, oldPrice: 99, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80', badge: 'Sale', category: 'electronics' },
  { id: 10, name: 'Vibe Sunglasses', desc: 'Polarized UV400 with titanium frame and gradient lens.', price: 159, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80', badge: 'New', category: 'accessories' },
  { id: 11, name: 'Nomad Journal', desc: 'Vegan leather notebook with recycled paper, 240 pages.', price: 39, image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&q=80', badge: null, category: 'home' },
  { id: 12, name: 'Pulse Fitness Band', desc: 'Heart rate, SpO2, sleep tracking with 10-day battery.', price: 129, oldPrice: 159, image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&q=80', badge: 'Popular', category: 'accessories' },
];

// ─── Cart State ───
let cart = [];

function loadCart() {
  try {
    const saved = localStorage.getItem('nexus_cart');
    if (saved) cart = JSON.parse(saved);
  } catch (e) { cart = []; }
}

function saveCart() {
  localStorage.setItem('nexus_cart', JSON.stringify(cart));
}

// ─── Cart Functions ───
function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart();
  updateCartUI();
  showToast(`${product.name} added to cart`);
  animateCartButton(id);
}

function removeItem(id) {
  cart = cart.filter(c => c.id !== id);
  saveCart();
  updateCartUI();
}

function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) { removeItem(id); return; }
  saveCart();
  updateCartUI();
}

function getCartTotal() {
  return cart.reduce((sum, c) => sum + c.price * c.qty, 0);
}

function getCartCount() {
  return cart.reduce((sum, c) => sum + c.qty, 0);
}

function updateCartUI() {
  const count = getCartCount();
  document.querySelectorAll('.cart-count').forEach(el => el.textContent = count);

  const itemsEl = document.getElementById('cartItems');
  const footerEl = document.getElementById('cartFooter');
  if (!itemsEl) return;

  if (cart.length === 0) {
    itemsEl.innerHTML = `<div class="cart-empty"><span class="empty-icon">🛒</span><p>Your cart is empty</p></div>`;
    if (footerEl) footerEl.style.display = 'none';
    return;
  }

  if (footerEl) footerEl.style.display = 'block';
  itemsEl.innerHTML = cart.map(c => `
    <div class="cart-item">
      <div class="cart-item-img"><img src="${c.image}" alt="${c.name}" loading="lazy" /></div>
      <div class="cart-item-info">
        <h4>${c.name}</h4>
        <p>$${c.price}</p>
      </div>
      <div class="cart-item-qty">
        <button onclick="changeQty(${c.id}, -1)" aria-label="Decrease quantity">−</button>
        <span>${c.qty}</span>
        <button onclick="changeQty(${c.id}, 1)" aria-label="Increase quantity">+</button>
      </div>
      <button class="cart-item-remove" onclick="removeItem(${c.id})" aria-label="Remove item">×</button>
    </div>
  `).join('');

  document.getElementById('cartTotal').textContent = `$${getCartTotal().toFixed(2)}`;
}

function toggleCart() {
  document.getElementById('cartOverlay').classList.toggle('open');
  document.getElementById('cartPanel').classList.toggle('open');
  document.body.style.overflow = document.getElementById('cartPanel').classList.contains('open') ? 'hidden' : '';
}

// ─── Payment Modal ───
const paymentMethods = [
  { id: 'bkash', name: 'bKash', icon: '💳', group: 'mobile' },
  { id: 'rocket', name: 'Rocket', icon: '🚀', group: 'mobile' },
  { id: 'nagad', name: 'Nagad', icon: '📱', group: 'mobile' },
  { id: 'visa', name: 'Visa', icon: '💎', group: 'card' },
  { id: 'mastercard', name: 'MasterCard', icon: '🔷', group: 'card' },
  { id: 'amex', name: 'Amex', icon: '🔶', group: 'card' },
  { id: 'paypal', name: 'PayPal', icon: '🅿️', group: 'paypal' },
];

let selectedMethod = null;

function injectPaymentModal() {
  if (document.getElementById('paymentModal')) return;
  const div = document.createElement('div');
  div.innerHTML = `
  <div class="payment-overlay" id="paymentOverlay">
    <div class="payment-modal">
      <div class="payment-modal-header">
        <h2>Secure Checkout</h2>
        <button class="pm-close" onclick="closePayment()">&times;</button>
      </div>
      <div class="payment-modal-body">
        <div class="pm-order-summary" id="pmSummary"></div>
        <p style="font-size:0.85rem;font-weight:600;margin-bottom:12px;color:var(--text-dim);">Choose payment method</p>
        <div class="pm-methods" id="pmMethods"></div>
        <div class="pm-fields" id="pmFields"></div>
        <button class="pm-pay-btn" id="pmPayBtn" onclick="processPayment()" disabled>
          <span>💳</span> Pay <span id="pmPayAmount"></span>
        </button>
        <div class="pm-secure-badge">🔒 256-bit encrypted payment</div>
      </div>
    </div>
  </div>`;
  document.body.appendChild(div.firstElementChild);
}

function openPayment() {
  injectPaymentModal();
  const total = getCartTotal();
  if (cart.length === 0) return;

  selectedMethod = null;
  document.getElementById('paymentOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';

  // Order summary
  document.getElementById('pmSummary').innerHTML = `
    ${cart.map(c => `<div class="pm-row"><span class="pm-label">${c.name} × ${c.qty}</span><span class="pm-value">$${(c.price * c.qty).toFixed(2)}</span></div>`).join('')}
    <div class="pm-divider"></div>
    <div class="pm-row pm-total"><span class="pm-label">Total</span><span class="pm-value">$${total.toFixed(2)}</span></div>
  `;

  // Payment methods
  const methodsEl = document.getElementById('pmMethods');
  methodsEl.innerHTML = paymentMethods.map(m => `
    <button class="pm-method" data-id="${m.id}" onclick="selectPayment('${m.id}')">
      <span class="pm-method-icon">${m.icon}</span>
      ${m.name}
    </button>
  `).join('');

  // Reset fields & button
  document.getElementById('pmFields').innerHTML = '';
  document.getElementById('pmPayBtn').disabled = true;
  document.getElementById('pmPayAmount').textContent = `$${total.toFixed(2)}`;
}

function closePayment() {
  document.getElementById('paymentOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function selectPayment(id) {
  selectedMethod = id;
  document.querySelectorAll('.pm-method').forEach(b => b.classList.toggle('active', b.dataset.id === id));
  const method = paymentMethods.find(m => m.id === id);

  let fields = '';
  if (method.group === 'mobile') {
    const names = { bkash: 'bKash', rocket: 'Rocket', nagad: 'Nagad' };
    fields = `
      <div class="pm-field-group">
        <label>${names[id]} Account Number</label>
        <input type="tel" id="pmMobile" placeholder="01XXXXXXXXX" required />
      </div>
      <div class="pm-field-group">
        <label>Transaction ID (TrxID)</label>
        <input type="text" id="pmTrxid" placeholder="Enter transaction ID" required />
      </div>
    `;
  } else if (method.group === 'card') {
    const names = { visa: 'Visa', mastercard: 'MasterCard', amex: 'American Express' };
    fields = `
      <div class="pm-field-group">
        <label>Cardholder Name</label>
        <input type="text" id="pmCardName" placeholder="John Doe" required />
      </div>
      <div class="pm-field-group">
        <label>${names[id]} Card Number</label>
        <input type="text" id="pmCardNum" placeholder="XXXX XXXX XXXX XXXX" maxlength="19" required oninput="formatCardNumber(this)" />
      </div>
      <div class="pm-row-fields">
        <div class="pm-field-group">
          <label>Expiry</label>
          <input type="text" id="pmExpiry" placeholder="MM/YY" maxlength="5" required oninput="formatExpiry(this)" />
        </div>
        <div class="pm-field-group">
          <label>CVV</label>
          <input type="text" id="pmCvv" placeholder="XXX" maxlength="4" required />
        </div>
      </div>
    `;
  } else if (method.group === 'paypal') {
    fields = `
      <div class="pm-field-group">
        <label>PayPal Email</label>
        <input type="email" id="pmPaypalEmail" placeholder="you@example.com" required />
      </div>
    `;
  }

  document.getElementById('pmFields').innerHTML = fields;
  document.getElementById('pmPayBtn').disabled = false;
}

function formatCardNumber(input) {
  let val = input.value.replace(/\D/g, '').slice(0, 16);
  input.value = val.replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(input) {
  let val = input.value.replace(/\D/g, '').slice(0, 4);
  if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2);
  input.value = val;
}

function processPayment() {
  if (!selectedMethod) return;
  const btn = document.getElementById('pmPayBtn');
  btn.disabled = true;
  btn.classList.add('loading');
  btn.innerHTML = '<span>⏳</span> Processing...';

  // Simulate payment processing
  setTimeout(() => {
    const total = getCartTotal();
    const method = paymentMethods.find(m => m.id === selectedMethod);
    showToast(`Payment successful! $${total.toFixed(2)} paid via ${method.name}. Order confirmed.`);

    cart = [];
    saveCart();
    updateCartUI();
    closePayment();
    toggleCart();

    btn.disabled = false;
    btn.classList.remove('loading');
    btn.innerHTML = '<span>💳</span> Pay <span id="pmPayAmount"></span>';
    document.getElementById('pmPayAmount').textContent = `$${total.toFixed(2)}`;
  }, 1500);
}

function checkout() {
  if (cart.length === 0) return;
  openPayment();
}

// ─── Animate + button ───
function animateCartButton(id) {
  const btn = document.querySelector(`.product-card[data-id="${id}"] .add-to-cart`);
  if (!btn) return;
    btn.textContent = '✓ Added';
    btn.style.background = 'var(--neon-green)';
    btn.style.color = '#000';
    btn.style.borderColor = 'var(--neon-green)';
    btn.style.width = 'auto';
    btn.style.padding = '0 14px';
    btn.style.borderRadius = '50px';
    setTimeout(() => {
      btn.textContent = '+ Add';
      btn.style.background = '';
      btn.style.color = '';
      btn.style.borderColor = '';
      btn.style.width = '';
      btn.style.padding = '';
      btn.style.borderRadius = '';
    }, 1200);
}

// ─── Toast ───
let toastTimeout;

function showToast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  document.getElementById('toastMessage').textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => el.classList.remove('show'), 2500);
}

// ─── Mobile Nav ───
function toggleMobile() {
  document.getElementById('navLinks').classList.toggle('open');
  document.getElementById('mobileToggle').classList.toggle('active');
  document.body.style.overflow = document.getElementById('navLinks').classList.contains('open') ? 'hidden' : '';
}

// Close mobile nav on link click
document.addEventListener('click', (e) => {
  const nav = document.getElementById('navLinks');
  const toggle = document.getElementById('mobileToggle');
  if (nav && nav.classList.contains('open') && !nav.contains(e.target) && !toggle.contains(e.target)) {
    nav.classList.remove('open');
    toggle.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// ─── Nav Scroll & Active Link ───
function initNavScroll() {
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);

    const backBtn = document.querySelector('.back-to-top');
    if (backBtn) backBtn.classList.toggle('visible', window.scrollY > 400);
  });
}

function setActiveNavLink(pageId) {
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    a.classList.toggle('active', href === pageId || href === '#' + pageId);
  });
}

// ─── Particles ───
function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: 0, y: 0 };

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  document.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.6 + 0.2;
      this.color = Math.random() > 0.5 ? '0, 240, 255' : '179, 0, 255';
    }
    update() {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200) {
        const force = (200 - dist) / 200 * 0.02;
        this.x -= dx * force;
        this.y -= dy * force;
      }
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < -20 || this.x > canvas.width + 20 || this.y < -20 || this.y > canvas.height + 20) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 100; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const alpha = (1 - dist / 150) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
}

// ─── Cursor Glow ───
function initCursorGlow() {
  document.addEventListener('mousemove', (e) => {
    const glow = document.getElementById('cursor-glow');
    if (glow) {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    }
  });
}

// ─── Intersection Observer for reveals ───
function initRevealObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ─── Render Product Cards ───
function renderProductGrid(containerId, items, filter) {
  const grid = document.getElementById(containerId);
  if (!grid) return;
  const f = filter && filter !== 'all' ? filter : null;
  const filtered = f ? items.filter(p => p.category === f) : items;
  grid.innerHTML = filtered.map(p => `
    <div class="product-card" data-id="${p.id}">
      <div class="product-img">
        ${p.badge ? `<span class="badge">${p.badge}</span>` : ''}
        <img src="${p.image}" alt="${p.name}" loading="lazy" />
      </div>
      <div class="product-body">
        <h3>${p.name}</h3>
        <p class="desc">${p.desc}</p>
        <div class="product-footer">
          <span class="price">$${p.price}${p.oldPrice ? `<span class="old">$${p.oldPrice}</span>` : ''}</span>
          <button class="add-to-cart" onclick="addToCart(${p.id})" aria-label="Add to cart">+ Add</button>
        </div>
      </div>
    </div>
  `).join('');
  // Reveal all product cards immediately
  grid.querySelectorAll('.product-card').forEach(el => el.classList.add('visible'));
}

// ─── Count Up Animation ───
function initCountUp() {
  document.querySelectorAll('.number[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target.toLocaleString();
    }
    requestAnimationFrame(update);
  });
}

// ─── Init ───
document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  updateCartUI();
  initParticles();
  initCursorGlow();
  initNavScroll();
  initRevealObserver();
});
