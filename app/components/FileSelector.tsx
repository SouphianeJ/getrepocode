'use client';
import React, { useCallback } from 'react';
import type { TreeNode } from '@/app/types/git';

interface Props {
  files: TreeNode[];
  selected: Set<string>;
  onChange: (paths: string[]) => void;
}

const FileSelector: React.FC<Props> = ({ files, selected, onChange }) => {
  const allPaths = files.map(f => f.path);
  const allSelected = selected.size === files.length;

  // Toggle un seul fichier
  const toggle = useCallback(
    (path: string, checked: boolean) => {
      const next = new Set(selected);
      checked ? next.add(path) : next.delete(path);
      onChange(Array.from(next));
    },
    [selected, onChange]
  );

  // Toggle "Tout sélectionner" / "Tout désélectionner"
  const toggleAll = useCallback(() => {
    onChange(allSelected ? [] : allPaths);
  }, [allSelected, allPaths, onChange]);

  return (
    <div style={{ margin: '1em 0' }}>
      <button onClick={toggleAll} className="button" style={{ marginBottom: 8 }}>
        {allSelected ? 'Tout désélectionner' : 'Tout sélectionner'}
      </button>
      <div style={{ maxHeight: 240, overflowY: 'auto', border: '1px solid #ddd', padding: 8 }}>
        {files.map(f => (
          <div key={f.path}>
            <label>
              <input
                type="checkbox"
                checked={selected.has(f.path)}
                onChange={e => toggle(f.path, e.target.checked)}
              />
              {f.path}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileSelector;