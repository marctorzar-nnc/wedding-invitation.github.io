# Wedding Invitation

A lightweight, responsive wedding invitation made with vanilla HTML, CSS, and JavaScript. No npm packages or build step required.

## Files

- `index.html` — semantic invitation sections
- `styles.css` — pastel styling, responsive layout, transitions
- `script.js` — invitation settings, scroll reveal, calendar link, demo RSVP

## Personalize the invitation

Open `script.js` and edit the `WEDDING` settings near the top: `names`, `day`, `month`, `year`, `isoDate` (format `YYYY-MM-DD`), `time`, `venue`, `address`, and `hashtag`.

Only the day `28` is currently known, so month, year, venue, and time are placeholders.

## RSVP note

The RSVP form is currently front-end only. It validates the form and displays a demo confirmation, but it does **not** send or store guest information. Connect a form provider or Google Apps Script endpoint before sharing it with guests.

## Publish with GitHub Pages

1. Open the repository's **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select branch **main** and folder **/(root)**, then save.
4. Wait for GitHub Pages to finish deploying.

Expected site URL: https://marctorzar-nnc.github.io/wedding-invitation.github.io/

## QR code

After the site is published and you confirm the URL works on a phone, create a QR code pointing to that URL. If you later change the domain or repository, regenerate the QR code.