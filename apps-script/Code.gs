/**
 * Wedding Invitation RSVP -> Google Sheets
 *
 * This script is designed to be bound to the couple's RSVP spreadsheet.
 * Sheet ID: 1xw09X1YEHvIQLJOZX9bbDFQ8mzM_qIKP9XTiST8PgY8
 *
 * In the spreadsheet, open Extensions > Apps Script, paste this file into Code.gs,
 * save, then Deploy > New deployment > Web app:
 *   Execute as: Me
 *   Who has access: Anyone
 * Copy the deployed URL ending in /exec into RSVP_ENDPOINT in script.js.
 */

const SPREADSHEET_ID = "1xw09X1YEHvIQLJOZX9bbDFQ8mzM_qIKP9XTiST8PgY8";
const RESPONSE_SHEET_NAME = "RSVP Responses";
const HEADERS = ["Timestamp", "Guest Name", "Email", "Attendance", "Dietary Needs / Note"];

function doGet() {
  return ContentService
    .createTextOutput("Wedding RSVP endpoint is running.")
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("Missing RSVP submission.");
    }

    const data = JSON.parse(e.postData.contents);
    const name = cleanText(data.name, 120);
    const email = cleanText(data.email, 200);
    const attendance = cleanText(data.attendance, 40);
    const notes = cleanText(data.notes, 1000);
    const website = cleanText(data.website, 200);

    // Quietly discard bot submissions caught by the hidden honeypot.
    if (website) return jsonResponse({ ok: true });

    if (!name) throw new Error("Guest name is required.");
    if (["Joyfully accepts", "Regretfully declines"].indexOf(attendance) === -1) {
      throw new Error("Please select an attendance response.");
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Please enter a valid email address.");
    }

    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(RESPONSE_SHEET_NAME);
    if (!sheet) sheet = spreadsheet.insertSheet(RESPONSE_SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([new Date(), name, email, attendance, notes]);
    return jsonResponse({ ok: true });
  } catch (error) {
    console.error(error);
    return jsonResponse({ ok: false, error: String(error.message || error) });
  }
}

function cleanText(value, maxLength) {
  return String(value == null ? "" : value).trim().slice(0, maxLength);
}

function jsonResponse(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
