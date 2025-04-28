// /app/api/github/tree/route.ts
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const repoUrl = searchParams.get('repoUrl');
  if (!repoUrl) {
    return NextResponse.json({ error: 'Missing repoUrl parameter' }, { status: 400 });
  }
  const info = parseGitHubUrl(repoUrl);
  if (!info) {
    return NextResponse.json({ error: 'Invalid GitHub URL' }, { status: 400 });
  }

  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  try {
    const { data } = await octokit.rest.git.getTree({
      owner: info.owner,
      repo: info.repo,
      tree_sha: 'main',
      recursive: 'true',
    });
    return NextResponse.json(data.tree);
  } catch (err: any) {
    console.error('Error fetching tree:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to fetch tree' },
      { status: 500 }
    );
  }
}
