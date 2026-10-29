/* Páginas de caminho (Pacientes / Médicos e Clínicas):
   a pessoa escolhe uma situação e só então o bloco daquela situação aparece. */
(function () {
  'use strict';
  const opts = Array.from(document.querySelectorAll('.chooser__opt'));
  const troncos = Array.from(document.querySelectorAll('.tronco'));
  if (!opts.length || !troncos.length) return;

  function show(id, scroll) {
    troncos.forEach(function (t) {
      const on = t.id === id;
      t.hidden = !on;
      if (on) t.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
    });
    opts.forEach(function (o) {
      const on = o.dataset.tronco === id;
      o.classList.toggle('is-active', on);
      o.setAttribute('aria-selected', String(on));
    });
    if (scroll) {
      const target = document.getElementById(id);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  opts.forEach(function (o) {
    o.addEventListener('click', function () {
      show(o.dataset.tronco, true);
      if (history.replaceState) history.replaceState(null, '', '#' + o.dataset.tronco);
    });
  });

  document.querySelectorAll('[data-voltar]').forEach(function (b) {
    b.addEventListener('click', function () {
      troncos.forEach(function (t) { t.hidden = true; });
      opts.forEach(function (o) { o.classList.remove('is-active'); o.setAttribute('aria-selected', 'false'); });
      if (history.replaceState) history.replaceState(null, '', location.pathname);
      document.querySelector('.chooser').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  // Chegou por link direto (#plano-de-saude): abre esse tronco já.
  const hash = location.hash.replace('#', '');
  if (hash && troncos.some(function (t) { return t.id === hash; })) show(hash, true);
})();
