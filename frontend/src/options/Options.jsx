import React, { useState, useEffect } from 'react';
import { getBackendUrl, setBackendUrl } from '../services/emailAPI.js';

export default function Options() {
  const [backendUrl, setBackendUrlLocal] = useState('http://localhost:8080');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getBackendUrl().then(url => {
      setBackendUrlLocal(url);
    });
  }, []);

  const handleSave = async () => {
    await setBackendUrl(backendUrl);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>Configuration de l'extension</h1>

      <div style={{ marginBottom: '30px' }}>
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#555' }}>
          URL du backend:
        </label>
        <input
          type="text"
          value={backendUrl}
          onChange={(e) => setBackendUrlLocal(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #DDD',
            fontSize: '14px',
            fontFamily: 'monospace',
          }}
          placeholder="http://localhost:8080"
        />
        <p style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
          Exemple: http://localhost:8080
        </p>
      </div>

      <button
        onClick={handleSave}
        style={{
          padding: '10px 20px',
          backgroundColor: '#4F46E5',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
        }}
      >
        💾 Enregistrer
      </button>

      {saved && (
        <p style={{ color: '#10B981', marginTop: '10px', fontWeight: 'bold' }}>
          ✅ Configuration enregistrée!
        </p>
      )}

      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#F9FAFB', borderRadius: '4px' }}>
        <h2 style={{ color: '#333', marginBottom: '15px', fontSize: '16px' }}>Aide</h2>
        <p style={{ color: '#666', lineHeight: '1.6' }}>
          1. Assurez-vous que le backend est en cours d'exécution<br/>
          2. Définissez l'URL du backend (généralement http://localhost:8080)<br/>
          3. Ouvrez un email sur Gmail ou Outlook<br/>
          4. Cliquez sur le bouton "💌 Générer réponse IA"<br/>
          5. Sélectionnez le ton et cliquez sur "✨ Générer la réponse"<br/>
          6. Copiez ou insérez la réponse dans votre brouillon
        </p>
      </div>
    </div>
  );
}
