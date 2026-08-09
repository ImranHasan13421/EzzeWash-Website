/* ============================================================
   EZZEWASH — Full Website JavaScript
   Upgraded: Dynamic Bubbles, Smooth Transitions, Parallax, Drag Sliders
   ============================================================ */

// ---- Data ----
const SERVICES = [
  { id: 'wash-fold', name: 'Regular Wash & Fold', img: 'assets/services/wash_fold.webp', price: 15, unit: '/piece', badge: 'Popular', desc: 'Basic washing and folding for everyday clothes. Gentle on fabrics, tough on dirt.' },
  { id: 'comfort-clean', name: 'Comfort Clean & Wash', img: 'assets/services/comfort_clean.webp', price: 200, unit: '/piece', badge: 'Premium', desc: 'Deep-clean wash with extra fabric softener for maximum comfort and freshness.' },
  { id: 'shoe-clean', name: 'Shoe Clean', img: 'assets/services/shoe_clean.webp', price: 120, unit: '/pair', badge: '', desc: 'Professional shoe cleaning for sneakers, leather shoes, and casual footwear.' },
  { id: 'suit-wash', name: 'Suit Wash', img: 'assets/services/suit_wash.webp', price: 100, unit: '/piece', badge: 'Delicate', desc: 'Careful hand-finish suit cleaning preserving structure and fabric integrity.' },
  { id: 'steam-clean', name: 'Steam Clean', img: 'assets/services/steam_clean.webp', price: 50, unit: '/piece', badge: '', desc: 'High-pressure steam treatment to sanitize, deodorize, and refresh garments.' },
  { id: 'iron-press', name: 'Iron Press', img: 'assets/services/iron_press.webp', price: 10, unit: '/piece', badge: '', desc: 'Crisp and professional ironing service for shirts, trousers, sarees, and more.' },
  { id: 'express', name: 'Express Service', img: 'assets/services/express.webp', price: 150, unit: '/piece', badge: '24hr', desc: 'Rush service with 24-hour turnaround. Perfect for urgent needs.' },
  { id: 'delicate-care', name: 'Delicate Care', img: 'assets/services/delicate_care.webp', price: 200, unit: '/piece', badge: 'Gentle', desc: 'Special handling for silk, chiffon, lace, and other delicate fabrics.' },
  { id: 'dry-clean', name: 'Dry Clean Standard', img: 'assets/services/dry_clean.webp', price: 80, unit: '/piece', badge: 'Pro', desc: 'Industry-standard dry cleaning for garments requiring chemical solvents.' },
];

const PROMOS = [
  { name: 'BlueLock Power', img: 'assets/promos/bluelock.gif', code: 'BLUELOCK10', discount: '10% OFF', desc: 'Power up your wash! 10% off all services.', expiry: 'Expires: 20 April 2026', isGif: false, tag: '10% OFF' },
  { name: 'Zenitsu Thunder Splash', img: 'assets/promos/zenitsu.gif', code: 'THUNDER15', discount: '15% OFF', desc: 'Lightning-speed wash deal! 15% off on Express.', expiry: 'Expires: 15 April 2026', isGif: false, tag: '15% OFF' },
  { name: 'Developer Special', img: 'assets/promos/developer.gif', code: 'DEVSPECIAL', discount: '20% OFF', desc: 'Exclusive dev promo! 20% off any order.', expiry: 'Expires: 23 April 2026', isGif: true, tag: '20% OFF' },
  { name: 'Batman Paglu Splash', img: 'assets/promos/batman.gif', code: 'BATMAN25', discount: '25% OFF', desc: "Gotham's freshest deal! 25% off premium services.", expiry: 'Expires: 20 April 2026', isGif: true, tag: '25% OFF' },
  { name: 'DemonSlayer 1st Form', img: 'assets/promos/demonslayer.gif', code: 'SLAYER12', discount: '12% OFF', desc: 'Slice through stains! 12% off Dry Clean.', expiry: 'Expires: 15 April 2026', isGif: false, tag: '12% OFF' },
  { name: 'Romonir Boishakh', img: 'assets/promos/boishakh.gif', code: 'BOISHAKH20', discount: '20% OFF', desc: 'Celebrate the new year fresh! 20% off all washes.', expiry: 'Expires: 14 April 2026', isGif: false, tag: 'Seasonal' },
  { name: 'TopLift Shoot', img: 'assets/promos/toplift.gif', code: 'TOPLIFT08', discount: '8% OFF', desc: 'Reach the top with clean clothes! 8% off suits.', expiry: 'Expires: 25 April 2026', isGif: false, tag: '8% OFF' },
];

