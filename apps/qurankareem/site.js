(() => {
  const supported = [
    ['en','English'],['ar','العربية'],['ur','اردو'],['tr','Türkçe'],['fr','Français'],['es','Español'],
    ['hi','हिन्दी'],['id','Bahasa Indonesia'],['fa','فارسی'],['fil','Filipino'],['it','Italiano'],['de','Deutsch'],['nl','Nederlands'],
  ];
  const rtl = new Set(['ar','ur','fa']);
  const pathname = location.pathname;
  const page = pathname.includes('/terms/') ? 'terms' : pathname.includes('/privacy/') ? 'privacy' : pathname.includes('/delete-account/') ? 'deletion' : pathname.includes('/about/') ? 'about' : pathname.includes('/ai-guide/') ? 'aiGuide' : 'home';
  const root = page === 'home' ? './' : '../';
  const hrefs = { home: root, privacy: root + 'privacy/', deletion: root + 'delete-account/', about: root + 'about/', aiGuide: root + 'ai-guide/', terms: root + 'terms/' };
  const guideNavLabels = { en: 'AI key guide', ar: 'دليل ربط مفتاح الذكاء الاصطناعي', ur: 'AI کلید رہنما', tr: 'AI anahtar rehberi', fr: 'Guide de clé IA', es: 'Guía de clave IA', hi: 'AI कुंजी गाइड', id: 'Panduan kunci AI', fa: 'راهنمای کلید هوش مصنوعی', fil: 'Gabay sa AI key', it: 'Guida chiave IA', de: 'KI-Schlüsselhilfe', nl: 'AI-sleutelgids' };
  const queryLanguage = new URLSearchParams(location.search).get('lang');
  let storedLanguage = '';
  try { storedLanguage = localStorage.getItem('qk-site-language') || ''; } catch {}
  const browserLanguage = (navigator.language || 'en').toLowerCase().split('-')[0];
  let language = supported.some(([code]) => code === queryLanguage) ? queryLanguage
    : supported.some(([code]) => code === storedLanguage) ? storedLanguage
    : supported.some(([code]) => code === browserLanguage) ? browserLanguage : 'en';

  const esc = (text) => String(text ?? '').replace(/[&<>"']/g, (ch) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const link = (key, label, current = false) => `<a href="${hrefs[key]}?lang=${encodeURIComponent(language)}"${current ? ' aria-current="page"' : ''}>${esc(label)}</a>`;
  const paragraph = (text) => `<p>${esc(text)}</p>`;
  const section = (title, body) => `<section class="panel"><h2>${esc(title)}</h2>${body}</section>`;
  const sourceLink = (href, label) => `<a class="text-link" href="${href}" target="_blank" rel="noopener noreferrer">${esc(label)}</a>`;

  function render(t) {
    const legal = window.qkLegalTranslations[language] || window.qkLegalTranslations.en;
    document.documentElement.lang = language;
    document.documentElement.dir = rtl.has(language) ? 'rtl' : 'ltr';
    const guide = window.qkAiGuideTranslations?.[language] || window.qkAiGuideTranslations?.en;
    const pageTitle = ({home:t.homeTitle,privacy:t.privacyTitle,deletion:t.deletionTitle,about:t.aboutTitle,aiGuide:guide?.title,terms:legal.termsTitle})[page];
    document.title = `${t.app} — ${pageTitle || t.app}`;
    const select = `<label class="language"><span>${esc(t.language)}</span><select id="language" aria-label="${esc(t.language)}">${supported.map(([code,name]) => `<option value="${code}"${code === language ? ' selected' : ''}>${esc(name)}</option>`).join('')}</select></label>`;
    const nav = `<nav class="nav" aria-label="${esc(t.app)}">${link('home',t.home,page==='home')}${link('privacy',t.privacy,page==='privacy')}${link('deletion',t.deletion,page==='deletion')}${link('about',t.about,page==='about')}${link('aiGuide',guideNavLabels[language] || guideNavLabels.en,page==='aiGuide')}</nav>`;
    let content = '';
    if (page === 'terms') {
      content = `<header class="hero"><h1>${esc(legal.termsTitle)}</h1><p class="notice">${esc(t.translationNote)}</p></header><article class="panel">${legal.termsText.map(paragraph).join('')}<p>${sourceLink('https://www.apple.com/legal/internet-services/itunes/dev/stdeula/', 'Apple — Standard EULA')}</p><p>${link('privacy', t.privacy)}</p></article>`;
    } else if (page === 'home') {
      content = `<header class="hero"><h1>${esc(t.homeTitle)}</h1>${paragraph(t.homeIntro)}<p class="notice">${esc(t.translationNote)}</p></header><div class="cards"><a class="card" href="${hrefs.privacy}?lang=${language}"><h2>${esc(t.homePrivacyTitle)}</h2><p>${esc(t.homePrivacyText)}</p></a><a class="card" href="${hrefs.deletion}?lang=${language}"><h2>${esc(t.homeDeleteTitle)}</h2><p>${esc(t.homeDeleteText)}</p></a><a class="card" href="${hrefs.about}?lang=${language}"><h2>${esc(t.homeAboutTitle)}</h2><p>${esc(t.homeAboutText)}</p></a><a class="card" href="${hrefs.aiGuide}?lang=${language}"><h2>${esc(guide?.title || guideNavLabels.en)}</h2><p>${esc(guide?.intro || '')}</p></a></div>`;
    } else if (page === 'privacy') {
      content = `<header class="hero"><h1>${esc(t.privacyTitle)}</h1><p class="meta">${esc(t.effectiveDate)}</p>${paragraph(t.privacyIntro)}<p class="notice">${esc(t.translationNote)}</p></header><article class="panel"><h2>${esc(t.infoTitle)}</h2><ul>${['accountData','syncedData','aiData','subscriptionData','contentData','deviceData'].map(k=>`<li>${esc(t[k])}</li>`).join('')}</ul><h2>${esc(t.useTitle)}</h2>${paragraph(t.useText)}<h2>${esc(t.providersTitle)}</h2>${paragraph(t.providersText)}<h2>${esc(t.securityTitle)}</h2>${paragraph(t.securityText)}<h2>${esc(t.choicesTitle)}</h2>${paragraph(t.choicesText)}<p><a class="text-link" href="${hrefs.deletion}?lang=${language}">${esc(t.deletionLink)}</a></p><h2>${esc(t.childrenTitle)}</h2>${paragraph(t.childrenText)}</article>`;
    } else if (page === 'deletion') {
      content = `<header class="hero"><h1>${esc(t.deletionTitle)}</h1>${paragraph(t.deletionIntro)}<p class="notice">${esc(t.translationNote)}</p></header><article class="panel"><ol>${['step1','step2','step3','step4'].map(k=>`<li>${esc(t[k])}</li>`).join('')}</ol>${paragraph(t.verifyText)}<h2>${esc(t.localTitle)}</h2>${paragraph(t.localText)}<h2>${esc(t.deletedTitle)}</h2>${paragraph(t.deletedText)}<h2>${esc(t.notDeletedTitle)}</h2><ul>${['downloadsRemain','subscriptionRemains','storeRecords'].map(k=>`<li>${esc(t[k])}</li>`).join('')}</ul>${paragraph(t.needHelp)}</article>`;
    } else if (page === 'aiGuide' && guide) {
      const providers = [
        ['OpenAI','https://platform.openai.com/api-keys'],
        ['Gemini','https://aistudio.google.com/app/apikey'],
        ['Claude','https://console.anthropic.com/settings/keys'],
      ];
      const providerCards = providers.map(([name,url]) => `<article class="card provider-card"><h2>${esc(name)}</h2><ol>${guide.steps.map(step => `<li>${esc(step)}</li>`).join('')}</ol><a class="provider-link" href="${url}" target="_blank" rel="noopener noreferrer">${esc(guide.open)} ↗</a></article>`).join('');
      content = `<header class="hero"><h1>${esc(guide.title)}</h1>${paragraph(guide.intro)}<p class="notice">${esc(guide.notice)}</p></header><section class="panel"><h2>${esc(guide.chooseTitle)}</h2>${paragraph(guide.chooseText)}<div class="cards providers">${providerCards}</div></section><section class="panel"><h2>${esc(guide.connectTitle)}</h2><ol>${guide.connect.map(step => `<li>${esc(step)}</li>`).join('')}</ol></section><section class="panel guide-warning"><h2>${esc(guide.safetyTitle)}</h2><ul>${guide.safety.map(item => `<li>${esc(item)}</li>`).join('')}</ul></section>`;
    } else {
      const credits = `<section class="panel"><h2>${esc(t.sourcesTitle)}</h2>${paragraph(t.sourcesIntro)}<ul><li>${sourceLink('https://api-docs.quran.com/docs/tutorials/fonts/font-rendering/','Quran Foundation — QCF V4 Tajweed fonts')}: ${esc(t.qcfCredit)}</li><li>${sourceLink('https://github.com/quran-ws/quran-svg','quran-ws/quran-svg')}: ${esc(t.svgCredit)}</li><li>${sourceLink('https://tanzil.net/docs/Text_License','Tanzil Project — Quran text license')}: ${esc(t.tanzilCredit)}</li><li>${sourceLink('https://api-docs.quran.com/docs/api-reference/','Quran Foundation / Quran.com Content API')}: ${esc(t.tafsirCredit)}</li><li>${sourceLink('https://everyayah.com/','EveryAyah.com')} · ${sourceLink('https://alquran.cloud/','AlQuran Cloud')}: ${esc(t.recitationCredit)}</li></ul><p>${esc(t.sourceTerms)}</p><p>${link('privacy',t.privacy)} · ${link('deletion',t.deletion)}</p></section>`;
      content = `<header class="hero"><h1>${esc(t.aboutTitle)}</h1>${paragraph(t.aboutIntro)}<p class="notice">${esc(t.translationNote)}</p></header>${section(t.readingTitle,paragraph(t.readingText))}${section(t.tajwidTitle,paragraph(t.tajwidText))}${section(t.tafsirTitle,paragraph(t.tafsirText))}${section(t.personalTitle,paragraph(t.personalText))}${section(t.aiTitle,paragraph(t.aiText))}${credits}`;
    }
    document.getElementById('app').innerHTML = `<div class="top"><a class="brand" href="${hrefs.home}?lang=${language}"><img class="brand-icon" src="${root}quran-kareem-icon.png" alt=""><span>${esc(t.app)}</span></a>${select}</div>${nav}${content}<footer class="footer"><p>${esc(t.contact)}: <a class="ltr" href="mailto:trendytech355@gmail.com">trendytech355@gmail.com</a></p><p>${link('privacy',t.privacy)} · ${link('deletion',t.deletion)} · ${link('about',t.about)} · ${link('aiGuide',guideNavLabels[language] || guideNavLabels.en)}</p></footer>`;
    if (page === 'privacy') document.querySelector('article.panel').insertAdjacentHTML('beforeend', `<h2>${esc(legal.diagnosticsTitle)}</h2>${paragraph(legal.diagnosticsText)}<h2>${esc(legal.retentionTitle)}</h2>${paragraph(legal.retentionText)}`);
    if (page === 'deletion') document.querySelector('article.panel').insertAdjacentHTML('beforeend', `<h2>${esc(legal.retentionTitle)}</h2>${paragraph(legal.retentionText)}`);
    document.querySelector('.nav').insertAdjacentHTML('beforeend', link('terms', legal.termsTitle, page === 'terms'));
    document.querySelector('.footer').insertAdjacentHTML('beforeend', `<p>${link('terms', legal.termsTitle)}</p>`);
    document.getElementById('language').addEventListener('change', (event) => {
      language = event.target.value;
      try { localStorage.setItem('qk-site-language', language); } catch {}
      const url = new URL(location.href); url.searchParams.set('lang', language); history.replaceState({}, '', url);
      render(window.qkTranslations[language] || window.qkTranslations.en);
    });
  }

  Promise.all(['translations.json', 'legal-translations.json'].map(file => fetch(root + file).then((response) => {
    if (!response.ok) throw new Error('Unable to load translations');
    return response.json();
  }))).then(([translations, legal]) => {
    window.qkLegalTranslations = legal;
    window.qkTranslations = translations;
    render(translations[language] || translations.en);
  }).catch(() => {
    document.getElementById('app').textContent = 'Quran Kareem pages are temporarily unavailable. Please try again later.';
  });
})();
