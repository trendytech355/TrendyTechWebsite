(async () => {
  const path = location.pathname;
  if (!/^\/(games|apps)\/[^/]+\/(?:index\.html)?$/.test(path)) return;
  const projects = await fetch('/data/projects.json').then(r => { if (!r.ok) throw new Error('Catalog unavailable'); return r.json(); }).catch(() => []);
  const project = projects.find(p => path === p.url || path === p.url + 'index.html');
  if (!project) return;
  const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const section = document.createElement('section');
  section.className = 'tt-project-extras';
  section.innerHTML = `<h2>Get ${esc(project.name)} on your phone</h2><p>Made for mobile. Choose your store to download or open the app.</p><div class="store-links">${Object.entries(project.stores).map(([platform,url]) => `<a class="button" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${platform === 'ios' ? 'Download on the App Store' : 'Get it on Google Play'} ↗</a>`).join('') || '<p>Store links will be added when the public listings are available.</p>'}</div>${project.screenshots.length ? `<div class="screenshots" aria-label="${esc(project.name)} screenshots">${project.screenshots.map((url,i)=>`<img src="${esc(url)}" alt="${esc(project.name)} screenshot ${i+1}" loading="lazy">`).join('')}</div>` : ''}<div class="links"><a href="/${project.category}/">All ${project.category === 'apps' ? 'applications' : 'games'}</a><a href="${esc(project.about)}">About</a><a href="${esc(project.privacy)}">Privacy</a><a href="${esc(project.support)}">Support</a></div>`;
  const insert = () => { const main = document.querySelector('main'); if (main && main.children.length) { if (!main.querySelector('.tt-project-extras')) main.append(section); return true; } return false; };
  insert();
  const observer = new MutationObserver(() => insert());
  observer.observe(document.body,{childList:true,subtree:true});
})();
