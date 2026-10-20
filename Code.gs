/**
 * Google Apps Script endpoint for the workshop registration form.
 * Setup: create a Google Sheet, paste its ID below, then deploy as a Web App.
 */
const SPREADSHEET_ID = "PASTE_YOUR_GOOGLE_SHEET_ID_HERE";
const SHEET_NAME = "Registrations";
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

function doPost(e) {
  try {
    if (!SPREADSHEET_ID || SPREADSHEET_ID.indexOf("PASTE_YOUR") === 0) {
      throw new Error("Set SPREADSHEET_ID in Code.gs before deployment.");
    }
    const data = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    const name = requiredText(data.name, "Name");
    const contact = requiredText(data.contact, "Contact Number");
    const institute = requiredText(data.institute, "Institute");
    const age = Number(data.age);
    const referral = requiredText(data.referral, "Referral source");
    if (!Number.isFinite(age) || age < 16 || age > 100) throw new Error("Age is invalid.");

    let receiptId = "";
    if (data.receiptData) {
      const match = String(data.receiptData).match(/^data:(image\/[a-zA-Z0-9.+-]+|application\/pdf);base64,([\s\S]+)$/);
      if (!match) throw new Error("Receipt must be an image or PDF.");
      const bytes = Utilities.base64Decode(match[2]);
      if (bytes.length > MAX_UPLOAD_BYTES) throw new Error("Receipt must be 10 MB or smaller.");
      const safeName = String(data.receiptName || "payment-receipt").replace(/[\\/:*?"<>|]/g, "_");
      const blob = Utilities.newBlob(bytes, match[1], safeName);
      const file = DriveApp.createFile(blob);
      receiptId = file.getId();
    }

    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Name", "Contact Number", "Institute", "Age", "Referral Source", "Receipt File ID"]);
      sheet.setFrozenRows(1);
    }
    sheet.appendRow([
      new Date(),
      safeCell(name),
      safeCell(contact),
      safeCell(institute),
      age,
      safeCell(referral),
      receiptId
    ]);
    return jsonResponse({success: true});
  } catch (error) {
    return jsonResponse({success: false, error: error.message || "Unable to save this registration."});
  }
}

function requiredText(value, label) {
  const text = String(value == null ? "" : value).trim();
  if (!text) throw new Error(label + " is required.");
  return text;
}

// Prevent user-entered values from being interpreted as spreadsheet formulas.
function safeCell(value) {
  const text = String(value == null ? "" : value).trim();
  return /^[=+@\\-]/.test(text) ? "'" + text : text;
}

function jsonResponse(value) {
  return ContentService.createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
