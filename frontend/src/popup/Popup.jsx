import React, { useState, useEffect } from 'react';
import { generateEmailReply } from '../services/emailAPI.js';
import EmailResponseModal from '../components/EmailResponseModal.jsx';

export default function Popup() {
  const [emailContent, setEmailContent] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tone, setTone] = useState('professionnel');
  const [showResponse, setShowResponse] = useState(false);

  useEffect(() => {
    // Menarik email dari content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]) return;
      
      chrome.tabs.sendMessage(
        tabs[0].id,
        { type: 'EXTRACT_EMAIL' },
        (response) => {
          if (response && response.success) {
            setEmailContent(response.content);
          } else if (response && response.error) {
            setError(`Erreur: ${response.error}`);
          } else {
            setError('Impossible d\'extraire le contenu du mail');
          }
        }
      );
    });
  }, []);

  const handleGenerateReply = async () => {
    if (!emailContent.trim()) {
      setError('Aucun contenu d\'email détecté');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const generatedReply = await generateEmailReply(emailContent, tone);
      setReply(generatedReply);
      setShowResponse(true);
    } catch (err) {
      setError(`Erreur lors de la génération: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!emailContent && !error) {
    return (
      <div style={{ padding: '20px', minWidth: '350px', fontFamily: 'Arial, sans-serif' }}>
        <p style={{ color: '#666' }}>Chargement du mail...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', minWidth: '350px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ marginTop: 0, color: '#333' }}>Générateur de Réponse IA</h2>

      {error && (
        <div style={{ padding: '10px', backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: '4px', marginBottom: '15px' }}>
          {error}
        </div>
      )}

      {emailContent && !showResponse && (
        <div>
          <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#F3F4F6', borderRadius: '4px', maxHeight: '150px', overflowY: 'auto' }}>
            <p style={{ fontSize: '12px', color: '#666' }}>
              <strong>Aperçu du mail:</strong>
            </p>
            <p style={{ fontSize: '12px', color: '#999', margin: '5px 0 0 0', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {emailContent.substring(0, 200)}...
            </p>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold', color: '#333' }}>
              Ton de la réponse:
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #D1D5DB',
                fontSize: '12px',
              }}
            >
              <option value="professionnel">Professionnel</option>
              <option value="formel">Formel</option>
              <option value="casual">Casual</option>
              <option value="amical">Amical</option>
            </select>
          </div>

          <button
            onClick={handleGenerateReply}
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: loading ? '#9CA3AF' : '#4F46E5',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            {loading ? 'Génération en cours...' : '✨ Générer la réponse'}
          </button>
        </div>
      )}

      {showResponse && reply && (
        <EmailResponseModal reply={reply} onClose={() => setShowResponse(false)} />
      )}
    </div>
  );
}
