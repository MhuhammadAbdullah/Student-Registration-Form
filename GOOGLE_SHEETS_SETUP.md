# Google Forms style workshop registration

This page recreates the supplied Google Forms layout for the “Before You Say Qubool Hai” workshop. It collects name, contact number, institute, age, referral source, and an optional payment receipt. Submissions are appended to a Google Sheet; receipt uploads are stored privately in the Google Drive account that owns the Apps Script, and their file IDs are saved in the sheet.

## Connect the form to a Google Sheet

1. Create a Google Sheet in the Google account that should own the registrations. Copy the ID from its URL: the text between `/d/` and `/edit`.
2. In that Sheet, choose **Extensions → Apps Script**. Replace the editor contents with [Code.gs](Code.gs), then replace `PASTE_YOUR_GOOGLE_SHEET_ID_HERE` with the Sheet ID. Save.
3. In Apps Script, choose **Deploy → New deployment → Web app**. Set **Execute as** to **Me** and access to **Anyone**, then deploy. Authorize the requested Sheets and Drive access. Anyone with this endpoint can submit a registration, so keep the deployment URL private from anyone who should not submit.
4. Copy the deployed Web App URL (it ends in `/exec`). In [index.html](index.html), replace `PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE` with that URL. Commit the change.
5. Open the GitHub Pages site for this repository and submit one test registration. Check the **Registrations** tab in the Sheet and verify that the optional receipt file ID appears when a receipt is included.

The first successful submission creates the **Registrations** tab and its column headings. The Sheet and uploaded receipts remain under the account used to deploy the script. To use a new script version after changing Code.gs, deploy a new version from **Deploy → Manage deployments → Edit**.
