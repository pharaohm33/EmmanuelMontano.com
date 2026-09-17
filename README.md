# EmmanuelMontano.com

Personal link-in-bio site: hero photo, deal/venture links, socials, and a
beehiiv-powered "what do you need help with" capture section.

## Structure

- `index.html` — page content
- `styles.css` — theme, layout, scroll-reveal animations
- `script.js` — IntersectionObserver reveal animations + topic selector
- `assets/emmanuel.jpg` — hero photo

## Editing links

All links live directly in `index.html` inside `#links` (deals/ventures) and
`#social` (social platforms). Each is a plain `<a>` tag — add, remove, or
reorder as needed.

## Wiring up the email capture (beehiiv)

The capture section (`#capture`) embeds a beehiiv subscribe form. To finish
setting it up:

1. In beehiiv (`emmanuelmontano.beehiiv.com`), go to **Grow → Subscribe
   Forms & Embeds** and create/select a form.
2. Add a **Poll Question** block: "What do you need help with?" with options
   matching the buttons in `index.html` (`#capture-options`).
3. For each answer, set a **tag** to apply to the subscriber, and optionally
   a **redirect URL** to send them to a different page or publication after
   they submit.
4. Copy the generated embed `<iframe src="https://embeds.beehiiv.com/...">`
   and paste it into the `#beehiiv-embed` div in `index.html`, replacing the
   `YOUR_FORM_ID` placeholder.

This keeps tagging/routing logic entirely in beehiiv's dashboard — no API
key needs to live in this static site.

## Deploying

This is a static site served via GitHub Pages from the `main` branch root.
Any push to `main` updates the live site automatically (may take a minute).

## Local preview

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000
