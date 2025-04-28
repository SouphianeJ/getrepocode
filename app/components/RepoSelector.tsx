// components/RepoSelector.tsx
'use client';
import React from 'react';
import type { Repo } from '@/app/types/git';

interface Props {
  repos: Repo[];
  selected: string;
  onSelect: (fullName: string) => void;
}

const RepoSelector: React.FC<Props> = ({ repos, selected, onSelect }) => (
  <div>
    <label htmlFor="repo">Dépôt : </label>
    <select
      id="repo"
      value={selected}
      onChange={e => onSelect(e.target.value)}
    >
      <option value="">— Choisissez —</option>
      {repos.map(r => (
        <option key={r.full_name} value={r.full_name}>
          {r.full_name}
        </option>
      ))}
    </select>
  </div>
);

export default RepoSelector;
