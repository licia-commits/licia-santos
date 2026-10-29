/* Medição do site: Google Tag Manager e Pixel do Meta.
   Preencha os dois códigos abaixo quando as contas estiverem criadas.
   Enquanto estiverem vazios, nada é carregado e nenhum dado é enviado.
   - GTM:  "GTM-XXXXXXX"  (Google Tag Manager → Administrador → ID do contêiner)
   - Meta: "123456789012345" (Gerenciador de Eventos → Pixel → ID)
   As ferramentas do site já disparam eventos em window.dataLayer (calc_ir, mapa_direitos, lp_checklist…),
   que o GTM pode transformar em conversões para Google Ads e Meta Ads. */
(function () {
  var GTM_ID = '';
  var META_PIXEL_ID = '';

  window.dataLayer = window.dataLayer || [];

  if (GTM_ID) {
    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtm.js?id=' + GTM_ID;
    document.head.appendChild(s);
  }

  if (META_PIXEL_ID) {
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', META_PIXEL_ID);
    window.fbq('track', 'PageView');
    // Clique em qualquer botão de WhatsApp vira o evento "Contact" no Meta.
    document.addEventListener('click', function (ev) {
      var a = ev.target.closest && ev.target.closest('a[href*="wa.me"]');
      if (a) window.fbq('track', 'Contact', { content_name: document.title });
    });
  }
})();
