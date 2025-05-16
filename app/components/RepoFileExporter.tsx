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
  const [branches, setBranches] = useState<string[]>([]); // Nouvel état pour les branches
  const [selBranch, setSelBranch] = useState(''); // Nouvel état pour la branche sélectionnée
  const [files, setFiles] = useState<TreeNode[]>([]);
  const [selPaths, setSelPaths] = useState<string[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [loadingBranches, setLoadingBranches] = useState(false); // Nouvel état de chargement
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
        const errText = await res.text();
        try {
          const errJson = JSON.parse(errText);
          setError(errJson.error || 'Erreur lors du chargement des dépôts');
        } catch {
          setError(res.statusText || 'Erreur lors du chargement des dépôts');
        }
      })
      .finally(() => setLoadingRepos(false));
  }, []);

  // 2) Charger la liste des branches quand on choisit un repo
  useEffect(() => {
    if (!selRepo) {
      setBranches([]);
      setSelBranch('');
      setFiles([]);
      setSelPaths([]);
      return;
    }
    setLoadingBranches(true);
    setError(null);
    const repoUrl = `https://github.com/${selRepo}`;
    fetch(`/api/git/branches?repoUrl=${encodeURIComponent(repoUrl)}`)
      .then(res => {
        if (!res.ok) throw res;
        return res.json() as Promise<string[]>;
      })
      .then(data => {
        setBranches(data);
        if (data.includes('main')) {
          setSelBranch('main');
        } else if (data.length > 0) {
          setSelBranch(data[0]); // Sélectionne la première branche par défaut
        } else {
          setSelBranch('');
        }
      })
      .catch(async res => {
        const errText = await res.text();
        try {
          const errJson = JSON.parse(errText);
          setError(errJson.error || 'Erreur lors du chargement des branches');
        } catch {
          setError(res.statusText || 'Erreur lors du chargement des branches');
        }
        setBranches([]);
        setSelBranch('');
      })
      .finally(() => setLoadingBranches(false));
  }, [selRepo]);


  // 3) Charger l’arborescence quand on choisit un repo ET une branche
  useEffect(() => {
    if (!selRepo || !selBranch) {
      setFiles([]);
      setSelPaths([]);
      return;
    }
    setLoadingFiles(true);
    setError(null);
    const repoUrl = `https://github.com/${selRepo}`;
    fetch(`/api/git/tree?repoUrl=${encodeURIComponent(repoUrl)}&branch=${encodeURIComponent(selBranch)}`)
      .then(res => {
        if (!res.ok) throw res;
        return res.json() as Promise<TreeNode[]>;
      })
      .then(data => {
        setFiles(data.filter(n => n.type === 'blob'));
        setSelPaths([]); // Réinitialiser les chemins sélectionnés lors du changement de branche/repo
      })
      .catch(async res => {
        const errText = await res.text();
        try {
          const errJson = JSON.parse(errText);
          setError(errJson.error || 'Erreur lors de la récupération des fichiers');
        } catch {
          setError(res.statusText || 'Erreur lors de la récupération des fichiers');
        }
      })
      .finally(() => setLoadingFiles(false));
  }, [selRepo, selBranch]);

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#fff',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            textShadow: '0 0 5px #0fa',
            marginBottom: '20px'
          }}>Export de fichiers GitHub</h1>

      {loadingRepos && <p>Chargement des dépôts…</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loadingRepos && !error && repos.length > 0 && (
        <RepoSelector
          repos={repos}
          selected={selRepo}
          onSelect={r => {
            setSelRepo(r);
            // Réinitialiser la branche et les fichiers lors du changement de dépôt
            setSelBranch('');
            setBranches([]);
            setFiles([]);
            setSelPaths([]);
          }}
        />
      )}

      {selRepo && loadingBranches && <p>Chargement des branches…</p>}
      
      {selRepo && !loadingBranches && branches.length > 0 && (
        <div style={{ margin: '1em 0' }}>
          <label htmlFor="branch">Branche : </label>
          <select
            id="branch"
            value={selBranch}
            onChange={e => {
              setSelBranch(e.target.value);
              setFiles([]); // Réinitialiser les fichiers lors du changement de branche
              setSelPaths([]);
            }}
            disabled={loadingBranches || branches.length === 0}
          >
            <option value="">— Choisissez une branche —</option>
            {branches.map(b => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      )}
      
      {loadingFiles && <p>Chargement des fichiers…</p>}

      {!loadingFiles && files.length > 0 && (
        <FileSelector
          files={files}
          selected={new Set(selPaths)}
          onChange={paths => setSelPaths(paths)}
        />
      )}

      {!loadingFiles && selRepo && selBranch && (
        <ExportButton
          repoUrl={`https://github.com/${selRepo}`} // L'URL du repo reste la même
          paths={selPaths} // Les paths sont relatifs à la branche sélectionnée
          branch={selBranch} // Passer la branche sélectionnée
        />
      )}
    </div>
  );
};

export default RepoFileExporter;