# TrendyTech Website

Public website for TrendyTech's indie mobile games and applications. GitHub Pages publishes the root of `main` at https://trendytech.info/.

## Structure

- `/`: studio introduction linking to Games and Applications.
- `/games/`: game catalog; `/apps/`: application catalog.
- `data/projects.json`: project names, descriptions, categories, icons, store identifiers, store links, and About/Privacy/Support URLs.
- `assets/`: shared website styles, project artwork, and store gallery assets.
- `scripts/build-site.py`: generates the homepage, catalogs, support pages, new project landing pages, and sitemap.
- `scripts/sync-store-assets.py`: refreshes published App Store links, icons, screenshots, and Google Play links/icons. Public Google Play markup is best effort; manual screenshots remain supported. Images are saved locally. Failed or unpublished listings retain saved assets. No credentials are required.
- `/tools/campaign-insights-connector/`: original Google campaign information page. Its privacy policy remains at `/privacy/`.

Existing game URLs, including case-sensitive `/PipeCraft/about.html`, `/PipeCraft/privacy.html`, `/ZombieCarnival/about.html`, and `/ZombieCarnival/privacy.html`, remain available. Quran Kareem's existing localized pages, language query parameters, AI guides, Terms, and account deletion pages remain available at their existing URLs. Advertising declarations remain at `/app-ads.txt`.

## Add a game or application

1. Copy an entry in `data/projects.json`. Choose a unique slug and category (`games` or `apps`), set the description, icon, email, project URL, About/Privacy/Support URLs, Android package, and iOS bundle ID. Start with empty `stores` and `screenshots`, or supply verified links and local image paths.
2. Add the project's privacy and About content at the configured paths. Existing pages are not overwritten by the generator. A new project landing page and support page are generated automatically. Keep legal content specific to that project.
3. Run `python3 scripts/sync-store-assets.py` to fetch available public store assets. This is optional; local images work without store access. Run `python3 scripts/build-site.py` after catalog changes.
4. Review, commit, and push the resulting static files. Adding a project updates its category catalog; the homepage remains focused on the studio and categories.

Support uses `trendytech355@gmail.com` with project-specific email subjects. Buttons open the visitor's email application; messages are not sent by this website.
