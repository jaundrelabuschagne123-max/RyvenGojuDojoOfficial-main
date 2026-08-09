/* ==========================================================================
   RYVEN GOJU DOJO — SITE BEHAVIOUR
   Small, dependency-free modules. Each does one job so future features
   (new pages, new widgets) can hook in without touching the others.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initActiveNavLink();
  initHeaderShrink();
  initScrollReveal();
  initImageFallback();
});

/* ---- Mobile nav: hamburger toggle ----
   Controls the standalone .nav-row strip (see header-shell.md), not the
   brand row, so it can never overlap the logo/title. ---- */
function initMobileNav(){
  const toggle = document.querySelector('.nav-toggle');
  const navRow = document.querySelector('.nav-row');
  if(!toggle || !navRow) return;

  const close = () => {
    navRow.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const open = navRow.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  navRow.querySelectorAll('a').forEach(link => link.addEventListener('click', close));

  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') close();
  });

  window.addEventListener('resize', () => {
    if(window.innerWidth > 760) close();
  });
}

/* ---- Highlight the nav link matching the current page ---- */
function initActiveNavLink(){
  const links = document.querySelectorAll('.site-nav a');
  const current = (location.pathname.split('/').pop() || 'Goju-Ryu Karate.html');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if(!href) return;
    const target = href.split('#')[0];
    const isHome = (target === 'Goju-Ryu Karate.html' || target === '') &&
                   (current === 'Goju-Ryu Karate.html' || current === '' || current === 'index.html');
    if(target === current || isHome){
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

/* ---- Condense the header after a small scroll ---- */
function initHeaderShrink(){
  const header = document.querySelector('.site-header');
  if(!header) return;
  const onScroll = () => header.classList.toggle('is-condensed', window.scrollY > 30);
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();
}

/* ---- Fade/slide sections in as they enter the viewport ---- */
function initScrollReveal(){
  const targets = document.querySelectorAll('.reveal');
  if(!targets.length) return;

  if(!('IntersectionObserver' in window)){
    targets.forEach(t => t.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold:0.12, rootMargin:'0px 0px -40px 0px' });

  targets.forEach(t => observer.observe(t));

  // Safety net: if something above ever fails to reveal a section
  // (a stale observer, a mistimed layout), don't leave it invisible.
  window.setTimeout(() => {
    targets.forEach(t => t.classList.add('in-view'));
  }, 4000);
}

/* ---- Graceful placeholder for any photo that fails to load ----
   Keeps a missing/renamed image file from showing the browser's broken
   icon + alt text — shows a soft branded placeholder instead. ---- */
function initImageFallback(){
  const markFailed = (img) => {
    img.classList.add('img-missing');
    const wrap = img.closest('.tile-media, .media-frame, .instr-avatar, .timeline-media, .affiliate-media');
    if(wrap) wrap.classList.add('media-fallback');
  };
  document.querySelectorAll('img').forEach(img => {
    // A same-page image can fail before this script runs — catch that too.
    if(img.complete && img.naturalWidth === 0){
      markFailed(img);
    } else {
      img.addEventListener('error', () => markFailed(img), { once:true });
    }
  });
}