const PROMO_CODES = {
  'BLUELOCK10': 10, 'THUNDER15': 15, 'DEVSPECIAL': 20, 'BATMAN25': 25,
  'SLAYER12': 12, 'BOISHAKH20': 20, 'TOPLIFT08': 8,
};

const FAQ_DATA = [
  { q: 'How long does standard service take?', a: 'Standard Wash & Fold takes 2–3 business days. Express Service is available within 24 hours for an additional charge.' },
  { q: 'Do you offer pickup and delivery?', a: 'Yes! We offer free pickup and delivery within Dhaka city. Schedule your pickup through our website or app.' },
  { q: 'What if my item gets damaged?', a: 'We take every precaution, but in case of damage caused by our negligence, we offer compensation up to 10× the service charge. Report within 48 hours of delivery.' },
  { q: 'Can I use multiple promo codes?', a: 'Only one promo code can be applied per order. Codes cannot be combined and are subject to their individual terms and expiry dates.' },
  { q: 'How do I track my order?', a: 'You can track your order in real-time using our EzzeWash app powered by Bubble Bot AI, or contact our support line for updates.' },
  { q: 'What payment methods do you accept?', a: 'We accept Cash on Delivery (COD), bKash, Nagad, and all major credit/debit cards.' },
  { q: 'Is my clothing safe from shrinkage?', a: 'Our team is trained to read garment labels and use the appropriate washing method. However, pre-existing fabric conditions may cause minimal shrinkage.' },
];

// ---- State ----
let currentStep = 1;
let orderData = { service: null, store: null, scheduleType: 'pickup', qty: 1, weight: 1.0, promoCode: null, discountPercent: 0, paymentMethod: 'cod' };

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initBubbles();
  initNav();
  renderServicesSection();
  renderServiceSelectGrid();
  renderPromos();
  initHomePromos();
  renderFAQ();
  initScrollReveal();
  initCounters();
  initOrderSummary();
  setMinDate();

  // Dynamic Enhancements
  initHeroParallax();
  initDraggableSliders();
});

