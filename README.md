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

## Google Sheets RSVP connection

The website's RSVP form is prepared for a Google Apps Script endpoint. The endpoint source is in [apps-script/Code.gs](apps-script/Code.gs).

1. Open the RSVP spreadsheet: https://docs.google.com/spreadsheets/d/1xw09X1YEHvIQLJOZX9bbDFQ8mzM_qIKP9XTiST8PgY8/edit
2. In the sheet, select **Extensions → Apps Script**.
3. Replace the starter code in `Code.gs` with the contents of [apps-script/Code.gs](apps-script/Code.gs), then save.
4. Select **Deploy → New deployment → Web app**. Set **Execute as: Me** and **Who has access: Anyone**, then deploy and authorize it.
5. Copy the deployed web app URL ending in `/exec`.
6. Open `script.js` and paste that URL into `RSVP_ENDPOINT`.
7. Commit the change and test one RSVP. A new **RSVP Responses** tab will be created automatically with timestamp, guest name, email, attendance, and notes.

**Important:** Until the deployed URL is added to `RSVP_ENDPOINT`, the website will not store responses. The static website cannot inspect Google's response because the browser's cross-origin restrictions prevent it; after connecting, verify the test submission appears in the spreadsheet. Anyone who can access the public web app can submit an RSVP, so keep the script limited to recording RSVP data.
