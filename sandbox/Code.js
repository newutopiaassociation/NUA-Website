/**
 * Serves the HTML file for the web app.
 */
function doGet(e) {
  return HtmlService.createTemplateFromFile('index')
      .evaluate()
      .setTitle('NUA Mail Merge')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * Helper to include other HTML files (CSS/JS).
 * Usage in HTML: <?!= include('stylesheet'); ?>
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}

/**
 * Fetches data from the provided Google Sheet URL.
 * Expects columns: Email, First Name, Last Name.
 */
function getSheetData(sheetUrl) {
  try {
    const ss = SpreadsheetApp.openByUrl(sheetUrl);
    const sheet = ss.getSheets()[0]; // Assume first sheet
    const data = sheet.getDataRange().getValues();
    
    if (data.length < 2) {
        throw new Error("Sheet is empty or has no data rows.");
    }
    
    // Normalize headers to lowercase
    const headers = data[0].map(h => h.toString().toLowerCase().trim());
    
    const emailIdx = headers.indexOf('email');
    const firstIdx = headers.indexOf('first name');
    const lastIdx = headers.indexOf('last name');
    
    if (emailIdx === -1) throw new Error("Column 'Email' not found.");
    if (firstIdx === -1) throw new Error("Column 'First Name' not found.");
    if (lastIdx === -1) throw new Error("Column 'Last Name' not found.");
    
    const recipients = [];
    
    // Start from row 2 (index 1)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const email = row[emailIdx];
      
      if (email && email.toString().includes('@')) {
        recipients.push({
          email: email,
          firstname: row[firstIdx],
          lastname: row[lastIdx]
        });
      }
    }
    
    return recipients;
    
  } catch (e) {
    throw new Error("Failed to read sheet: " + e.message);
  }
}

/**
 * Sends emails to the list of recipients.
 */
function sendEmails(sheetUrl, subject, bodyTemplate) {
  try {
    const recipients = getSheetData(sheetUrl);
    let sentCount = 0;
    let errors = [];
    
    recipients.forEach(user => {
      try {
        // Personalized body
        const personalizedBody = bodyTemplate
          .replace(/{{firstname}}/g, user.firstname)
          .replace(/{{lastname}}/g, user.lastname);
          
        GmailApp.sendEmail(user.email, subject, personalizedBody, {
            name: 'NUA Association'
        });
        
        sentCount++;
      } catch (err) {
        errors.push(`${user.email}: ${err.message}`);
      }
    });
    
    return { sent: sentCount, errors: errors };
    
  } catch (e) {
    throw new Error("Failed to process email sending: " + e.message);
  }
}
