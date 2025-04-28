// /app/api/github/repos/route.ts
import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

export async function GET() {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  try { 
    const { data } = await octokit.rest.repos.listForAuthenticatedUser({
      per_page: 100,
    }); 
    
    const repos = data.map(repo => ({
      name: repo.name,
      full_name: repo.full_name,
      private: repo.private,
    }));
    return NextResponse.json(repos);
  } catch (error: any) {
    console.error('Error fetching repos:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch repos' },
      { status: 500 }
    );
  }
}
