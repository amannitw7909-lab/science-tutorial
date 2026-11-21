(function () {
  'use strict';
  // Forward to SPA view
  var slug = window.location.pathname.split('/').slice(-2, -1)[0] || '';
  if (slug) {
    window.location.replace('../../../index.html#/df-' + slug.replace(/^\d{2}-/, ''));
  }
})();
