// components/ExportButton.tsx
'use client';
import React from 'react';

interface Props {
  repoUrl: string;
  paths: string[];
  branch: string; // Ajout de la branche
}

const ExportButton: React.FC<Props> = ({ repoUrl, paths, branch }) => {
  const handleExport = async () => {
    try {
      const res = await fetch('/api/git/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl, paths, branch }), // Ajout de la branche au corps de la requête
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Échec de l’export');
      }
      const txt = await res.text();
      const blob = new Blob([txt], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${repoUrl.replace(/\//g, '_')}.txt`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <button onClick={handleExport} disabled={paths.length === 0}>
      Exporter la sélection
    </button>
  );
};

export default ExportButton;
