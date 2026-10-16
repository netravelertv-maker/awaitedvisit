(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Contact settings: fill these in when ready, then the icons become links. */
  var SETTINGS = {
    instagram: '', // e.g. 'https://www.instagram.com/yourpage/'
    facebook: ''   // e.g. 'https://www.facebook.com/yourpage/'
  };
  var anySocial = false;
  [['social-ig', SETTINGS.instagram, 'Instagram'], ['social-fb', SETTINGS.facebook, 'Facebook']].forEach(function (s) {
    var el = document.getElementById(s[0]);
    if (!el) return;
    if (s[1]) {
      el.href = s[1]; el.target = '_blank'; el.rel = 'noopener';
      el.setAttribute('aria-label', s[2]);
      anySocial = true;
    } else {
      el.style.display = 'none'; /* hidden until a link is added */
    }
  });
  var socialBox = document.querySelector('.social');
  if (socialBox && !anySocial) socialBox.style.display = 'none';

  /* Mobile menu */
  var btn = document.getElementById('menu-btn');
  var nav = document.getElementById('nav');
  btn.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      nav.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });

  /* Reveal on scroll */
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* Active nav link */
  var links = {};
  nav.querySelectorAll('a[href^="#"]').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
  var sections = ['how', 'inns', 'attractions', 'destinations', 'about', 'contact']
    .map(function (id) { return document.getElementById(id); });

  /* Scroll effects */
  var header = document.querySelector('.topbar');
  var bar = document.getElementById('progress-bar');
  var compass = document.getElementById('promise-compass');
  var para = Array.prototype.slice.call(document.querySelectorAll('.parallax'));
  var ticking = false;

  function onScroll() {
    var y = window.scrollY;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle('is-scrolled', y > 10);
    bar.style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')';

    var vh = window.innerHeight;
    if (!reduce) {
      para.forEach(function (img) {
        var r = img.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        var speed = parseFloat(img.dataset.speed || '0.12');
        var offset = (r.top + r.height / 2 - vh / 2) * -speed;
        var lim = r.height * 0.18;
        offset = Math.max(-lim, Math.min(lim, offset));
        img.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0)';
      });
      if (compass) {
        var cr = compass.getBoundingClientRect();
        if (cr.bottom > 0 && cr.top < vh) {
          var deg = (cr.top - vh / 2) * 0.35;
          compass.style.transform = 'rotate(' + deg.toFixed(1) + 'deg)';
        }
      }
    }

    var current = null;
    sections.forEach(function (s) {
      if (s && s.getBoundingClientRect().top <= vh * 0.35) current = s.id;
    });
    Object.keys(links).forEach(function (k) { links[k].classList.toggle('is-active', k === current); });
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* Demo rail buttons */
  var rail = document.getElementById('rail');
  document.querySelectorAll('.rail-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      var card = rail.querySelector('.demo-card');
      var step = card ? card.getBoundingClientRect().width + 24 : 280;
      rail.scrollBy({ left: step * parseInt(b.dataset.dir, 10), behavior: reduce ? 'auto' : 'smooth' });
    });
  });
})();
