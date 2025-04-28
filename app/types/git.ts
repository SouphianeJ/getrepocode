// /app/types/git.ts
export interface Repo {
    name: string;
    full_name: string;
    private: boolean;
  }
  
  export interface TreeNode {
    path: string;
    mode: string;
    type: 'blob' | 'tree';
    sha: string;
    url: string;
  }
  