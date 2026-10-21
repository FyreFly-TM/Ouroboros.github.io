(() => {
  'use strict';
  const {pages, esc} = window.OURO_DOCS;
  const api = window.OURO_API;
  const $ = id => document.getElementById(id);
  const groups = [...new Set(pages.map(p => p.group))];
  let currentPage = null;
  let observer;
  let resultIndex = -1;
  let toastTimer;
  const store = {
    get(key, fallback) { try { const v = localStorage.getItem(key); return v === null ? fallback : JSON.parse(v); } catch { return fallback; } },
    set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }
  };
  const plain = html => { const node = document.createElement('div'); node.innerHTML = html; return node.textContent.replace(/\s+/g,' ').trim(); };
  const entries = pages.map(p => ({title:p.title, group:p.group, route:p.id, text:plain(p.description+' '+p.sections.join(' '))}));
  pages.forEach(p => p.sections.forEach(s => {
    const m = /<h2 id="([^"]+)">([^<]+)/.exec(s);
    if (m) entries.push({title:m[2], group:`${p.title}`, route:`${p.id}/${m[1]}`, text:plain(s)});
  }));
  api.forEach(a => entries.push({title:a.name, group:a.family, route:`api/${a.name}`, text:`${a.signature} ${a.description} ${a.returns} ${a.status}`}));

  // ------------------------------------------------------------ navigation
  const label = p => p.id === 'overview' ? 'Introduction' : (p.nav || p.title);
  const navText = new Map(pages.map(p => [p.id, `${label(p)} ${p.title} ${p.description} ${p.sections.map(s => (/<h2 id="[^"]+">([^<]+)/.exec(s) || [])[1] || '').join(' ')}`.toLowerCase()]));
  let openGroups = store.get('ouro-docs-open', null);
  function renderNav(filter = '') {
    const q = filter.toLowerCase().trim();
    const html = groups.map(group => {
      const list = pages.filter(p => p.group === group && (!q || navText.get(p.id).includes(q)));
      if (!list.length) return '';
      const open = q || !openGroups || openGroups.includes(group) || list.some(p => p.id === currentPage);
      const links = list.map(p => {
        let text = esc(label(p));
        if (q) { const i = text.toLowerCase().indexOf(q); if (i >= 0) text = text.slice(0, i) + '<mark>' + text.slice(i, i + q.length) + '</mark>' + text.slice(i + q.length); }
        return `<a class="nav-link" href="#${p.id}" data-page="${p.id}">${text}</a>`;
      }).join('');
      return `<details class="nav-group" data-group="${esc(group)}"${open ? ' open' : ''}><summary>${esc(group)}<span class="nav-count">${list.length}</span></summary><div class="nav-group-links">${links}</div></details>`;
    }).join('');
    $('navigation').innerHTML = html || '<div class="nav-empty">No pages match. Try the search (Ctrl K).</div>';
    markActive();
  }
  function saveOpen() {
    if ($('nav-filter').value) return;
    openGroups = [...$('navigation').querySelectorAll('details.nav-group')].filter(d => d.open).map(d => d.dataset.group);
    store.set('ouro-docs-open', openGroups);
  }
  function markActive() {
    $('navigation').querySelectorAll('a').forEach(a => {
      const active = a.dataset.page === currentPage;
      a.classList.toggle('active', active);
      if (active) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    $('navigation').querySelectorAll('details.nav-group').forEach(d => {
      const has = !!d.querySelector('a.active');
      d.classList.toggle('has-active', has);
      if (has) d.open = true;
    });
  }
  $('navigation').addEventListener('toggle', saveOpen, true);
  $('nav-filter').addEventListener('input', e => renderNav(e.target.value));
  $('nav-filter').addEventListener('keydown', e => {
    if (e.key === 'Enter') { const first = $('navigation').querySelector('a'); if (first) { location.hash = first.getAttribute('href'); e.target.blur(); } }
    if (e.key === 'Escape') { e.target.value = ''; renderNav(); e.target.blur(); }
  });
  $('nav-expand').addEventListener('click', () => { $('navigation').querySelectorAll('details').forEach(d => d.open = true); saveOpen(); });
  $('nav-collapse').addEventListener('click', () => { $('navigation').querySelectorAll('details').forEach(d => d.open = d.classList.contains('has-active')); saveOpen(); });

  // ------------------------------------------------------------ chrome
  function toast(message) { $('toast').textContent = message; $('toast').classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => $('toast').classList.remove('visible'), 1800); }
  function setTheme(theme) { document.documentElement.dataset.theme = theme; $('theme-toggle').textContent = theme === 'dark' ? '☼' : '☾'; $('theme-toggle').setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`); store.set('ouro-docs-theme', theme); }
  setTheme(store.get('ouro-docs-theme', 'dark') === 'light' ? 'light' : 'dark');
  $('theme-toggle').addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
  function closeMenu() { $('sidebar').classList.remove('open'); $('menu-toggle').setAttribute('aria-expanded', 'false'); }
  $('menu-toggle').addEventListener('click', () => { const open = $('sidebar').classList.toggle('open'); $('menu-toggle').setAttribute('aria-expanded', String(open)); });
  $('navigation').addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
  window.addEventListener('scroll', () => $('to-top').classList.toggle('visible', window.scrollY > 600), {passive: true});
  $('to-top').addEventListener('click', () => window.scrollTo({top: 0, behavior: 'smooth'}));

  function highlight(node) {
    if (node.dataset.language !== 'ouro') return;
    const source = node.textContent;
    const pattern = /\/\/[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:mut|let|fn|void|return|if|elseif|elif|else|end|while|for|to|by|in|each|where|entity|record|struct|enum|trait|impl|node|on|use|include|export|break|continue|with|then|as|and|or|true|false|switch|case)\b|\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(?:i8|i16|i32|i64|u8|u16|u32|u64|f16|f32|f64|f128|f)?\b|\b[A-Za-z_][A-Za-z_0-9]*(?=\()/g;
    let result = '', last = 0;
    for (const m of source.matchAll(pattern)) { const token = m[0]; let kind = token.startsWith('//') ? 'comment' : /^["']/.test(token) ? 'string' : /^\d/.test(token) ? 'number' : /\(/.test(source.slice(m.index + token.length, m.index + token.length + 1)) ? 'call' : 'keyword'; result += esc(source.slice(last, m.index)) + `<span class="tok-${kind}">${esc(token)}</span>`; last = m.index + token.length; }
    node.innerHTML = result + esc(source.slice(last));
  }
  function renderApi(query = '') {
    const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    const filtered = api.filter(a => terms.every(t => `${a.name} ${a.signature} ${a.family} ${a.description} ${a.status}`.toLowerCase().includes(t)));
    $('api-count').textContent = `${filtered.length} of ${api.length} documented entries · aliases included`;
    $('api-list').innerHTML = filtered.map(a => `<section class="api-entry" id="api-${a.name}"><h3>${esc(a.signature)}</h3><div class="api-meta">${esc(a.family)}${a.returns ? ' · ' + esc(a.returns) : ''}${a.status ? ' · ' + esc(a.status) : ''}</div><p>${esc(a.description)}</p><a href="#${a.guide}" class="api-meta">Read the ${esc(a.family.toLowerCase())} guide →</a></section>`).join('') || '<p>No matching entries. Try a builtin name or API family.</p>';
  }

  // ------------------------------------------------------------ pages
  function render() {
    const raw = location.hash.slice(1) || 'overview';
    const [pageId, ...anchorParts] = raw.split('/');
    const anchor = anchorParts.join('/');
    const page = pages.find(p => p.id === pageId);
    if (!page) { location.replace('#overview'); return; }
    const changed = currentPage !== page.id;
    if (changed) {
      currentPage = page.id;
      document.title = `${label(page)} — Ouroboros documentation`;
      $('breadcrumb').innerHTML = `<span>Documentation</span><span>›</span><span>${esc(page.group)}</span><span>›</span><span>${esc(label(page))}</span>`;
      const words = plain(page.sections.join(' ')).split(' ').length;
      const header = page.hero
        ? `<div class="hero"><img class="hero-logo" src="logo-320.png" alt="" width="190" height="201"><p class="eyebrow">EXPRESSIVE BY DEFAULT. EXPLICIT WHEN IT MATTERS.</p><h1>${esc(page.title)}</h1><p class="lead">${esc(page.description)}</p><div class="badge-row"><span class="badge accent">Native compilation</span><span class="badge">Arrows &amp; nodes</span><span class="badge">Gradual types</span><span class="badge">Systems control</span></div><div class="button-row"><a class="button" href="#quickstart">Get started <span>→</span></a><a class="button secondary" href="#decisions">Which form should I use? <span>↗</span></a><a class="button secondary" href="#feature-index">Every feature, A–Z <span>↗</span></a></div></div>`
        : `<p class="eyebrow">${esc(page.group)}</p><h1>${esc(page.title)}</h1><p class="lead">${esc(page.description)}</p><p class="reading-meta">${Math.max(2, Math.ceil(words / 180))} min read · Current development checkout</p>`;
      $('article').innerHTML = header + '<details class="mini-toc"><summary>On this page</summary><nav id="mini-toc"></nav></details>' + page.sections.join('');
      $('article').querySelectorAll('pre code').forEach(highlight);
      $('article').querySelectorAll('h1,h2,h3,h4').forEach(heading => { heading.tabIndex = -1; heading.style.scrollMarginTop = '100px'; });
      $('article').querySelectorAll('h2 .section-link').forEach(a => { a.href = `#${page.id}/${a.parentElement.id}`; });
      const headings = [...$('article').querySelectorAll('h2[id]')];
      const tocLinks = headings.map(h => `<a href="#${page.id}/${h.id}" data-section="${h.id}">${esc(h.childNodes[0].textContent)}</a>`).join('');
      $('toc').innerHTML = tocLinks;
      $('mini-toc').innerHTML = tocLinks;
      if (headings.length < 2) $('article').querySelector('.mini-toc').remove();
      if (observer) observer.disconnect();
      observer = new IntersectionObserver(items => { const visible = items.filter(i => i.isIntersecting); if (visible.length) { $('toc').querySelectorAll('a').forEach(a => a.classList.toggle('current', a.dataset.section === visible[0].target.id)); } }, {rootMargin: '-80px 0px -65% 0px'});
      headings.forEach(h => observer.observe(h));
      markActive();
      const index = pages.indexOf(page), prev = pages[index - 1], next = pages[index + 1];
      $('page-navigation').innerHTML = (prev ? `<a href="#${prev.id}" data-rel="prev"><small>PREVIOUS · ${esc(prev.group)}</small>← ${esc(label(prev))}</a>` : '<span></span>') + (next ? `<a href="#${next.id}" data-rel="next"><small>NEXT · ${esc(next.group)}</small>${esc(label(next))} →</a>` : '');
      if (page.id === 'api') { renderApi(); $('api-filter').addEventListener('input', e => renderApi(e.target.value)); }
      closeMenu();
      if (!anchor) window.scrollTo({top: 0, behavior: 'instant'});
    }
    if (anchor) {
      if (page.id === 'api' && !document.getElementById('api-' + anchor)) { $('api-filter').value = ''; renderApi(); }
      const target = document.getElementById(page.id === 'api' && api.some(a => a.name === anchor) ? 'api-' + anchor : anchor);
      if (target) requestAnimationFrame(() => { target.scrollIntoView({block: 'start'}); if (target.matches('h1,h2,h3,h4')) target.focus({preventScroll: true}); });
    }
  }
  $('article').addEventListener('click', async event => {
    const button = event.target.closest('.copy-button'); if (!button) return;
    const text = button.closest('.codeblock').querySelector('code').textContent;
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(text);
      else { const area = document.createElement('textarea'); area.value = text; area.style.position = 'fixed'; area.style.opacity = '0'; document.body.append(area); area.select(); const copied = document.execCommand('copy'); area.remove(); if (!copied) throw Error('clipboard'); }
      toast('Code copied'); button.textContent = 'Copied!'; setTimeout(() => button.textContent = 'Copy code', 1500);
    } catch { toast('Clipboard unavailable. Select and copy the code manually.'); }
  });

  // ------------------------------------------------------------ search
  function selectResult(index) { const links = [...$('search-results').querySelectorAll('a')]; if (!links.length) return; resultIndex = (index + links.length) % links.length; links.forEach((a, i) => a.classList.toggle('selected', i === resultIndex)); links[resultIndex].scrollIntoView({block: 'nearest'}); }
  function search() {
    const query = $('search-input').value.toLowerCase().trim();
    const terms = query.split(/\s+/).filter(Boolean);
    const ranked = entries.map(e => { const title = e.title.toLowerCase(), body = e.text.toLowerCase(), group = e.group.toLowerCase(); const matched = terms.every(t => title.includes(t) || body.includes(t) || group.includes(t)); const score = terms.reduce((n, t) => n + (title === t ? 100 : title.startsWith(t) ? 30 : title.includes(t) ? 15 : group.includes(t) ? 5 : 1), 0); return {...e, matched, score}; }).filter(e => e.matched).sort((a, b) => b.score - a.score).slice(0, 30);
    $('search-results').innerHTML = ranked.map(e => { let at = query ? e.text.toLowerCase().indexOf(terms[0]) : -1; let text = e.text.slice(Math.max(0, at - 35), Math.max(0, at - 35) + 145); return `<a class="search-result" href="#${e.route}"><strong>${esc(e.title)}</strong><small>${esc(e.group)} · ${esc(text)}${e.text.length > 145 ? '…' : ''}</small></a>`; }).join('') || '<div class="search-empty">No results. Try a shorter term or a builtin name.</div>';
    resultIndex = -1; if (ranked.length) selectResult(0);
  }
  function openSearch() { search(); $('search-dialog').showModal(); $('search-input').focus(); }
  $('search-open').addEventListener('click', openSearch);
  $('search-close').addEventListener('click', () => $('search-dialog').close());
  $('search-input').addEventListener('input', search);
  $('search-results').addEventListener('click', e => { if (e.target.closest('a')) $('search-dialog').close(); });
  $('search-dialog').addEventListener('click', e => { if (e.target === $('search-dialog')) { const r = e.target.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) e.target.close(); } });
  $('search-input').addEventListener('keydown', e => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); selectResult(resultIndex + (e.key === 'ArrowDown' ? 1 : -1)); } if (e.key === 'Enter') { const result = $('search-results').querySelectorAll('a')[Math.max(0, resultIndex)]; if (result) { e.preventDefault(); result.click(); } } });
  document.addEventListener('keydown', e => {
    const typing = /^(INPUT|TEXTAREA)$/.test(document.activeElement?.tagName || '') || $('search-dialog').open;
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); if (!$('search-dialog').open) openSearch(); return; }
    if (e.key === 'Escape') closeMenu();
    if (typing || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === '/') { e.preventDefault(); $('sidebar').classList.add('open'); $('nav-filter').focus(); }
    if (e.key === '[' || e.key === ']') { const link = $('page-navigation').querySelector(`a[data-rel="${e.key === '[' ? 'prev' : 'next'}"]`); if (link) location.hash = link.getAttribute('href'); }
  });
  window.addEventListener('hashchange', render);
  renderNav();
  render();
})();
