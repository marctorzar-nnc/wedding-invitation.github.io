/**
 * Wedding RSVP -> Google Sheets + owner notification.
 * Email notifications go to the couple only for "Joyfully accepts".
 * Private Google Photos album access must still be granted manually.
 */
const SPREADSHEET_ID = "1xw09X1YEHvIQLJOZX9bbDFQ8mzM_qIKP9XTiST8PgY8";
const RESPONSE_SHEET_NAME = "RSVP Responses";
const OWNER_EMAIL = "danietorzar00@gmail.com";
const HEADERS = ["Timestamp", "Guest Name", "Email", "Attendance", "Dietary Needs / Note", "Private Album Invite Status", "Owner Notification Status"];

function doGet() {
  return ContentService.createTextOutput("Wedding RSVP endpoint is running.").setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) throw new Error("Missing RSVP submission.");
    const data = JSON.parse(e.postData.contents);
    const name = cleanText(data.name, 120);
    const email = cleanText(data.email, 200);
    const attendance = cleanText(data.attendance, 40);
    const notes = cleanText(data.notes, 1000);
    const website = cleanText(data.website, 200);
    if (website) return jsonResponse({ ok: true });
    if (!name) throw new Error("Guest name is required.");
    if (["Joyfully accepts", "Regretfully declines"].indexOf(attendance) === -1) throw new Error("Invalid attendance response.");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Invalid email address.");

    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(RESPONSE_SHEET_NAME);
    if (!sheet) sheet = spreadsheet.insertSheet(RESPONSE_SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
      sheet.setFrozenRows(1);
    } else {
      const existing = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), HEADERS.length)).getValues()[0];
      HEADERS.forEach(function(header, i) {
        if (existing[i] !== header) sheet.getRange(1, i + 1).setValue(header);
      });
      sheet.setFrozenRows(1);
    }

    const accepted = attendance === "Joyfully accepts";
    const row = sheet.getLastRow() + 1;
    sheet.appendRow([
      new Date(),
      safeCellText(name),
      safeCellText(email),
      attendance,
      safeCellText(notes),
      accepted ? "Pending manual Google Photos invite" : "Not eligible",
      accepted ? "Pending" : "Not required"
    ]);

    if (accepted) {
      try {
        MailApp.sendEmail({
          to: OWNER_EMAIL,
          subject: "Wedding RSVP accepted — album invite pending",
          body: "A guest has joyfully accepted the wedding invitation.\n\nGuest: " + name +
            "\nEmail provided: " + (email || "(not provided)") +
            "\nNotes: " + (notes || "(none)") +
            "\n\nNext step: confirm the guest's Google Account and manually add it to the restricted Google Photos album. The album link is intentionally not included in this email.",
          name: "Marc & Angel Wedding RSVP"
        });
        sheet.getRange(row, 7).setValue("Sent to owner");
      } catch (mailError) {
        console.error("Notification email failed: " + String(mailError));
        sheet.getRange(row, 7).setValue("Failed — check Apps Script logs");
      }
    }
    return jsonResponse({ ok: true });
  } catch (error) {
    console.error(error);
    return jsonResponse({ ok: false, error: String(error.message || error) });
  }
}

function cleanText(value, maxLength) {
  return String(value == null ? "" : value).trim().slice(0, maxLength);
}
function safeCellText(value) {
  const text = String(value == null ? "" : value);
  return /^[=+@\-]/.test(text) ? "'" + text : text;
}
function jsonResponse(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
