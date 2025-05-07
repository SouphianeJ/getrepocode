// /app/api/github/files/route.ts
import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

function parseGitHubUrl(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname !== 'github.com') return null;
    const [owner, repo] = u.pathname.slice(1).split('/');
    return owner && repo ? { owner, repo: repo.replace(/\.git$/, '') } : null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const { repoUrl, paths, branch} = await request.json();
  if (!repoUrl || !Array.isArray(paths)) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }
  const info = parseGitHubUrl(repoUrl);
  if (!info) {
    return NextResponse.json({ error: 'Invalid repoUrl' }, { status: 400 });
  }

  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  try {
    const parts: string[] = [];
    for (const path of paths) {
      const res = await octokit.rest.repos.getContent({
        owner: info.owner,
        repo: info.repo,
        path,
        ref: branch,
      });
      if ('content' in res.data && res.data.content) {
        const content = Buffer.from(res.data.content, 'base64').toString('utf-8');
        parts.push(`// File: ${path}\n${content}`);
      }
    }
    const result = parts.join('\n\n');
    return new Response(result, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  } catch (err: any) {
    console.error('Error fetching file contents:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to fetch file contents' },
      { status: 500 }
    );
  }
}