// ============================================================
// DYNAMIC BACKGROUND BUBBLES
// ============================================================
function initBubbles() {
  const container = document.getElementById('bg-bubbles');
  if (!container) return;
  const bubbleCount = window.innerWidth > 768 ? 15 : 8;
  for (let i = 0; i < bubbleCount; i++) {
    const bubble = document.createElement('div');
    bubble.className = 'bg-bubble';

    const size = Math.random() * 70 + 30;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${Math.random() * 100}vw`;
    bubble.style.animationDuration = `${Math.random() * 13 + 12}s`;
    bubble.style.animationDelay = `${Math.random() * 10}s`;

    container.appendChild(bubble);
  }
}

// ============================================================
// DYNAMIC HERO PARALLAX
// ============================================================
function initHeroParallax() {
  const wrap = document.querySelector('.hero-img-wrap');
  if (!wrap) return;
  let ticking = false;
  document.addEventListener('mousemove', (e) => {
    if (window.innerWidth < 900) {
      wrap.style.transform = 'none'; // Disable on mobile to prevent jitter
      return;
    }
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 40;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 40;
        wrap.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        ticking = false;
      });
      ticking = true;
    }
  });

  // Reset on leave to maintain standard styling
  document.querySelector('.hero').addEventListener('mouseleave', () => {
    if (window.innerWidth >= 900) {
      wrap.style.transform = `rotateY(-5deg) rotateX(2deg)`;
    }
  });
}

// ============================================================
// DRAGGABLE SLIDERS (PROMOS & APP SHOWCASE)
// ============================================================
function initDraggableSliders() {
  const sliders = [document.getElementById('promoTrack'), document.querySelector('.app-showcase')];
  sliders.forEach(slider => {
    if (!slider) return;
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener('mousedown', (e) => {
      isDown = true;
      slider.classList.add('active');
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener('mouseleave', () => {
      isDown = false;
      slider.classList.remove('active');
    });
    slider.addEventListener('mouseup', () => {
      isDown = false;
      slider.classList.remove('active');
    });
    slider.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2; // Scroll speed multiplier
      slider.scrollLeft = scrollLeft - walk;
    });
  });
}

// ============================================================
// THEME
// ============================================================
function initTheme() {
  const saved = localStorage.getItem('ezze-theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('ezze-theme', next);
}

// ============================================================
// NAVBAR
// ============================================================
function initNav() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));

  window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 20);
    updateActiveNav();
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const page = link.dataset.page;
      scrollToSection(page);
      navLinks.classList.remove('open');
    });
  });
}

function updateActiveNav() {
  const sections = ['home', 'order', 'services', 'stores', 'promos', 'terms', 'help'];
  const offset = 120;
  let current = 'home';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - offset) current = id;
  });
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.dataset.page === current);
  });
}

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) window.scrollTo({ top: el.offsetTop - 75, behavior: 'smooth' });
}

// ============================================================
// RENDER SERVICES
// ============================================================
function renderServicesSection() {
  const grid = document.getElementById('servicesGrid');
  if (!grid) return;
  grid.innerHTML = SERVICES.map(s => `
    <div class="service-card reveal">
      <div class="service-card-img">
        <img src="${s.img}" alt="${s.name}" loading="lazy" decoding="async" />
        ${s.badge ? `<div class="service-card-badge">${s.badge}</div>` : ''}
      </div>
      <div class="service-card-body">
        <h3>${s.name}</h3>
        <p>${s.desc}</p>
        <div class="service-card-footer">
          <span class="service-price">From ৳${s.price}<small>${s.unit}</small></span>
          <button class="service-order-btn" onclick="goOrder('${s.id}')">Order Now</button>
        </div>
      </div>
    </div>
  `).join('');
}

function goOrder(serviceId) {
  scrollToSection('order');
  setTimeout(() => {
    const card = document.querySelector(`.service-select-card[data-id="${serviceId}"]`);
    if (card) { card.click(); }
  }, 600);
}

// ============================================================
// RENDER PROMOS
// ============================================================
function renderPromos() {
  const track = document.getElementById('promoTrack');
  if (!track) return;
  track.innerHTML = PROMOS.map(p => promoCardHTML(p)).join('');
}

function initHomePromos() {
  const track = document.getElementById('homePromoTrack');
  if (!track) return;
  const cards = PROMOS.map(p => promoCardHTML(p, true)).join('');
  track.innerHTML = cards + cards;
}

function promoCardHTML(p, small = false) {
  return `
    <div class="promo-card${small ? ' small' : ''}">
      ${p.tag ? `<div class="promo-tag">${p.tag}</div>` : ''}
      <div class="promo-card-media">
        <img src="${p.img}" alt="${p.name}" loading="lazy" decoding="async" />
        ${p.isGif ? '<div class="promo-gif-badge">GIF</div>' : ''}
      </div>
      <div class="promo-card-body">
        <h3>${p.name}</h3>
        <div class="promo-discount">${p.discount}</div>
        <p style="font-size:0.85rem;font-weight:500;color:var(--text-muted);margin-bottom:0.5rem">${p.desc}</p>
        <div class="promo-code-display" onclick="copyPromoCode('${p.code}', this)">
          <span>${p.code}</span>
          <i class="fas fa-copy"></i>
        </div>
        <div class="promo-expiry"><i class="fas fa-clock" style="color:var(--warning);margin-right:6px"></i>${p.expiry}</div>
      </div>
    </div>
  `;
}

function copyPromoCode(code, el) {
  navigator.clipboard.writeText(code).catch(() => { });
  const icon = el.querySelector('i');
  icon.className = 'fas fa-check';
  icon.style.color = 'var(--success)';
  icon.style.transform = 'scale(1.2)';
  showToast('Promo code copied!', 'success');
  setTimeout(() => { icon.className = 'fas fa-copy'; icon.style.color = ''; icon.style.transform = 'scale(1)'; }, 2000);
}

function scrollPromos(dir) {
  const track = document.getElementById('promoTrack');
  if (track) track.scrollBy({ left: dir * 320, behavior: 'smooth' });
}

// ============================================================
// RENDER SERVICE SELECT GRID (ORDER STEP 1)
// ============================================================
function renderServiceSelectGrid() {
  const grid = document.getElementById('serviceSelectGrid');
  if (!grid) return;
  grid.innerHTML = SERVICES.map(s => `
    <div class="service-select-card" data-id="${s.id}" data-price="${s.price}" data-name="${s.name}" onclick="selectService(this)">
      <img src="${s.img}" alt="${s.name}" />
      <div class="service-select-card-info">
        <h4>${s.name}</h4>
        <p>From ৳${s.price}${s.unit}</p>
      </div>
    </div>
  `).join('');
}

// ============================================================
// ORDER WIZARD
// ============================================================
function selectService(card) {
  document.querySelectorAll('.service-select-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
  orderData.service = { id: card.dataset.id, name: card.dataset.name, price: parseInt(card.dataset.price) };
  updateOrderSummary();
}

function selectStore(card, name) {
  document.querySelectorAll('.store-select-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
  orderData.store = name;
  updateOrderSummary();
}

function selectScheduleType(el, type) {
  document.querySelectorAll('.schedule-option').forEach(o => o.classList.remove('active'));
  el.classList.add('active');
  orderData.scheduleType = type;
  const addrGroup = document.getElementById('deliveryAddressGroup');
  if (type === 'delivery') addrGroup.classList.remove('hidden');
  else addrGroup.classList.add('hidden');
}

function selectPayment(card, method) {
  document.querySelectorAll('.payment-card').forEach(c => c.classList.remove('active'));
  card.classList.add('active');
  orderData.paymentMethod = method;
  const cardFields = document.getElementById('cardFields');
  if (method === 'card') cardFields.classList.remove('hidden');
  else cardFields.classList.add('hidden');
  updateFinalSummary();
}

function changeQty(delta) {
  orderData.qty = Math.max(1, orderData.qty + delta);
  document.getElementById('qtyValue').textContent = orderData.qty;
  updateOrderSummary();
}

function changeWeight(delta) {
  orderData.weight = Math.max(0.5, parseFloat((orderData.weight + delta).toFixed(1)));
  document.getElementById('weightValue').textContent = orderData.weight.toFixed(1);
  updateOrderSummary();
}

function fillPromo(code) {
  document.getElementById('promoInput').value = code;
  applyPromo();
}

function applyPromo() {
  const input = document.getElementById('promoInput').value.trim().toUpperCase();
  const feedback = document.getElementById('promoFeedback');
  if (!input) { setFeedback(feedback, 'Please enter a promo code.', 'error'); return; }
  if (PROMO_CODES[input]) {
    orderData.promoCode = input;
    orderData.discountPercent = PROMO_CODES[input];
    setFeedback(feedback, `✅ "${input}" applied! ${PROMO_CODES[input]}% discount.`, 'success');
    updateOrderSummary();
    document.getElementById('discountRow').classList.remove('hidden');
  } else {
    orderData.promoCode = null; orderData.discountPercent = 0;
    setFeedback(feedback, '❌ Invalid or expired promo code.', 'error');
    document.getElementById('discountRow').classList.add('hidden');
    updateOrderSummary();
  }
}

function setFeedback(el, msg, type) {
  el.textContent = msg;
  el.className = `promo-feedback ${type}`;
}

function updateOrderSummary() {
  const s = orderData;
  const price = s.service ? s.service.price : 0;
  const subtotal = price * s.qty;
  const discount = Math.round(subtotal * (s.discountPercent / 100));
  const total = subtotal - discount;
  document.getElementById('sumService').textContent = s.service ? s.service.name : '—';
  document.getElementById('sumStore').textContent = s.store || '—';
  document.getElementById('sumItems').textContent = `${s.qty} item(s)`;
  document.getElementById('sumSubtotal').textContent = `৳${subtotal}`;
  document.getElementById('sumDiscount').textContent = `−৳${discount}`;
  document.getElementById('sumTotal').textContent = `৳${total}`;
  orderData.total = total;
  orderData.subtotal = subtotal;
  orderData.discount = discount;
  updateFinalSummary();
}

function initOrderSummary() { updateOrderSummary(); }

function updateFinalSummary() {
  const el = document.getElementById('finalSummary');
  if (!el) return;
  const s = orderData;
  const payLabel = { cod: 'Cash on Delivery', bkash: 'bKash', card: 'Credit/Debit Card', nagad: 'Nagad' };
  el.innerHTML = `
    <div style="font-size:0.9rem;color:var(--text-secondary);margin-bottom:0.75rem;font-weight:700;font-family:'Alexandria',sans-serif;">Order Summary</div>
    <div style="display:grid;gap:0.5rem;font-size:0.95rem;font-weight:500;">
      ${s.service ? `<div style="display:flex;justify-content:space-between"><span>${s.service.name}</span><span>৳${s.subtotal}</span></div>` : ''}
      ${s.discount ? `<div style="display:flex;justify-content:space-between;color:var(--success);font-weight:600;"><span>Promo (${s.promoCode})</span><span>−৳${s.discount}</span></div>` : ''}
      <div style="display:flex;justify-content:space-between;font-weight:800;font-size:1.15rem;border-top:1.5px dashed var(--border);padding-top:0.75rem;margin-top:0.25rem;font-family:'Alexandria',sans-serif;"><span>Total</span><span style="color:var(--blue-2)">৳${s.total || 0}</span></div>
      <div style="color:var(--text-muted);font-size:0.85rem;margin-top:0.2rem;font-weight:600;">Payment: ${payLabel[s.paymentMethod] || 'COD'}</div>
    </div>
  `;
}

function nextStep(step) {
  if (step === 1 && !orderData.service) { showToast('Please select a service first!', 'error'); return; }
  if (step === 2 && !orderData.store) { showToast('Please select a store!', 'error'); return; }
  goToStep(step + 1);
}

function prevStep(step) { goToStep(step - 1); }

function goToStep(step) {
  document.querySelectorAll('.order-panel').forEach((p, i) => {
    p.classList.toggle('active', i === step - 1);
  });
  document.querySelectorAll('.order-step').forEach((s, i) => {
    s.classList.toggle('active', i + 1 === step);
    s.classList.toggle('completed', i + 1 < step);
  });
  document.querySelectorAll('.order-step-line').forEach((l, i) => {
    l.classList.toggle('active', i + 1 < step);
  });
  currentStep = step;
  if (step === 4) updateOrderSummary();
  if (step === 5) updateFinalSummary();
  document.getElementById('orderWizard').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function placeOrder() {
  const orderId = 'EW-' + Date.now().toString().slice(-6);
  document.getElementById('orderId').textContent = orderId;
  const s = orderData;
  const details = document.getElementById('successDetails');
  const payLabel = { cod: '💵 Cash on Delivery', bkash: '📱 bKash', card: '💳 Card', nagad: '👛 Nagad' };
  details.innerHTML = [
    s.service ? `<div class="success-detail-chip">🧺 ${s.service.name}</div>` : '',
    s.store ? `<div class="success-detail-chip">📍 ${s.store}</div>` : '',
    `<div class="success-detail-chip">📦 ${s.qty} item(s)</div>`,
    `<div class="success-detail-chip">${payLabel[s.paymentMethod]}</div>`,
    `<div class="success-detail-chip" style="border-color:var(--blue-2);color:var(--blue-2);">💰 Total: ৳${s.total || 0}</div>`,
    s.promoCode ? `<div class="success-detail-chip" style="border-color:var(--success);color:var(--success);">🏷️ ${s.promoCode}</div>` : '',
  ].join('');
  document.querySelectorAll('.order-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('stepSuccess').classList.add('active');
  document.querySelectorAll('.order-step').forEach(s => { s.classList.remove('active'); s.classList.add('completed'); });
}

function resetOrder() {
  orderData = { service: null, store: null, scheduleType: 'pickup', qty: 1, weight: 1.0, promoCode: null, discountPercent: 0, paymentMethod: 'cod' };
  document.querySelectorAll('.service-select-card').forEach(c => c.classList.remove('selected'));
  document.querySelectorAll('.store-select-card').forEach(c => c.classList.remove('selected'));
  document.getElementById('promoInput').value = '';
  document.getElementById('promoFeedback').textContent = '';
  document.getElementById('discountRow').classList.add('hidden');
  document.querySelectorAll('.payment-card').forEach((c, i) => c.classList.toggle('active', i === 0));
  document.getElementById('cardFields').classList.add('hidden');
  document.getElementById('qtyValue').textContent = '1';
  document.getElementById('weightValue').textContent = '1.0';
  updateOrderSummary();
  goToStep(1);
}

function setMinDate() {
  const d = document.getElementById('scheduleDate');
  if (d) { const today = new Date(); d.min = today.toISOString().split('T')[0]; d.value = today.toISOString().split('T')[0]; }
}

// ============================================================
// TERMS TABS
// ============================================================
function switchTab(btn, contentId) {
  document.querySelectorAll('.terms-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.terms-body').forEach(b => b.classList.add('hidden'));
  btn.classList.add('active');
  document.getElementById(contentId).classList.remove('hidden');
}

// ============================================================
// FAQ
// ============================================================
function renderFAQ() {
  const list = document.getElementById('faqList');
  if (!list) return;
  list.innerHTML = FAQ_DATA.map((f, i) => `
    <div class="faq-item" id="faq${i}">
      <div class="faq-question" onclick="toggleFaq(${i})">
        <span>${f.q}</span>
        <i class="fas fa-chevron-down"></i>
      </div>
      <div class="faq-answer"><p>${f.a}</p></div>
    </div>
  `).join('');
}

function toggleFaq(i) {
  const item = document.getElementById('faq' + i);
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(f => f.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

// ============================================================
// CONTACT FORM
// ============================================================
function submitContactForm() {
  showToast('Message sent! We\'ll reply within 24 hours. 📩', 'success');
}

// ============================================================
// BUBBLE BOT
// ============================================================
const BOT_RESPONSES = {
  'track my order': 'You can track your order using your Order ID in the EzzeWash app. Download it here: https://drive.google.com/file/d/1HQc1uRENmjwhyBfJsyjPkUbipY2jP0Uh/view?usp=sharing',
  'view services': 'We offer 9 premium services: Regular Wash & Fold, Comfort Clean, Shoe Clean, Suit Wash, Steam Clean, Iron Press, Express (12hr), Delicate Care, and Dry Clean Standard. Check them all in the Services section! 🧺',
  'current promos': 'Hot deals available now:\n🔥 BLUELOCK10 – 10% OFF\n⚡ THUNDER15 – 15% OFF Express\n👨‍💻 DEVSPECIAL – 20% OFF\n🦇 BATMAN25 – 25% OFF Premium\n🌸 BOISHAKH20 – 20% Seasonal\n...and more in the Promos section!',
  'store locations': '📍 We have 4 stores:\n1. Ezzewash Mirpur\n2. Ezzewash Gulshan\n3. Ezzewash Dhanmondi\n4. Ezzewash Chadd Uddan\nAll open 8AM–9PM daily!',
  'hello': "Hello! 👋 I'm Bubble Bot, EzzeWash's AI assistant! How can I help you today?",
  'hi': "Hi there! 😊 I'm Bubble Bot! Ask me about services, promos, stores, or your order!",
  'download app': 'Download the EzzeWash app here: https://drive.google.com/file/d/1NyCaQkedtT0K8KiEoQ11Fx4vqBwW4VWZ/view?usp=sharing 📱',
  'payment': 'We accept Cash on Delivery (COD), bKash, Nagad, and all major credit/debit cards! 💳',
  'price': 'Our prices start at ৳50 for Iron Press and go up to ৳300 for Suit Wash. Check the Services section for full pricing! 💰',
  'delivery': 'We offer free pickup & delivery within Dhaka city! Schedule in the Order section or via the app. 🚚',
  'cancel': 'You can cancel orders up to 2 hours before pickup for free. Contact washezze@gmail.com for help! 📧',
};

function openBubbleBot() {
  document.getElementById('bubblebotChat').classList.add('open');
  document.querySelector('.bot-open-icon').classList.add('hidden');
  document.querySelector('.bot-close-icon').classList.remove('hidden');
  document.querySelector('.bot-pulse').style.display = 'none';
}

function toggleBubbleBot() {
  const chat = document.getElementById('bubblebotChat');
  chat.classList.toggle('open');
  const isOpen = chat.classList.contains('open');
  document.querySelector('.bot-open-icon').classList.toggle('hidden', isOpen);
  document.querySelector('.bot-close-icon').classList.toggle('hidden', !isOpen);
  document.querySelector('.bot-pulse').style.display = isOpen ? 'none' : 'block';
}

function botQuickReply(text) {
  document.getElementById('botInput').value = text;
  sendBotMsg();
}

function sendBotMsg() {
  const input = document.getElementById('botInput');
  const msg = input.value.trim();
  if (!msg) return;
  input.value = '';
  addBotMessage(msg, 'user');
  setTimeout(() => showBotTyping(), 300);
  setTimeout(() => {
    hideBotTyping();
    const key = Object.keys(BOT_RESPONSES).find(k => msg.toLowerCase().includes(k));
    const reply = key ? BOT_RESPONSES[key] : "I'm not sure about that. For detailed help, please contact our support team at washezze@gmail.com or call +880 1700-3993. 😊";
    addBotMessage(reply, 'bot');
  }, 1400);
}

function addBotMessage(text, role) {
  const msgs = document.getElementById('botMessages');
  const div = document.createElement('div');
  div.className = `bot-msg ${role}`;
  div.innerHTML = `<div class="bot-msg-bubble">${text.replace(/\n/g, '<br>')}</div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

let typingEl = null;
function showBotTyping() {
  const msgs = document.getElementById('botMessages');
  typingEl = document.createElement('div');
  typingEl.className = 'bot-msg bot';
  typingEl.innerHTML = '<div class="bot-msg-bubble"><div class="bot-typing"><span></span><span></span><span></span></div></div>';
  msgs.appendChild(typingEl);
  msgs.scrollTop = msgs.scrollHeight;
}
function hideBotTyping() { if (typingEl) { typingEl.remove(); typingEl = null; } }

// ============================================================
// SCROLL REVEAL (Enhanced)
// ============================================================
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
  });
}

// ============================================================
// COUNTERS
// ============================================================
function initCounters() {
  const counters = document.querySelectorAll('.stat-num');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current).toLocaleString();
  }, 16);
}

// ============================================================
// TOAST
// ============================================================
function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fas ${icons[type] || icons.success}"></i><span>${message}</span>`;
  document.body.appendChild(toast);
  setTimeout(() => { if (toast) toast.remove() }, 3400);
}


