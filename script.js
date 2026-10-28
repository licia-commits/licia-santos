/* =========================================================================
   Lícia Santos Advocacia — interações
   Movimento generoso, suave e orquestrado (estilo Apple). Respeita reduced-motion.
   ========================================================================= */
(function () {
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Os links de áreas de atuação permanecem como links textuais, sem ícone. */
  document.querySelectorAll('.card__link.btn--whatsapp').forEach(function (link) {
    link.classList.remove('btn--whatsapp');
    const icon = link.querySelector('.whatsapp-icon');
    if (icon) icon.remove();
  });

  /* ---------- Ícone de WhatsApp fornecido para os CTAs ---------- */
  document.querySelectorAll('svg.whatsapp-icon').forEach(function (icon) {
    const image = document.createElement('img');
    image.className = 'whatsapp-icon';
    image.src = 'assets/Property 1=Bold.svg';
    image.alt = '';
    image.setAttribute('aria-hidden', 'true');
    icon.replaceWith(image);
  });

  /* ---------- NAV: transparente sobre a Hero; vidro após rolar ---------- */
  const nav = document.getElementById('nav');
  const navScrollOffset = 24;
  let navTicking = false;
  const themeColor = document.querySelector('meta[name="theme-color"]');
  function updateNav() {
    const scrolled = window.scrollY > navScrollOffset;
    nav.classList.toggle('glass', scrolled);
    if (themeColor) themeColor.content = scrolled ? '#FBFAF7' : '#14161A';
    navTicking = false;
  }
  updateNav();
  window.addEventListener('scroll', function () {
    if (!navTicking) { requestAnimationFrame(updateNav); navTicking = true; }
  }, { passive: true });

  /* ---------- Texto com rolagem no hover ---------- */
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.nav__links a, .btn:not(.btn--whatsapp), .card__link:not(.btn--whatsapp), .info-block a.v').forEach(function (el) {
      if (el.children.length || el.querySelector('.roll')) return;
      const label = el.textContent.trim();
      if (!label) return;
      el.classList.add('has-roll');
      el.innerHTML = '<span class="roll"><span>' + label + '</span><span aria-hidden="true">' + label + '</span></span>';
    });

    // Nos CTAs de WhatsApp, apenas o rótulo faz a rolagem; o ícone permanece estável.
    document.querySelectorAll('.btn--whatsapp').forEach(function (el) {
      if (el.querySelector('.whatsapp-roll')) return;
      const textNodes = Array.from(el.childNodes).filter(function (node) {
        return node.nodeType === Node.TEXT_NODE && node.textContent.trim();
      });
      const label = textNodes.map(function (node) { return node.textContent.trim(); }).join(' ');
      if (!label) return;
      textNodes.forEach(function (node) { node.remove(); });
      const roll = document.createElement('span');
      roll.className = 'whatsapp-roll';
      roll.innerHTML = '<span>' + label + '</span><span aria-hidden="true">' + label + '</span>';
      const icon = el.querySelector('.whatsapp-icon');
      el.insertBefore(roll, icon || null);
    });
  }

  /* ---------- Menu mobile ---------- */
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');
  function closeMenu() {
    document.body.classList.remove('menu-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Abrir menu');
    document.body.style.overflow = '';
  }
  burger.addEventListener('click', function () {
    const open = document.body.classList.toggle('menu-open');
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    document.body.style.overflow = open ? 'hidden' : '';
  });
  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape' && document.body.classList.contains('menu-open')) { closeMenu(); burger.focus(); }
  });
  navLinks.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });

  /* ---------- Reveal on scroll (fade + blur) ---------- */
  // Somente elementos marcados no HTML participam da coreografia.
  const reveals = document.querySelectorAll('.reveal, .reveal-img');
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: '-8% 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
    // Garante que o conteúdo já visível no carregamento entre suavemente.
    requestAnimationFrame(function () {
      const vh = window.innerHeight;
      reveals.forEach(function (el) {
        if (el.classList.contains('in')) return;
        const r = el.getBoundingClientRect();
        if (r.top < vh * 0.92 && r.bottom > 0) { el.classList.add('in'); }
      });
    });
  }

  /* ---------- Marquee: deslocamento vinculado ao scroll ---------- */
  const track = document.getElementById('marquee');
  if (track) {
    track.innerHTML += track.innerHTML;
    const updateMarquee = function () {
      if (reduce) return;
      const loopWidth = track.scrollWidth / 2;
      if (!loopWidth) return;
      const offset = (window.scrollY * 0.28) % loopWidth;
      track.style.transform = 'translate3d(-' + offset.toFixed(2) + 'px, 0, 0)';
    };
    window.addEventListener('scroll', updateMarquee, { passive: true });
    updateMarquee();
  }

  /* ---------- Parallax suave nas imagens de capa ---------- */
  const parallaxEls = document.querySelectorAll('[data-parallax] img');
  const scrollScaleEls = document.querySelectorAll('[data-scroll-scale] img');
  if (!reduce && (parallaxEls.length || scrollScaleEls.length)) {
    let pTicking = false;
    function parallax() {
      const vh = window.innerHeight;
      parallaxEls.forEach(function (img) {
        if (img.closest('.hero')) {
          // Deslocamento curto para cima: cria profundidade sem comprometer a leitura.
          const movement = Math.min(window.scrollY * 0.12, 64);
          img.style.transform = 'translateY(-' + movement.toFixed(2) + 'px)';
          return;
        }
        const r = img.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        const prog = (r.top + r.height / 2 - vh / 2) / vh; // -0.5..0.5
        img.style.transform = 'translateY(' + (prog * -26).toFixed(2) + 'px)';
      });
      scrollScaleEls.forEach(function (img) {
        const r = img.getBoundingClientRect();
        const progress = Math.min(Math.max((vh - r.top) / (vh + r.height), 0), 1);
        img.style.transform = 'scale(' + (1 + progress * 0.18).toFixed(3) + ')';
      });
      pTicking = false;
    }
    window.addEventListener('scroll', function () {
      if (!pTicking) { window.requestAnimationFrame(parallax); pTicking = true; }
    }, { passive: true });
    parallax();
  }

  /* ---------- Galeria vertical: movimento simultâneo vinculado ao scroll ---------- */
  const portraitCarousels = document.querySelectorAll('.portrait-carousel');
  if (!reduce && portraitCarousels.length) {
    let galleryTicking = false;
    function updatePortraitCarousels() {
      const vh = window.innerHeight;
      portraitCarousels.forEach(function (carousel) {
        const rect = carousel.getBoundingClientRect();
        // 0 ao entrar no viewport e 1 ao sair: não altera a altura da página nem prende o scroll.
        const progress = Math.min(Math.max((vh - rect.top) / (vh + rect.height), 0), 1);
        const range = Math.min(vh * 0.2, 160);
        carousel.querySelectorAll('.portrait-carousel__column').forEach(function (column, index) {
          const direction = index === 0 ? 1 : -1;
          const y = (progress - 0.5) * range * 2 * direction;
          column.style.setProperty('--gallery-y', y.toFixed(2) + 'px');
        });
      });
      galleryTicking = false;
    }
    window.addEventListener('scroll', function () {
      if (!galleryTicking) {
        window.requestAnimationFrame(updatePortraitCarousels);
        galleryTicking = true;
      }
    }, { passive: true });
    window.addEventListener('resize', updatePortraitCarousels);
    updatePortraitCarousels();
  }

  /* ---------- Processo: etapa e imagem sincronizadas ao scroll ---------- */
  const processSection = document.getElementById('processo');
  const processSteps = Array.from(document.querySelectorAll('[data-process-step]'));
  const processImages = Array.from(document.querySelectorAll('[data-process-media] img'));
  if (processSection && processSteps.length && processImages.length) {
    let activeProcessStep = 0;
    let processTicking = false;
    function setProcessStep(index) {
      if (index === activeProcessStep) return;
      activeProcessStep = index;
      processSteps.forEach(function (step, stepIndex) {
        step.classList.toggle('active', stepIndex === index);
      });
      processImages.forEach(function (image, imageIndex) {
        image.classList.toggle('active', imageIndex === index);
      });
    }
    function updateProcessStep() {
      const sectionRect = processSection.getBoundingClientRect();
      if (sectionRect.bottom < 0 || sectionRect.top > window.innerHeight) {
        processTicking = false;
        return;
      }
      const viewportCenter = window.innerHeight * 0.52;
      let nearestIndex = 0;
      let nearestDistance = Infinity;
      processSteps.forEach(function (step, index) {
        const rect = step.getBoundingClientRect();
        const distance = Math.abs((rect.top + rect.height / 2) - viewportCenter);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });
      setProcessStep(nearestIndex);
      processTicking = false;
    }
    window.addEventListener('scroll', function () {
      if (!processTicking) {
        window.requestAnimationFrame(updateProcessStep);
        processTicking = true;
      }
    }, { passive: true });
    window.addEventListener('resize', updateProcessStep);
    updateProcessStep();
  }

  /* ---------- CTA final: entrada sobreposta, sem retenção de scroll ---------- */
  const finalCta = document.getElementById('contato');
  if (!reduce && finalCta) {
    let ctaTicking = false;
    function updateFinalCta() {
      const rect = finalCta.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      // A transição acontece apenas enquanto a CTA sobe do rodapé até preencher a viewport.
      const progress = Math.min(Math.max((viewportHeight - rect.top) / (viewportHeight * 0.82), 0), 1);
      const maxRadius = window.innerWidth <= 820 ? 56 : 88;
      const radius = maxRadius * (1 - progress);
      finalCta.style.setProperty('--cta-radius', radius.toFixed(2) + 'px');
      ctaTicking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ctaTicking) {
        window.requestAnimationFrame(updateFinalCta);
        ctaTicking = true;
      }
    }, { passive: true });
    window.addEventListener('resize', updateFinalCta);
    updateFinalCta();
  }

  /* ---------- Brilho que segue o cursor nos cards ---------- */
  document.querySelectorAll('[data-tilt]').forEach(function (card) {
    card.addEventListener('pointermove', function (ev) {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((ev.clientX - r.left) / r.width * 100) + '%');
      card.style.setProperty('--my', ((ev.clientY - r.top) / r.height * 100) + '%');
    });
  });

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq__item').forEach(function (item) {
    const q = item.querySelector('.faq__q');
    const a = item.querySelector('.faq__a');
    q.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');
      // fecha os demais
      document.querySelectorAll('.faq__item.open').forEach(function (other) {
        if (other !== item) {
          other.classList.remove('open');
          const otherAnswer = other.querySelector('.faq__a');
          const otherButton = other.querySelector('.faq__q');
          otherAnswer.style.height = '0px';
          otherAnswer.setAttribute('aria-hidden', 'true');
          otherButton.setAttribute('aria-expanded', 'false');
        }
      });
      if (isOpen) {
        item.classList.remove('open');
        a.style.height = '0px';
        a.setAttribute('aria-hidden', 'true');
        q.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('open');
        a.style.height = a.scrollHeight + 'px';
        a.setAttribute('aria-hidden', 'false');
        q.setAttribute('aria-expanded', 'true');
      }
    });
  });
  // recalcula altura do item aberto ao redimensionar
  window.addEventListener('resize', function () {
    const open = document.querySelector('.faq__item.open .faq__a');
    if (open) { open.style.height = open.scrollHeight + 'px'; }
  });
})();
