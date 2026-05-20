# GitHub Pages — Project Instructions

This is a minimal **GitHub Pages** site built with raw **HTML**, **CSS**, and **JavaScript** (no frameworks, no build tools).

## Project Structure

```
.
├── index.html         # Main landing page
├── style.css          # Stylesheet
├── script.js          # Client-side JavaScript
├── plugins.json       # Plugin version manifest (manual edits)
├── _config.yml        # GitHub Pages site settings
├── .gitignore         # Files ignored by git
├── instructions.md    # This file
└── README.md          # Project overview
```

## Local Development

Just open `index.html` in a browser — no server required.

For a more realistic preview, start a local server:

```bash
# Python 3
python -m http.server 8000

# Or Node.js (npx)
npx serve .
```

Then visit `http://localhost:8000`.

## Deployment

1. Push the repository to GitHub (default branch: `main` or `master`).
2. Go to your repository **Settings > Pages**.
3. Under "Branch", select the branch you pushed to and set the folder to `/` (root).
4. Your site will be published at `https://<username>.github.io/<repository>/`.

## Editing

- **HTML** — edit `index.html` to change page structure and content.
- **CSS** — edit `style.css` to change colors, layout, and fonts.
- **JS** — edit `script.js` to add interactivity.
- **Settings** — edit `_config.yml` to adjust GitHub Pages theme/title (Jekyll-only).

## Notes

- This is a **static site** — no server-side logic or databases.
- All assets are local (no CDN dependencies).
- The site is fully responsive via CSS `viewport` meta tag and flexible layout.
