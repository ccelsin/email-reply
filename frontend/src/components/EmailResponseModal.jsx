import React from 'react';

export default function EmailResponseModal({ reply, onClose }) {
  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(reply);
      alert('✅ Réponse copiée!');
    } catch {
      alert('❌ Erreur lors de la copie');
    }
  };

  const handleInsertToDraft = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]) return;
      
      chrome.tabs.sendMessage(
        tabs[0].id,
        { type: 'INSERT_REPLY', content: reply },
        (response) => {
          if (response && response.success) {
            alert('✅ Réponse insérée dans le brouillon!');
            onClose();
          } else {
            alert('❌ Impossible d\'insérer la réponse. Ouvrez un brouillon d\'abord.');
          }
        }
      );
    });
  };

  return (
    <div>
      <h3 style={{ marginTop: 0, color: '#333' }}>✨ Réponse générée:</h3>
      
      <div
        style={{
          padding: '12px',
          backgroundColor: '#F0F9FF',
          borderLeft: '4px solid #4F46E5',
          borderRadius: '4px',
          marginBottom: '15px',
          maxHeight: '200px',
          overflowY: 'auto',
          fontSize: '13px',
          color: '#333',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        {reply}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={handleCopyToClipboard}
          style={{
            flex: 1,
            padding: '10px',
            backgroundColor: '#10B981',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 'bold',
          }}
        >
          📋 Copier
        </button>

        <button
          onClick={handleInsertToDraft}
          style={{
            flex: 1,
            padding: '10px',
            backgroundColor: '#3B82F6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 'bold',
          }}
        >
          ✏️ Insérer
        </button>

        <button
          onClick={onClose}
          style={{
            flex: 1,
            padding: '10px',
            backgroundColor: '#EF4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 'bold',
          }}
        >
          ✕ Fermer
        </button>
      </div>
    </div>
  );
}
