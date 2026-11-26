/*! ALTIQDESIGN chat widget launcher. Usage:
 *  <script src="https://altiqdesign.com/widget.js" data-widget="your-slug" async></script> */
(function () {
  'use strict';
  var script = document.currentScript || document.querySelector('script[data-widget][src*="widget.js"]');
  if (!script) return;
  var slug = script.getAttribute('data-widget');
  if (!slug || window['__altiqWidget_' + slug]) return;
  window['__altiqWidget_' + slug] = true;

  var origin;
  try { origin = new URL(script.src, location.href).origin; } catch (e) { return; }

  var Z = '2147483647';
  var open = false;
  var color = '#0f172a';
  var btn, frame;

  function mobile() { return window.innerWidth <= 480; }

  function layout() {
    if (!frame) return;
    if (mobile()) {
      frame.style.cssText = base(frame) + 'position:fixed;top:0;left:0;right:0;bottom:0;width:100%;height:100%;border-radius:0;';
    } else {
      frame.style.cssText = base(frame) + 'position:fixed;right:20px;bottom:92px;width:380px;max-width:calc(100vw - 40px);height:600px;max-height:calc(100vh - 112px);border-radius:16px;box-shadow:0 12px 40px rgba(15,23,42,0.28);';
    }
    frame.style.display = open ? 'block' : 'none';
  }

  // Inline, isolated styles: the host page's CSS never reaches these elements
  function base() {
    return 'all:initial;box-sizing:border-box;border:0;margin:0;padding:0;background:#fff;color-scheme:light;z-index:' + Z + ';';
  }

  var CHAT_ICON = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
  var CLOSE_ICON = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';

  function textOn(hex) {
    var n = parseInt(hex.slice(1), 16);
    var ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(function (v) {
      var c = v / 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2] > 0.45 ? '#0f172a' : '#ffffff';
  }

  function paintButton() {
    btn.style.cssText = 'all:initial;box-sizing:border-box;position:fixed;right:20px;bottom:20px;width:60px;height:60px;border-radius:50%;border:0;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 20px rgba(15,23,42,0.3);z-index:' + Z + ';background:' + color + ';color:' + textOn(color) + ';transition:transform .15s ease;';
    btn.innerHTML = open ? CLOSE_ICON : CHAT_ICON;
    btn.setAttribute('aria-label', open ? 'Close chat' : 'Open chat');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function toggle() {
    open = !open;
    if (open && !frame) {
      frame = document.createElement('iframe');
      frame.src = origin + '/embed/' + encodeURIComponent(slug); // loaded lazily on first open
      frame.title = 'Chat';
      frame.setAttribute('allow', 'clipboard-write');
      document.body.appendChild(frame);
    }
    layout();
    paintButton();
  }

  function mount() {
    btn = document.createElement('button');
    btn.type = 'button';
    btn.addEventListener('click', toggle);
    document.body.appendChild(btn);
    paintButton();
    window.addEventListener('resize', layout);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && open) toggle(); });
  }

  // Fetch brand colour first; show nothing at all if the widget is inactive/unknown
  fetch(origin + '/api/widget/' + encodeURIComponent(slug) + '/config')
    .then(function (r) { return r.json(); })
    .then(function (c) {
      if (!c || !c.active) return;
      if (/^#[0-9a-fA-F]{6}$/.test(c.color || '')) color = c.color;
      if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
    })
    .catch(function () { /* fail silently on the host site */ });
})();
