/* =============================================
   GTG PERFUMES - Main JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. HEADER SCROLL EFFECT ── */
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });


  /* ── 2. HAMBURGER MENU ── */
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('open');
  });

  // Close on link click
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('open');
    });
  });


  /* ── 3. PRODUCT GALLERY ── */
  const galleryImages = [
    'assets/perfume-1.svg',
    'assets/perfume-2.svg',
    'assets/perfume-3.svg',
    'assets/perfume-4.svg',
  ];

  let currentSlide = 0;
  const mainImg = document.getElementById('galleryMainImg');
  const dots = document.querySelectorAll('.gallery-dot');
  const thumbs = document.querySelectorAll('.gallery-thumb');
  const prevBtn = document.querySelector('.gallery-arrow.prev');
  const nextBtn = document.querySelector('.gallery-arrow.next');

  function goToSlide(index) {
    if (index < 0) index = galleryImages.length - 1;
    if (index >= galleryImages.length) index = 0;
    currentSlide = index;

    // Animate transition
    mainImg.classList.add('fade-out');
    setTimeout(() => {
      mainImg.src = galleryImages[currentSlide];
      mainImg.classList.remove('fade-out');
      mainImg.classList.add('fade-in');
      setTimeout(() => mainImg.classList.remove('fade-in'), 50);
    }, 200);

    // Update dots
    dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));

    // Update thumbs
    thumbs.forEach((t, i) => t.classList.toggle('active', i === currentSlide));
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

  dots.forEach((dot, i) => dot.addEventListener('click', () => goToSlide(i)));
  thumbs.forEach((thumb, i) => thumb.addEventListener('click', () => goToSlide(i)));

  // Touch / Swipe support
  let touchStartX = 0;
  const galleryMain = document.querySelector('.gallery-main');
  if (galleryMain) {
    galleryMain.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    galleryMain.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 40) goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
    }, { passive: true });
  }


  /* ── 4. RADIO OPTIONS + ADD TO CART LINKS ── */
  // Cart link mapping: key = "fragrance_purchaseType"
  const cartLinks = {
    // Oud Royale
    'oud_onetime':        'https://cart.gtgperfumes.com/add?sku=OUD-OT&qty=1',
    'oud_single':         'https://cart.gtgperfumes.com/add?sku=OUD-SS&qty=1&sub=single',
    'oud_double':         'https://cart.gtgperfumes.com/add?sku=OUD-DS&qty=2&sub=double',
    // Amber Elixir
    'amber_onetime':      'https://cart.gtgperfumes.com/add?sku=AMB-OT&qty=1',
    'amber_single':       'https://cart.gtgperfumes.com/add?sku=AMB-SS&qty=1&sub=single',
    'amber_double':       'https://cart.gtgperfumes.com/add?sku=AMB-DS&qty=2&sub=double',
    // Rose Noir
    'rose_onetime':       'https://cart.gtgperfumes.com/add?sku=ROS-OT&qty=1',
    'rose_single':        'https://cart.gtgperfumes.com/add?sku=ROS-SS&qty=1&sub=single',
    'rose_double':        'https://cart.gtgperfumes.com/add?sku=ROS-DS&qty=2&sub=double',
  };

  const priceMap = {
    'oud_onetime':   { price: '$129', original: '$189' },
    'oud_single':    { price: '$109', original: '$129' },
    'oud_double':    { price: '$89',  original: '$109' },
    'amber_onetime': { price: '$119', original: '$169' },
    'amber_single':  { price: '$99',  original: '$119' },
    'amber_double':  { price: '$79',  original: '$99'  },
    'rose_onetime':  { price: '$139', original: '$199' },
    'rose_single':   { price: '$119', original: '$139' },
    'rose_double':   { price: '$99',  original: '$119' },
  };

  let selectedFragrance = 'oud';
  let selectedPurchase = 'onetime';

  function getCartKey() {
    return `${selectedFragrance}_${selectedPurchase}`;
  }

  function updateCartUI() {
    const key = getCartKey();
    const link = cartLinks[key] || '#';
    const prices = priceMap[key] || { price: '$129', original: '$189' };

    // Update "Add to Cart" button href
    const atcBtn = document.getElementById('addToCartBtn');
    if (atcBtn) {
      atcBtn.dataset.href = link;
      atcBtn.setAttribute('aria-label', `Add to cart - ${key}`);
    }

    // Update cart link display
    const cartLinkEl = document.getElementById('cartLinkDisplay');
    if (cartLinkEl) {
      cartLinkEl.innerHTML = `Cart link: <a href="${link}" target="_blank">${link}</a>`;
    }

    // Update price
    const priceEl = document.querySelector('.product-price .current-price');
    const origEl  = document.querySelector('.product-price .original');
    if (priceEl) priceEl.textContent = prices.price;
    if (origEl)  origEl.textContent  = prices.original;

    // Subscription boxes
    const singleBox = document.getElementById('singleSubBox');
    const doubleBox = document.getElementById('doubleSubBox');
    if (singleBox) singleBox.classList.toggle('active', selectedPurchase === 'single');
    if (doubleBox) doubleBox.classList.toggle('active', selectedPurchase === 'double');
  }

  // Fragrance radios
  document.querySelectorAll('input[name="fragrance"]').forEach(radio => {
    radio.addEventListener('change', () => {
      selectedFragrance = radio.value;
      updateCartUI();
    });
  });

  // Purchase type radios
  document.querySelectorAll('input[name="purchase_type"]').forEach(radio => {
    radio.addEventListener('change', () => {
      selectedPurchase = radio.value;
      updateCartUI();
    });
  });

  // Add to Cart button click
  const atcBtn = document.getElementById('addToCartBtn');
  if (atcBtn) {
    atcBtn.addEventListener('click', () => {
      const href = atcBtn.dataset.href || '#';
      // Visual feedback
      const origText = atcBtn.innerHTML;
      atcBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg> Added!`;
      atcBtn.style.background = '#4CAF50';
      setTimeout(() => {
        atcBtn.innerHTML = origText;
        atcBtn.style.background = '';
        window.open(href, '_blank');
      }, 1200);
    });
  }

  // Qty Selector
  const qtyNum = document.getElementById('qtyNum');
  document.querySelector('.qty-btn.minus')?.addEventListener('click', () => {
    const val = parseInt(qtyNum.textContent);
    if (val > 1) qtyNum.textContent = val - 1;
  });
  document.querySelector('.qty-btn.plus')?.addEventListener('click', () => {
    qtyNum.textContent = parseInt(qtyNum.textContent) + 1;
  });

  // Init cart
  updateCartUI();


  /* ── 5. STATS COUNTER ANIMATION ── */
  const statItems = document.querySelectorAll('[data-target]');
  let statsAnimated = false;

  function animateStats() {
    if (statsAnimated) return;
    const statsSection = document.querySelector('.stats-section');
    if (!statsSection) return;
    const rect = statsSection.getBoundingClientRect();
    if (rect.top > window.innerHeight * 0.85) return;

    statsAnimated = true;

    statItems.forEach(item => {
      const target = parseFloat(item.dataset.target);
      const duration = 1800;
      const start = performance.now();

      // Also animate ring
      const ring = item.closest('.stat-card')?.querySelector('.stat-ring-fill');
      const circumference = 339.29;

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic

        const current = eased * target;
        item.textContent = Math.round(current);

        if (ring) {
          const offset = circumference - (eased * circumference * target / 100);
          ring.style.strokeDashoffset = offset;
        }

        if (progress < 1) requestAnimationFrame(update);
        else item.textContent = target;
      }

      requestAnimationFrame(update);
    });
  }

  window.addEventListener('scroll', animateStats, { passive: true });
  animateStats(); // try on load too


  /* ── 6. SCROLL REVEAL ── */
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(el => revealObserver.observe(el));


  /* ── 7. LAZY LOADING ── */
  if ('loading' in HTMLImageElement.prototype) {
    document.querySelectorAll('img[data-src]').forEach(img => {
      img.src = img.dataset.src;
    });
  } else {
    const lazyObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          lazyObserver.unobserve(img);
        }
      });
    });
    document.querySelectorAll('img[data-src]').forEach(img => lazyObserver.observe(img));
  }


  /* ── 8. SMOOTH SCROLL ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

});
