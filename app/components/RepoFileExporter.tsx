// components/RepoFileExporter.tsx
'use client';
import React, { useState, useEffect } from 'react';
import type { Repo, TreeNode } from '@/app/types/git';
import RepoSelector from './RepoSelector';
import FileSelector from './FileSelector';
import ExportButton from './ExportButton';

const RepoFileExporter: React.FC = () => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [selRepo, setSelRepo] = useState('');
  const [files, setFiles] = useState<TreeNode[]>([]);
  const [selPaths, setSelPaths] = useState<string[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1) Charger la liste des repos
  useEffect(() => {
    setLoadingRepos(true);
    fetch('/api/git/repos')
      .then(res => {
        if (!res.ok) throw res;
        return res.json() as Promise<Repo[]>;
      })
      .then(setRepos)
      .catch(async res => {
        const err = await (res.json?.() || {}).error;
        setError(err || 'Erreur lors du chargement des dépôts');
      })
      .finally(() => setLoadingRepos(false));
  }, []);

  // 2) Charger l’arborescence quand on choisit un repo
  useEffect(() => {
    if (!selRepo) {
      setFiles([]);
      setSelPaths([]);
      return;
    }
    setLoadingFiles(true);
    setError(null);
    const repoUrl = `https://github.com/${selRepo}`;
    fetch(`/api/git/tree?repoUrl=${encodeURIComponent(repoUrl)}`)
      .then(res => {
        if (!res.ok) throw res;
        return res.json() as Promise<TreeNode[]>;
      })
      .then(data => {
        setFiles(data.filter(n => n.type === 'blob'));
      })
      .catch(async res => {
        const err = await (res.json?.() || {}).error;
        setError(err || 'Erreur lors de la récupération des fichiers');
      })
      .finally(() => setLoadingFiles(false));
  }, [selRepo]);

  return (
    <div style={{ padding: 20 }}>
      <h1>Export de fichiers GitHub</h1>

      {loadingRepos && <p>Chargement des dépôts…</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loadingRepos && !error && (
        <RepoSelector
          repos={repos}
          selected={selRepo}
          onSelect={r => setSelRepo(r)}
        />
      )}

      {loadingFiles && <p>Chargement des fichiers…</p>}

      {!loadingFiles && files.length > 0 && (
        <FileSelector
          files={files}
          selected={new Set(selPaths)}
          onChange={paths => setSelPaths(paths)}
        />
      )}

      {!loadingFiles && selRepo && (
        <ExportButton
          repoUrl={`https://github.com/${selRepo}`}
          paths={selPaths}
        />
      )}
    </div>
  );
};

export default RepoFileExporter;
