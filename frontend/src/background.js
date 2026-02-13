// Background Service Worker pour Manifest V3
// Ce fichier reste minimaliste dans Manifest V3

chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installée!');
});

// Écouter les messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Les messages sont traités directement dans contentScript.js
  sendResponse({ received: true });
});
