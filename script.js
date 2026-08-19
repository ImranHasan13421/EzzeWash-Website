/* ============================================================
   EZZEWASH — Optimized Website JavaScript
   Performance-first: Deferred init, event delegation, passive
   listeners, debounced scroll, requestIdleCallback
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

const FAQ_DATA = [
  { q: 'How long does standard service take?', a: 'Standard Wash & Fold takes 2–3 business days. Express Service is available within 24 hours for an additional charge.' },
  { q: 'Do you offer pickup and delivery?', a: 'Yes! We offer free pickup and delivery within Dhaka city. Schedule your pickup through our website or app.' },
  { q: 'What if my item gets damaged?', a: 'We take every precaution, but in case of damage caused by our negligence, we offer compensation up to 10× the service charge. Report within 48 hours of delivery.' },
  { q: 'Can I use multiple promo codes?', a: 'Only one promo code can be applied per order. Codes cannot be combined and are subject to their individual terms and expiry dates.' },
  { q: 'How do I track my order?', a: 'You can track your order in real-time using our EzzeWash app powered by Bubble Bot AI, or contact our support line for updates.' },
  { q: 'What payment methods do you accept?', a: 'We accept Cash on Delivery (COD), bKash, Nagad, and all major credit/debit cards.' },
  { q: 'Is my clothing safe from shrinkage?', a: 'Our team is trained to read garment labels and use the appropriate washing method. However, pre-existing fabric conditions may cause minimal shrinkage.' },
];

// ============================================================
// SUPABASE INTEGRATION (lazy-loaded)
// ============================================================
const SUPABASE_URL = 'https://xxvicmprwtbxinuluyqx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4dmljbXByd3RieGludWx1eXF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0NzA2NzcsImV4cCI6MjA4OTA0NjY3N30.qgbvCBRdI1IOPj0AMLE301ZB1mVWuYWg61SS1kIOSvY';
let supabaseClient = null;

function getSupabase() {
  if (!supabaseClient && window.supabase) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return supabaseClient;
}

async function fetchServices() {
  const client = getSupabase();
  if (!client) {
    console.warn('Supabase SDK not yet loaded, retrying in 1s...');
    setTimeout(fetchServices, 1000);
    return;
  }
  try {
    const { data, error } = await client.from('services').select('*').eq('is_active', true);
    if (error) throw error;
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
  } catch (err) {
    console.error('Error fetching services:', err);
    // Show fallback
    const grid = document.getElementById('servicesGrid');
    if (grid && !grid.hasChildNodes()) {
      grid.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:2rem;">Loading services...</p>';
    }
  }
}

async function fetchStores() {
  const client = getSupabase();
  if (!client) {
    console.warn('Supabase SDK not yet loaded, retrying in 1s...');
    setTimeout(fetchStores, 1000);
    return;
  }
  try {
    const { data, error } = await client.from('stores').select('*').eq('is_active', true);
    if (error) throw error;
    STORES = data;
    renderStoresSection();
  } catch (err) {
    console.error('Error fetching stores:', err);
    const grid = document.getElementById('storesGrid');
    if (grid && !grid.hasChildNodes()) {
      grid.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:2rem;">Loading stores...</p>';
    }
  }
}

function subscribeToRealtime() {
  const client = getSupabase();
  if (!client) return;
  client
    .channel('public-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, () => fetchServices())
    .on('postgres_changes', { event: '*', schema: 'public', table: 'stores' }, () => fetchStores())
    .subscribe();
}

// ============================================================
// SHARED INTERSECTION OBSERVER (single observer for reveals)
// ============================================================
let revealObserver = null;

function getRevealObserver() {
  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          revealObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
  }
  return revealObserver;
}

function observeNewReveals(root) {
  const observer = getRevealObserver();
  const target = root || document;
  target.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el));
}

// ============================================================
// INIT — Critical path first, defer the rest
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  // Critical — affects first paint
  initTheme();
  initNav();

  // Render static content
  renderPromos();
  renderFAQ();

  // Observe scroll reveals
  observeNewReveals();

  // Counter animations
  initCounters();

  // Defer non-critical work
  const deferWork = () => {
    initBubbles();
    initHeroParallax();
    initDraggableSliders();
    initEventDelegation();

    // Fetch dynamic data after SDK loads
    fetchServices();
    fetchStores();
    subscribeToRealtime();
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(deferWork, { timeout: 2000 });
  } else {
    setTimeout(deferWork, 100);
  }
});

// ============================================================
// EVENT DELEGATION — Single listener for all click actions
// ============================================================
function initEventDelegation() {
  document.addEventListener('click', (e) => {
    const target = e.target;

    // data-scroll="sectionId" — smooth scroll
    const scrollBtn = target.closest('[data-scroll]');
    if (scrollBtn) {
      e.preventDefault();
      scrollToSection(scrollBtn.dataset.scroll);
      return;
    }

    // data-action="open-bot" — open bubble bot
    const actionBtn = target.closest('[data-action="open-bot"]');
    if (actionBtn) {
      openBubbleBot();
      return;
    }

    // data-action="close-bot" — close bubble bot
    const closeBtn = target.closest('[data-action="close-bot"]');
    if (closeBtn) {
      toggleBubbleBot();
      return;
    }

    // data-promo-scroll — promo scroll buttons
    const promoScrollBtn = target.closest('[data-promo-scroll]');
    if (promoScrollBtn) {
      scrollPromos(parseInt(promoScrollBtn.dataset.promoScroll));
      return;
    }

    // data-tab — terms tabs
    const tabBtn = target.closest('[data-tab]');
    if (tabBtn) {
      switchTab(tabBtn, tabBtn.dataset.tab);
      return;
    }

    // data-bot-reply — quick replies
    const botReplyBtn = target.closest('[data-bot-reply]');
    if (botReplyBtn) {
      botQuickReply(botReplyBtn.dataset.botReply);
      return;
    }

    // FAQ toggle
    const faqQuestion = target.closest('.faq-question');
    if (faqQuestion) {
      const faqItem = faqQuestion.closest('.faq-item');
      if (faqItem) {
        const isOpen = faqItem.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(f => f.classList.remove('open'));
        if (!isOpen) faqItem.classList.add('open');
      }
      return;
    }

    // Promo code copy
    const promoCode = target.closest('.promo-code-display');
    if (promoCode) {
      const code = promoCode.querySelector('span').textContent;
      copyPromoCode(code, promoCode);
      return;
    }

    // Service order button
    const serviceOrderBtn = target.closest('.service-order-btn');
    if (serviceOrderBtn) {
      scrollToSection('order');
      return;
    }

    // Bubble bot FAB
    if (target.closest('#bubblebotFab')) {
      toggleBubbleBot();
      return;
    }

    // Bot send button
    if (target.closest('#botSendBtn')) {
      sendBotMsg();
      return;
    }
  });

  // Bot input enter key
  const botInput = document.getElementById('botInput');
  if (botInput) {
    botInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendBotMsg();
    });
  }
}

// ============================================================
// BACKGROUND BUBBLES — Reduced count for performance
// ============================================================
function initBubbles() {
  const container = document.getElementById('bg-bubbles');
  if (!container) return;

  // Reduced: 6 on desktop, 3 on mobile (was 15/8)
  const bubbleCount = window.innerWidth > 768 ? 6 : 3;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < bubbleCount; i++) {
    const bubble = document.createElement('div');
    bubble.className = 'bg-bubble';
    const size = Math.random() * 70 + 30;
    bubble.style.cssText = `
      width:${size}px;height:${size}px;
      left:${Math.random() * 100}vw;
      animation-duration:${Math.random() * 13 + 12}s;
      animation-delay:${Math.random() * 10}s;
    `;
    fragment.appendChild(bubble);
  }
  container.appendChild(fragment);
}

// ============================================================
// HERO PARALLAX
// ============================================================
function initHeroParallax() {
  const wrap = document.querySelector('.hero-img-wrap');
  const hero = document.querySelector('.hero');
  if (!wrap || !hero) return;

  let ticking = false;

  document.addEventListener('mousemove', (e) => {
    if (window.innerWidth < 900) {
      wrap.style.transform = 'none';
      return;
    }
    if (!ticking) {
      requestAnimationFrame(() => {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 40;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 40;
        wrap.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  hero.addEventListener('mouseleave', () => {
    if (window.innerWidth >= 900) {
      wrap.style.transform = 'rotateY(-5deg) rotateX(2deg)';
    }
  }, { passive: true });
}

// ============================================================
// DRAGGABLE SLIDERS
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
    }, { passive: true });

    slider.addEventListener('mouseup', () => {
      isDown = false;
      slider.classList.remove('active');
    }, { passive: true });

    slider.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2;
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
// NAVBAR — With debounced scroll
// ============================================================
let scrollTicking = false;

function initNav() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Debounced scroll handler
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 20);
        updateActiveNav();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  // Nav link clicks
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      scrollToSection(link.dataset.page);
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

function updateActiveNav() {
  const sections = ['home', 'order', 'services', 'stores', 'promos', 'terms', 'help'];
  const offset = 120;
  let current = 'home';
  for (let i = sections.length - 1; i >= 0; i--) {
    const el = document.getElementById(sections[i]);
    if (el && window.scrollY >= el.offsetTop - offset) {
      current = sections[i];
      break;
    }
  }
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
        <img src="${s.img}" alt="${s.name}" width="300" height="220" loading="lazy" decoding="async" />
        ${s.badge ? `<div class="service-card-badge">${s.badge}</div>` : ''}
      </div>
      <div class="service-card-body">
        <h3>${s.name}</h3>
        <p>${s.desc}</p>
        <div class="service-card-footer">
          <span class="service-price">From ৳${s.price}<small>${s.unit}</small></span>
          <button class="service-order-btn" data-service-id="${s.id}">Order Now</button>
        </div>
      </div>
    </div>
  `).join('');

  observeNewReveals(grid);
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
        <img src="${s.logo_url}" alt="${s.name}" width="300" height="220" loading="lazy" decoding="async" />
        <div class="store-img-overlay" aria-hidden="true"><i class="fas fa-map-marker-alt"></i></div>
      </div>
      <div class="store-info">
        <h3>${s.name}</h3>
        <p class="store-addr"><i class="fas fa-location-dot" aria-hidden="true"></i> ${s.address}</p>
        <p class="store-phone"><i class="fas fa-phone" aria-hidden="true"></i> ${s.phone}</p>
        <p class="store-hours"><i class="fas fa-clock" aria-hidden="true"></i> Open: ${s.open_hour > 12 ? s.open_hour - 12 + 'PM' : s.open_hour + 'AM'} – ${s.close_hour > 12 ? s.close_hour - 12 + 'PM' : s.close_hour + 'AM'}</p>
        <div class="store-tags">
          <span class="store-tag">${s.city}</span>
          <span class="store-tag">~${s.distance_km}km</span>
        </div>
        <a href="https://maps.google.com/?q=${s.latitude},${s.longitude}" target="_blank" rel="noopener noreferrer" class="store-map-btn">
          <i class="fas fa-directions" aria-hidden="true"></i> Get Directions
        </a>
      </div>
    </div>
  `).join('');

  observeNewReveals(grid);
}

// ============================================================
// RENDER PROMOS
// ============================================================
function renderPromos() {
  const track = document.getElementById('promoTrack');
  if (!track) return;
  track.innerHTML = PROMOS.map(p => promoCardHTML(p)).join('');
}

function promoCardHTML(p) {
  return `
    <div class="promo-card">
      ${p.tag ? `<div class="promo-tag">${p.tag}</div>` : ''}
      <div class="promo-card-media">
        <img src="${p.img}" alt="${p.name}" width="300" height="190" loading="lazy" decoding="async" />
        ${p.isGif ? '<div class="promo-gif-badge">GIF</div>' : ''}
      </div>
      <div class="promo-card-body">
        <h3>${p.name}</h3>
        <div class="promo-discount">${p.discount}</div>
        <p style="font-size:0.85rem;font-weight:500;color:var(--text-muted);margin-bottom:0.5rem">${p.desc}</p>
        <div class="promo-code-display">
          <span>${p.code}</span>
          <i class="fas fa-copy" aria-hidden="true"></i>
        </div>
        <div class="promo-expiry"><i class="fas fa-clock" style="color:var(--warning);margin-right:6px" aria-hidden="true"></i>${p.expiry}</div>
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
  setTimeout(() => {
    icon.className = 'fas fa-copy';
    icon.style.color = '';
    icon.style.transform = 'scale(1)';
  }, 2000);
}

function scrollPromos(dir) {
  const track = document.getElementById('promoTrack');
  if (track) track.scrollBy({ left: dir * 320, behavior: 'smooth' });
}

// ============================================================
// TERMS TABS
// ============================================================
function switchTab(btn, contentId) {
  document.querySelectorAll('.terms-tab').forEach(t => {
    t.classList.remove('active');
    t.setAttribute('aria-selected', 'false');
  });
  document.querySelectorAll('.terms-body').forEach(b => b.classList.add('hidden'));
  btn.classList.add('active');
  btn.setAttribute('aria-selected', 'true');
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
      <div class="faq-question" role="button" tabindex="0" aria-expanded="false">
        <span>${f.q}</span>
        <i class="fas fa-chevron-down" aria-hidden="true"></i>
      </div>
      <div class="faq-answer" role="region"><p>${f.a}</p></div>
    </div>
  `).join('');
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
  toast.innerHTML = `<i class="fas ${icons[type] || icons.success}" aria-hidden="true"></i><span>${message}</span>`;
  document.body.appendChild(toast);
  setTimeout(() => { if (toast) toast.remove() }, 3400);
}
