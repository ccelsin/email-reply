async function getBackendUrl() {
  return new Promise((resolve) => {
    chrome.storage.sync.get('backendUrl', (data) => {
      resolve(data.backendUrl || 'http://localhost:8080');
    });
  });
}

async function setBackendUrl(url) {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ backendUrl: url }, resolve);
  });
}

async function generateEmailReply(emailContent, tone = 'professionnel') {
  const backendUrl = await getBackendUrl();
  
  const response = await fetch(`${backendUrl}/api/email/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      emailContent: emailContent,
      tone: tone,
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Erreur ${response.status}: ${errorData || response.statusText}`);
  }

  const reply = await response.text();
  return reply;
}

export { generateEmailReply, getBackendUrl, setBackendUrl };
