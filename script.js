/* ============================================================
   EZZEWASH — Full Website JavaScript
   Upgraded: Dynamic Bubbles, Smooth Transitions, Parallax, Drag Sliders
   ============================================================ */

// ---- Data ----
let SERVICES = [];
let STORES = [];
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
// (Removed order wizard state)

// ============================================================
// SUPABASE INTEGRATION
// ============================================================
const SUPABASE_URL = 'https://xxvicmprwtbxinuluyqx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4dmljbXByd3RieGludWx1eXF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0NzA2NzcsImV4cCI6MjA4OTA0NjY3N30.qgbvCBRdI1IOPj0AMLE301ZB1mVWuYWg61SS1kIOSvY';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function fetchServices() {
  const { data, error } = await supabaseClient.from('services').select('*').eq('is_active', true);
  if (error) {
    console.error('Error fetching services:', error);
    return;
  }
  SERVICES = data.map(item => ({
    id: item.id,
    name: item.title,
    img: item.image_url,
    price: item.price,
    unit: '/piece',
    badge: item.tags && item.tags.length > 0 ? item.tags[0] : '',
    desc: item.description
  }));
  renderServicesSection();
}

async function fetchStores() {
  const { data, error } = await supabaseClient.from('stores').select('*').eq('is_active', true);
  if (error) {
    console.error('Error fetching stores:', error);
    return;
  }
  STORES = data;
  renderStoresSection();
}

function subscribeToRealtime() {
  supabaseClient
    .channel('public-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, payload => {
      fetchServices();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'stores' }, payload => {
      fetchStores();
    })
    .subscribe();
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initBubbles();
  initNav();

  // Fetch dynamic data
  fetchServices();
  fetchStores();
  subscribeToRealtime();

  renderPromos();
  initHomePromos();
  renderFAQ();
  initScrollReveal();
  initCounters();

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

  // Re-trigger scroll reveal for newly added elements
  initScrollReveal();
}

function goOrder(serviceId) {
  scrollToSection('order');
}

// ============================================================
// RENDER STORES
// ============================================================
function renderStoresSection() {
  const grid = document.getElementById('storesGrid');
  if (!grid) return;
  grid.innerHTML = STORES.map((s, index) => `
    <div class="store-card reveal delay-${index % 4}">
      <div class="store-img-wrap">
        <img src="${s.logo_url}" alt="${s.name}" loading="lazy" decoding="async" />
        <div class="store-img-overlay"><i class="fas fa-map-marker-alt"></i></div>
      </div>
      <div class="store-info">
        <h3>${s.name}</h3>
        <p class="store-addr"><i class="fas fa-location-dot"></i> ${s.address}</p>
        <p class="store-phone"><i class="fas fa-phone"></i> ${s.phone}</p>
        <p class="store-hours"><i class="fas fa-clock"></i> Open: ${s.open_hour > 12 ? s.open_hour - 12 + 'PM' : s.open_hour + 'AM'} – ${s.close_hour > 12 ? s.close_hour - 12 + 'PM' : s.close_hour + 'AM'}</p>
        <div class="store-tags">
          <span class="store-tag">${s.city}</span>
          <span class="store-tag">~${s.distance_km}km</span>
        </div>
        <a href="https://maps.google.com/?q=${s.latitude},${s.longitude}" target="_blank" class="store-map-btn">
          <i class="fas fa-directions"></i> Get Directions
        </a>
      </div>
    </div>
  `).join('');

  // Re-trigger scroll reveal for newly added elements
  initScrollReveal();
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
  'track my order': 'You can track your order using your Order ID in the EzzeWash app. Download it here: https://github.com/Abdulaowalasif/ezze-wash-apk-release/releases/download/v1.3.0/app-release.apk',
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


