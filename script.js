/* ============================================================
   RENEWABLE POWER — STACKLY | Global Scripts
   GSAP text animation, scroll reveals, 3D tilt, counters,
   mobile nav, project filters, login/auth demo, dashboard UI
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Preloader ---------- */
  const pre = document.querySelector('.preloader');
  if (pre) window.addEventListener('load', () => setTimeout(() => pre.classList.add('done'), 400));
  if (pre) setTimeout(() => pre.classList.add('done'), 2500); // failsafe

  /* ---------- Sticky header ---------- */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Mobile nav ---------- */
  const burger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (burger && navLinks) {
    const closeNav = () => { burger.classList.remove('open'); navLinks.classList.remove('open'); document.body.classList.remove('nav-open'); };
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      navLinks.classList.toggle('open');
      document.body.classList.toggle('nav-open', navLinks.classList.contains('open'));
    });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
    document.addEventListener('click', e => {
      if (document.body.classList.contains('nav-open') &&
          !navLinks.contains(e.target) && !burger.contains(e.target)) closeNav();
    });
  }

  /* ---------- Cursor glow ---------- */
  const glow = document.querySelector('.cursor-glow');
  if (glow && matchMedia('(pointer:fine)').matches) {
    window.addEventListener('mousemove', e => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });
  }

  /* ============================================================
     GSAP — TEXT ANIMATIONS
     ============================================================ */
  if (window.gsap) {
    gsap.registerPlugin(ScrollTrigger);
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.querySelectorAll('[data-split]').forEach(el => {
      const words = el.textContent.trim().split(/\s+/);
      el.innerHTML = words.map(w =>
        `<span class="split-line">${[...w].map(c => `<span class="char">${c}</span>`).join('')}</span>`
      ).join(' ');
    });

    document.querySelectorAll('[data-split]').forEach(el => {
      gsap.to(el.querySelectorAll('.char'), {
        y: 0, opacity: 1,
        duration: reduce ? 0 : 0.9,
        ease: 'power4.out',
        stagger: reduce ? 0 : 0.028,
        scrollTrigger: { trigger: el, start: 'top 88%' }
      });
    });

    document.querySelectorAll('.reveal').forEach((el, i) => {
      gsap.fromTo(el, { y: 50, opacity: 0 }, {
        y: 0, opacity: 1,
        duration: reduce ? 0 : 1,
        delay: (i % 3) * 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%' }
      });
    });

    const heroLead = document.querySelector('.hero p.lead');
    if (heroLead && !reduce) {
      gsap.from([heroLead, '.hero-actions', '.hero-stats'], {
        y: 40, opacity: 0, duration: 1, stagger: 0.15, delay: 0.5, ease: 'power3.out'
      });
      gsap.from('.scene', { scale: 0.7, opacity: 0, duration: 1.4, delay: 0.4, ease: 'back.out(1.4)' });
    }
  }

  /* ---------- 3D tilt cards ---------- */
  document.querySelectorAll('.tilt').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateZ(8px)`;
      card.style.boxShadow = '0 34px 70px -22px rgba(6,42,34,.45)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(900px) rotateY(0) rotateX(0)';
      card.style.boxShadow = '';
    });
  });

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const el = en.target, target = +el.dataset.count, suffix = el.dataset.suffix || '';
        const t0 = performance.now(), dur = 1800;
        const tick = now => {
          const p = Math.min((now - t0) / dur, 1);
          el.textContent = Math.floor(target * (1 - Math.pow(1 - p, 3))).toLocaleString() + (p === 1 ? suffix : '');
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        io.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(c => io.observe(c));
  }

  /* ---------- Project filters ---------- */
  const filterBtns = document.querySelectorAll('.filter-bar button');
  filterBtns.forEach(btn => btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    document.querySelectorAll('.proj').forEach(p => {
      const show = f === 'all' || p.dataset.cat === f;
      p.style.display = show ? '' : 'none';
      if (show && window.gsap) gsap.fromTo(p, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .6 });
    });
  }));

  /* ---------- Back to top ---------- */
  const toTop = document.querySelector('.to-top');
  if (toTop) {
    window.addEventListener('scroll', () => toTop.classList.toggle('show', window.scrollY > 500), { passive: true });
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------- Contact / newsletter demo handlers ---------- */
  document.querySelectorAll('[data-demo-form]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const ok = form.querySelector('.alert');
      if (ok) { ok.className = 'alert ok'; ok.textContent = 'Thanks! Your message was sent. Our team will reach out within 24 hours.'; }
      form.reset();
    });
  });

  /* ============================================================
     AUTH — modelled on the reference portal
     ============================================================ */
  const safeGet = (store, key) => { try { return window[store].getItem(key); } catch (e) { return null; } };
  const safeSet = (store, key, val) => { try { window[store].setItem(key, val); } catch (e) { /* blocked */ } };

  let accounts = {};
  try { accounts = JSON.parse(safeGet('localStorage', 'rp_accounts') || '{}'); } catch (e) { accounts = {}; }

  const readSession = () => {
    try { const s = safeGet('sessionStorage', 'rp_current_user'); if (s) return JSON.parse(s); } catch (e) { /* blocked */ }
    const q = new URLSearchParams(location.search);
    if (q.get('name')) return { name: q.get('name'), role: q.get('role') || 'user', email: q.get('email') || '' };
    return null;
  };
  const clearSession = () => { try { sessionStorage.removeItem('rp_current_user'); } catch (e) { /* ignore */ } };

  const showErr = (id, on) => { const el = document.getElementById(id); if (el) el.classList.toggle('show', on); };
  const markInput = (id, on) => { const el = document.getElementById(id); if (el) el.classList.toggle('error', on); };
  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const prettify = email => email.split('@')[0].replace(/[._-]+/g, ' ')
    .split(' ').filter(Boolean).map(w => w[0].toUpperCase() + w.slice(1)).join(' ');

  window.switchMode = mode => {
    const si = document.getElementById('loginForm'), su = document.getElementById('signupForm');
    const ti = document.getElementById('toggle-signin'), tu = document.getElementById('toggle-signup');
    if (!si || !su) return;
    const isIn = mode === 'signin';
    si.classList.toggle('active', isIn); su.classList.toggle('active', !isIn);
    ti.classList.toggle('active', isIn); tu.classList.toggle('active', !isIn);
    const t = document.getElementById('authTitle'), s = document.getElementById('authSub');
    if (t) t.textContent = isIn ? 'Welcome back' : 'Create account';
    if (s) s.textContent = isIn ? 'Sign in to your STACKLY account'
                                : 'Join 12,000+ customers on STACKLY Renewable Power';
    if (window.gsap) {
      gsap.fromTo((isIn ? si : su).children, { opacity: 0, y: 14 }, { opacity: 1, y: 0, stagger: .05, duration: .4, ease: 'power2.out' });
      if (t) gsap.fromTo([t, s], { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .45, stagger: .08, ease: 'power2.out' });
    }
  };

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    let selectedRole = 'user';
    document.querySelectorAll('#roleTabs button').forEach(b => b.addEventListener('click', () => {
      document.querySelectorAll('#roleTabs button').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      selectedRole = b.dataset.role;
    }));
    document.querySelectorAll('.auth-form-panel input').forEach(inp =>
      inp.addEventListener('input', () => inp.classList.remove('error')));

    document.querySelectorAll('.pw-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = document.getElementById(btn.dataset.target);
        if (!input) return;
        const show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        btn.classList.toggle('showing', show);
        btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
      });
    });

    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = document.getElementById('signin-email').value.trim().toLowerCase();
      const pass = document.getElementById('signin-pass').value;
      let valid = true;
      if (!email || !emailRx.test(email)) { showErr('err-signin-email', true); markInput('signin-email', true); valid = false; }
      else { showErr('err-signin-email', false); markInput('signin-email', false); }
      if (!pass) { showErr('err-signin-pass', true); markInput('signin-pass', true); valid = false; }
      else { showErr('err-signin-pass', false); markInput('signin-pass', false); }
      if (!valid) return;

      const btn = document.getElementById('btn-signin');
      btn.textContent = 'Sign in…'; btn.disabled = true;
      setTimeout(() => {
        const stored = accounts[email];
        const name = stored ? stored.name : prettify(email);
        const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
        safeSet('sessionStorage', 'rp_current_user', JSON.stringify({ email, name, initials, role: selectedRole }));
        location.href = (selectedRole === 'admin' ? 'admin-dashboard.html' : 'user-dashboard.html')
          + '?name=' + encodeURIComponent(name) + '&role=' + selectedRole + '&email=' + encodeURIComponent(email);
      }, 1000);
    });

    window.googleSignIn = () => {
      const input = prompt('Continue with Google\n\nEnter your Google email:', 'yourname@gmail.com');
      if (input === null) return;
      const email = input.trim().toLowerCase();
      if (!emailRx.test(email)) { alert('Please enter a valid Google email address.'); return; }
      const stored = accounts[email];
      const name = stored ? stored.name : prettify(email);
      const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
      safeSet('sessionStorage', 'rp_current_user', JSON.stringify({ email, name, initials, role: selectedRole, provider: 'google' }));
      location.href = (selectedRole === 'admin' ? 'admin-dashboard.html' : 'user-dashboard.html')
        + '?name=' + encodeURIComponent(name) + '&role=' + selectedRole + '&email=' + encodeURIComponent(email);
    };

    window.openModal = id => {
      const m = document.getElementById(id);
      if (!m) return;
      m.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (window.gsap) gsap.fromTo(m.querySelector('.auth-modal-box'),
        { scale: .88, opacity: 0, y: 30 }, { scale: 1, opacity: 1, y: 0, duration: .45, ease: 'back.out(1.4)' });
    };
    window.closeModal = id => {
      const m = document.getElementById(id);
      if (!m) return;
      if (window.gsap) gsap.to(m.querySelector('.auth-modal-box'), {
        scale: .92, opacity: 0, duration: .25, ease: 'power2.in',
        onComplete: () => { m.classList.remove('open'); document.body.style.overflow = ''; }
      });
      else { m.classList.remove('open'); document.body.style.overflow = ''; }
    };
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') document.querySelectorAll('.auth-modal.open').forEach(m => closeModal(m.id));
    });

    const forgotForm = document.getElementById('forgotForm');
    if (forgotForm) {
      forgotForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('reset-email').value.trim().toLowerCase();
        const alertBox = document.getElementById('forgotAlert');
        const errMsg = document.getElementById('err-reset-email');
        const inp = document.getElementById('reset-email');
        if (!emailRx.test(email)) {
          errMsg.classList.add('show'); inp.classList.add('error'); return;
        }
        errMsg.classList.remove('show'); inp.classList.remove('error');
        const btn = forgotForm.querySelector('button[type=submit]');
        btn.textContent = 'Sending…'; btn.disabled = true;
        setTimeout(() => {
          btn.textContent = 'Send Reset Link'; btn.disabled = false;
          alertBox.className = 'alert ok';
          alertBox.textContent = 'Reset link sent to ' + email + '. Check your inbox.';
          forgotForm.reset();
        }, 1200);
      });
    }

    const signupForm = document.getElementById('signupForm');
    signupForm.addEventListener('submit', e => {
      e.preventDefault();
      const firstN = document.getElementById('signup-first').value.trim();
      const lastN = document.getElementById('signup-last').value.trim();
      const email = document.getElementById('signup-email').value.trim().toLowerCase();
      const phone = document.getElementById('signup-phone').value.replace(/\D/g, '');
      const pass = document.getElementById('signup-pass').value;
      const confirm = document.getElementById('signup-confirm').value;
      let valid = true;
      const check = (ok, errId, inputId) => {
        showErr(errId, !ok); markInput(inputId, !ok);
        if (!ok) valid = false;
      };
      check(!!firstN, 'err-signup-first', 'signup-first');
      check(!!lastN, 'err-signup-last', 'signup-last');
      check(emailRx.test(email), 'err-signup-email', 'signup-email');
      check(phone.length === 10, 'err-signup-phone', 'signup-phone');
      check(pass.length >= 6, 'err-signup-pass', 'signup-pass');
      check(pass === confirm, 'err-signup-confirm', 'signup-confirm');
      if (!valid) return;

      const name = firstN + ' ' + lastN;
      const btn = document.getElementById('btn-signup');
      btn.textContent = 'Creating account…'; btn.disabled = true;
      setTimeout(() => {
        btn.textContent = 'Create My Account →'; btn.disabled = false;
        accounts[email] = { name, email, phone, pass };
        safeSet('localStorage', 'rp_accounts', JSON.stringify(accounts));
        switchMode('signin');
        document.getElementById('signin-email').value = email;
        signupForm.reset();
        openModal('successModal');
      }, 1000);
    });
  }

  /* ---------- Dashboard personalization ---------- */
  const dashRoot = document.querySelector('.dash');
  if (dashRoot) {
    const u = readSession();
    if (u && u.name) {
      const first = u.name.split(' ')[0];
      const h = new Date().getHours();
      const greet = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
      document.querySelectorAll('[data-greet]').forEach(el =>
        el.textContent = greet + ', ' + first + ' ' + (el.dataset.greet || '☀️'));
      document.querySelectorAll('[data-user-name]').forEach(el => el.textContent = u.name);
      document.querySelectorAll('[data-user-email]').forEach(el => { if (u.email) el.textContent = u.email; });
      document.querySelectorAll('[data-user-avatar]').forEach(el =>
        el.textContent = u.initials || u.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase());
      if (window.gsap) gsap.from('[data-greet]', { y: 14, opacity: 0, duration: .7, ease: 'power3.out' });
    }
    document.querySelectorAll('a[href^="login.html"]').forEach(a =>
      a.addEventListener('click', clearSession));
  }

  /* ============================================================
     SIDEBAR — scroll-to-top button
     Shows after scrolling 120px down inside the sidebar.
     Smoothly scrolls back to the top of the sidebar on click.
     ============================================================ */
  const sidebar = document.querySelector('.sidebar');
  if (sidebar) {
    /* Create the scroll-to-top button and inject it before the Logout link */
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'sidebar-scroll-top';
    scrollBtn.setAttribute('aria-label', 'Scroll to top of menu');
    scrollBtn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polyline points="18 15 12 9 6 15"/>
      </svg>
      Back to top`;

    /* Insert just before the last link (Logout) so it sits near the bottom naturally */
    const logoutLink = sidebar.querySelector('a[href="login.html"]');
    if (logoutLink) {
      sidebar.insertBefore(scrollBtn, logoutLink);
    } else {
      sidebar.appendChild(scrollBtn);
    }

    /* Show/hide based on sidebar scroll position */
    const THRESHOLD = 120;
    sidebar.addEventListener('scroll', () => {
      scrollBtn.classList.toggle('visible', sidebar.scrollTop > THRESHOLD);
    }, { passive: true });

    /* Click → smooth scroll to top of sidebar */
    scrollBtn.addEventListener('click', () => {
      sidebar.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ── Mobile sidebar open/close ── */
    const dburger = document.querySelector('.dash-burger');
    if (dburger) {
      const closeSide = () => sidebar.classList.remove('open');
      dburger.addEventListener('click', e => { e.stopPropagation(); sidebar.classList.add('open'); });
      const xBtn = sidebar.querySelector('.sidebar-close');
      if (xBtn) xBtn.addEventListener('click', closeSide);
      sidebar.querySelectorAll('a').forEach(a => a.addEventListener('click', closeSide));
      document.addEventListener('click', e => {
        if (sidebar.classList.contains('open') && !sidebar.contains(e.target)) closeSide();
      });
    }
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq');
      const ans = item.querySelector('.faq-a');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq.open').forEach(o => {
        o.classList.remove('open');
        o.querySelector('.faq-a').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        ans.style.maxHeight = ans.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Solar savings calculator ---------- */
  const calcBill = document.getElementById('calcBill');
  if (calcBill) {
    const fmt = n => n.toLocaleString('en-IN');
    const update = () => {
      const bill = +calcBill.value;
      const tariff = 8;
      const usage = bill / tariff;
      const sizeKw = usage / 120;
      const monthlySave = bill * 0.9;
      const cost = sizeKw * 55000;
      const paybackYrs = cost / (monthlySave * 12);
      const lifeSaveLakh = (monthlySave * 12 * 25 - cost) / 100000;
      document.getElementById('calcBillVal').textContent = fmt(bill);
      document.getElementById('calcSize').textContent = sizeKw.toFixed(1);
      document.getElementById('calcSave').textContent = fmt(Math.round(monthlySave));
      document.getElementById('calcLife').textContent = lifeSaveLakh >= 100
        ? (lifeSaveLakh / 100).toFixed(2) + ' Cr' : lifeSaveLakh.toFixed(1);
      document.getElementById('calcPay').textContent = paybackYrs.toFixed(1);
    };
    calcBill.addEventListener('input', update);
    update();
  }

  /* ---------- Dashboard delete-row demo ---------- */
  document.querySelectorAll('.mini-btn.del').forEach(b =>
    b.addEventListener('click', () => {
      const row = b.closest('tr');
      if (window.gsap) gsap.to(row, { opacity: 0, x: 40, duration: .4, onComplete: () => row.remove() });
      else row.remove();
    }));

});