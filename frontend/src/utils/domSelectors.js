function detectEmailClient() {
  if (window.location.hostname.includes('gmail.google.com') || window.location.hostname.includes('mail.google.com')) {
    return 'gmail';
  }
  if (window.location.hostname.includes('outlook.office.com') || window.location.hostname.includes('outlook.live.com')) {
    return 'outlook';
  }
  return null;
}

function extractGmailContent() {
  // Chercher le conteneur principal du mail ouvert
  const mailContainer = document.querySelector('[role="main"]');
  if (!mailContainer) {
    throw new Error('Mail container not found');
  }

  // Chercher le contenu du mail avec plusieurs fallbacks
  let emailContent = '';

  // 1. Chercher [role="presentation"] qui contient souvent le corps du mail
  const presentation = mailContainer.querySelector('[role="presentation"]');
  if (presentation) {
    emailContent = presentation.innerText || presentation.textContent;
  }

  // 2. Fallback: Chercher [data-tooltip*="Mail body"]
  if (!emailContent) {
    const mailBody = mailContainer.querySelector('[data-tooltip*="Mail body"]');
    if (mailBody) {
      emailContent = mailBody.innerText || mailBody.textContent;
    }
  }

  // 3. Fallback: Chercher tous les divs et prendre le plus grand
  if (!emailContent) {
    const allDivs = mailContainer.querySelectorAll('div');
    for (let div of allDivs) {
      const text = div.innerText || div.textContent;
      if (text && text.length > emailContent.length) {
        emailContent = text;
      }
    }
  }

  if (!emailContent) {
    throw new Error('Could not extract Gmail content');
  }

  return emailContent.trim();
}

function extractOutlookContent() {
  // Chercher l'article (mail ouvert)
  const readingPane = document.querySelector('[role="article"]');
  if (!readingPane) {
    throw new Error('Outlook mail not found');
  }

  // Cloner pour ne pas modifier le DOM original
  const clone = readingPane.cloneNode(true);

  // Supprimer les boutons, toolbars, etc.
  const elementsToRemove = clone.querySelectorAll('button, [role="group"], [role="toolbar"], nav, footer');
  elementsToRemove.forEach(el => el.remove());

  let emailContent = clone.innerText || clone.textContent;

  if (!emailContent) {
    throw new Error('Could not extract Outlook content');
  }

  return emailContent.trim();
}

function extractEmailContent() {
  const emailClient = detectEmailClient();

  if (emailClient === 'gmail') {
    return extractGmailContent();
  } else if (emailClient === 'outlook') {
    return extractOutlookContent();
  } else {
    throw new Error('Email client not detected');
  }
}

function insertIntoGmailCompose(content) {
  // Chercher la textarea ou contenteditable du brouillon
  const composeArea = document.querySelector('[data-tooltip*="compose"]') || 
                      document.querySelector('[role="textbox"]') ||
                      document.querySelector('[contenteditable="true"]');

  if (!composeArea) {
    // Essayer dans une iframe
    const composeIframes = document.querySelectorAll('iframe');
    for (let iframe of composeIframes) {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        if (iframeDoc) {
          const body = iframeDoc.body;
          if (body) {
            body.innerHTML += '\n\n' + content;
            return;
          }
        }
      } catch {
        // iframe inaccessible
      }
    }
    throw new Error('Compose area not found');
  }

  if (composeArea.contentEditable === 'true') {
    const event = new Event('input', { bubbles: true });
    composeArea.innerHTML += '\n\n' + content;
    composeArea.dispatchEvent(event);
  } else if (composeArea.tagName === 'TEXTAREA') {
    composeArea.value += '\n\n' + content;
    composeArea.dispatchEvent(new Event('input', { bubbles: true }));
  } else {
    composeArea.innerHTML += '\n\n' + content;
  }
}

function insertIntoOutlookCompose(content) {
  // Chercher le champ de texte d'Outlook
  const composeArea = document.querySelector('[role="textbox"]') ||
                      document.querySelector('[contenteditable="true"]');

  if (!composeArea) {
    throw new Error('Outlook compose area not found');
  }

  if (composeArea.contentEditable === 'true') {
    const event = new Event('input', { bubbles: true });
    composeArea.innerHTML += '\n\n' + content;
    composeArea.dispatchEvent(event);
  } else if (composeArea.tagName === 'TEXTAREA') {
    composeArea.value += '\n\n' + content;
    composeArea.dispatchEvent(new Event('input', { bubbles: true }));
  } else {
    composeArea.textContent += '\n\n' + content;
  }
}

function insertIntoCompose(content) {
  const emailClient = detectEmailClient();

  if (emailClient === 'gmail') {
    insertIntoGmailCompose(content);
  } else if (emailClient === 'outlook') {
    insertIntoOutlookCompose(content);
  } else {
    throw new Error('Email client not detected for insertion');
  }
}

export { detectEmailClient, extractEmailContent, insertIntoCompose };
