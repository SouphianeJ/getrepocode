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

  const repoInfo = parseGitHubUrl(repoUrl);
  if (!repoInfo) {
    return NextResponse.json({ error: 'Invalid GitHub URL' }, { status: 400 });
  }

  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

  try {
    const { data: branches } = await octokit.rest.repos.listBranches({
      owner: repoInfo.owner,
      repo: repoInfo.repo,
      per_page: 100, // Vous pouvez ajuster si nécessaire
    });
    return NextResponse.json(branches.map(branch => branch.name));
  } catch (err: any) {
    console.error('Error fetching branches:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to fetch branches' },
      { status: 500 }
    );
  }
}