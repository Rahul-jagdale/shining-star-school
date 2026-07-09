// ===== SHINING STAR PUBLIC SCHOOL - SCRIPTS =====

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const navCta = document.getElementById('navCta');
  hamburger?.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navCta.classList.toggle('open');
    hamburger.classList.toggle('active');
  });
  // Mobile Dropdown Toggle
  document.querySelectorAll('.dropdown > a').forEach(dropdownToggle => {
    dropdownToggle.addEventListener('click', (e) => {
      if (window.innerWidth <= 768 && navLinks.classList.contains('open')) {
        e.preventDefault();
        e.stopPropagation();
        const dropdown = dropdownToggle.closest('.dropdown');
        dropdown.classList.toggle('dropdown-open');
      }
    });
  });

  // Close menu on link click (but not dropdown parent)
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
      const isDropdownParent = link.closest('.dropdown') && link === link.closest('.dropdown').querySelector(':scope > a');
      if (isDropdownParent && window.innerWidth <= 768) return;
      navLinks.classList.remove('open');
      navCta.classList.remove('open');
      hamburger.classList.remove('active');
      // Close all dropdowns
      document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('dropdown-open'));
    });
  });

  // Scroll Animations
  const fadeEls = document.querySelectorAll('.fade-up');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  fadeEls.forEach(el => observer.observe(el));

  // Animated Counters
  const counterEls = document.querySelectorAll('.counter-number');
  let counterDone = false;
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !counterDone) {
        counterDone = true;
        counterEls.forEach(el => {
          const target = parseInt(el.dataset.target);
          const suffix = el.dataset.suffix || '';
          let current = 0;
          const step = Math.max(1, Math.floor(target / 60));
          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = current + suffix;
          }, 30);
        });
      }
    });
  }, { threshold: 0.3 });
  const counterSection = document.querySelector('.counters');
  if (counterSection) counterObserver.observe(counterSection);

  // Gallery Filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      galleryItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = 'flex';
          item.style.animation = 'fadeIn .4s ease';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxClose = document.getElementById('lightboxClose');
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      lightboxImg.textContent = item.querySelector('.gallery-emoji')?.textContent || '🖼️';
      lightboxTitle.textContent = item.querySelector('.gallery-overlay')?.textContent || '';
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });
  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

  // Admission Form Validation & Submission
  const admissionForm = document.getElementById('admissionForm');
  const successPopup = document.getElementById('successPopup');
  const popupClose = document.getElementById('popupClose');

  // Replace this URL with your deployed Google Apps Script Web App URL
  const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

  admissionForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    let valid = true;
    const fields = admissionForm.querySelectorAll('[required]');
    fields.forEach(field => {
      const group = field.closest('.form-group');
      if (!field.value.trim()) {
        group.classList.add('invalid');
        valid = false;
      } else {
        group.classList.remove('invalid');
      }
    });
    // Email validation
    const emailField = admissionForm.querySelector('[name="email"]');
    if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
      emailField.closest('.form-group').classList.add('invalid');
      valid = false;
    }
    // Phone validation
    const phoneField = admissionForm.querySelector('[name="mobile"]');
    if (phoneField && phoneField.value && !/^\d{10}$/.test(phoneField.value.replace(/\s/g, ''))) {
      phoneField.closest('.form-group').classList.add('invalid');
      valid = false;
    }

    if (!valid) return;

    const submitBtn = admissionForm.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;

    const formData = new FormData(admissionForm);
    const data = Object.fromEntries(formData.entries());

    try {
      if (GOOGLE_SCRIPT_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      }
      successPopup.classList.add('active');
      admissionForm.reset();
    } catch (err) {
      alert('Something went wrong. Please try again or call us directly.');
      console.error(err);
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });

  // Clear validation on input
  document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(el => {
    el.addEventListener('input', () => el.closest('.form-group').classList.remove('invalid'));
  });

  popupClose?.addEventListener('click', () => successPopup.classList.remove('active'));

  // Contact Form
  const contactForm = document.getElementById('contactForm');
  contactForm?.addEventListener('submit', (e) => {
    const fields = contactForm.querySelectorAll('[required]');
    let valid = true;
    fields.forEach(field => {
      const group = field.closest('.form-group');
      if (!field.value.trim()) { group.classList.add('invalid'); valid = false; }
      else { group.classList.remove('invalid'); }
    });

    if (!valid) {
      e.preventDefault();
    } else {
      const btn = contactForm.querySelector('button[type="submit"]');
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
      // Form will submit naturally to FormSubmit.co
    }
  });

  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    if (window.scrollY > 50) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  });

  // Sparkle stars creation
  function createSparkles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    for (let i = 0; i < 15; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.textContent = '⭐';
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      star.style.animationDelay = Math.random() * 3 + 's';
      star.style.fontSize = (Math.random() * 1 + 0.5) + 'rem';
      hero.appendChild(star);
    }
  }
  createSparkles();

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const navH = document.querySelector('.navbar').offsetHeight;
        const top = target.offsetTop - navH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
});
