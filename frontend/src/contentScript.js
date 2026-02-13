import { detectEmailClient, extractEmailContent, insertIntoCompose } from './utils/domSelectors.js';

// Écouter les messages du popup
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.type === 'EXTRACT_EMAIL') {
    try {
      const emailContent = extractEmailContent();
      sendResponse({ success: true, content: emailContent });
    } catch (error) {
      sendResponse({ success: false, error: error.message });
    }
  }

  if (request.type === 'INSERT_REPLY') {
    try {
      insertIntoCompose(request.content);
      sendResponse({ success: true });
    } catch (error) {
      sendResponse({ success: false, error: error.message });
    }
  }
});

// Injection du bouton dans l'interface email
function injectGenerateButton() {
  const emailClient = detectEmailClient();
  
  if (!emailClient) return;

  // Vérifier qu'on est bien dans la vue d'un mail ouvert (pas la liste)
  let contextualToolbar = null;
  
  if (emailClient === 'gmail') {
    // Gmail: Chercher la toolbar contextuelle du mail ouvert
    const mailContainer = document.querySelector('[role="main"]');
    if (mailContainer) {
      contextualToolbar = mailContainer.querySelector('[role="toolbar"]');
    }
  } else if (emailClient === 'outlook') {
    // Outlook: Chercher le conteneur d'actions du mail
    const readingPane = document.querySelector('[role="article"]');
    if (readingPane) {
      contextualToolbar = readingPane.parentElement?.querySelector('[role="group"]');
    }
  }

  // Ne pas injecter deux fois
  if (document.querySelector('#email-reply-generator-btn')) {
    return;
  }

  // Si pas de toolbar trouvée, attendre et réessayer
  if (!contextualToolbar) {
    setTimeout(injectGenerateButton, 500);
    return;
  }

  // Créer le bouton
  const button = document.createElement('button');
  button.id = 'email-reply-generator-btn';
  button.className = 'email-reply-generator-btn';
  button.textContent = '💌 Générer réponse IA';
  button.style.cssText = `
    padding: 8px 12px;
    background-color: #4F46E5;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    margin-right: 8px;
    transition: background-color 0.2s;
    z-index: 10000;
  `;

  button.onmouseover = () => button.style.backgroundColor = '#4338CA';
  button.onmouseout = () => button.style.backgroundColor = '#4F46E5';

  // Listener pour ouvrir le popup
  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
  });

  // Injecter le bouton
  contextualToolbar.insertBefore(button, contextualToolbar.firstChild);

  // Observer pour supprimer le bouton si on change de mail
  observeEmailChanges();
}

function observeEmailChanges() {
  const observer = new MutationObserver(() => {
    // Vérifier si le mail a changé
    const currentButton = document.getElementById('email-reply-generator-btn');
    const emailClient = detectEmailClient();
    
    if (!emailClient) return;

    let isMailOpen = false;
    
    if (emailClient === 'gmail') {
      isMailOpen = !!document.querySelector('[role="main"]')?.querySelector('[role="presentation"]');
    } else if (emailClient === 'outlook') {
      isMailOpen = !!document.querySelector('[role="article"]');
    }

    // Supprimer le bouton si pas de mail ouvert
    if (currentButton && !isMailOpen) {
      currentButton.remove();
    }
    // Réinjecter si besoin
    else if (!currentButton && isMailOpen) {
      setTimeout(injectGenerateButton, 100);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'data-state'],
  });
}

// Initialiser l'injection au chargement
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectGenerateButton);
} else {
  injectGenerateButton();
}
