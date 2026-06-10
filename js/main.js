/* ========================================
   Little Explorers Preschool — Main JS
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --- Nav shadow on scroll --- */
  const nav = document.getElementById('main-nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('nav-scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* --- Mobile menu toggle --- */
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const hamburger = menuBtn?.querySelector('.hamburger');

  menuBtn?.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    hamburger?.classList.toggle('active');
  });

  // Close mobile menu on link click
  mobileMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger?.classList.remove('active');
    });
  });

  /* --- Scroll Reveal (IntersectionObserver) --- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* --- Stagger children delay --- */
  document.querySelectorAll('.stagger').forEach(parent => {
    Array.from(parent.children).forEach((child, i) => {
      child.style.setProperty('--i', i);
    });
  });

  /* --- Animated Counters --- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.dataset.count, 10);
            const suffix = el.dataset.suffix || '';
            const duration = 2200;
            const start = performance.now();

            function tick(now) {
              const progress = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 4);
              el.textContent = Math.round(eased * target) + suffix;
              if (progress < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
            counterObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(el => counterObserver.observe(el));
  }

  /* --- FAQ Accordion --- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const toggle = item.querySelector('.faq-toggle');
    const content = item.querySelector('.faq-content');
    if (!toggle || !content) return;

    toggle.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all siblings
      item.closest('.faq-list')?.querySelectorAll('.faq-item.open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.faq-content').style.maxHeight = '0';
        }
      });

      // Toggle current
      item.classList.toggle('open', !isOpen);
      content.style.maxHeight = isOpen ? '0' : content.scrollHeight + 'px';
    });
  });

  /* --- Contact Form --- */
  const form = document.getElementById('contact-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    form.querySelectorAll('[required]').forEach(input => {
      if (!input.value.trim()) {
        input.classList.add('error');
        valid = false;
      } else {
        input.classList.remove('error');
      }
    });

    // Email format check
    const email = form.querySelector('[type="email"]');
    if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      email.classList.add('error');
      valid = false;
    }

    if (valid) {
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.innerHTML;
      btn.innerHTML = '<span class="flex items-center gap-2">Message Sent <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/></svg></span>';
      btn.disabled = true;
      btn.classList.add('opacity-80');
      setTimeout(() => {
        btn.innerHTML = original;
        btn.disabled = false;
        btn.classList.remove('opacity-80');
        form.reset();
      }, 3500);
    }
  });

  // Clear error state on input
  document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('input', () => input.classList.remove('error'));
  });

});
