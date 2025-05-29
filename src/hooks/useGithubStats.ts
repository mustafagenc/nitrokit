'use client';

import { useState, useEffect } from 'react';

interface GitHubStats {
    stargazers_count: number;
    forks_count: number;
    license: string;
}

export function useGitHubStats(repoUrl: string) {
    const [stats, setStats] = useState<GitHubStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGitHubStats = async () => {
            try {
                setLoading(true);
                setError(null);
                const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
                if (!match) {
                    throw new Error('Invalid GitHub URL');
                }

                const [, owner, repo] = match;
                const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);

                if (!response.ok) {
                    throw new Error(`GitHub API error: ${response.status}`);
                }

                const data = await response.json();
                setStats({
                    stargazers_count: data.stargazers_count,
                    forks_count: data.forks_count,
                    license: data.license ? data.license.name : 'MIT License',
                });
            } catch (err) {
                console.error('Failed to fetch GitHub stats:', err);
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchGitHubStats();
    }, [repoUrl]);

    const formatNumber = (num: number) => {
        if (num >= 1000) {
            return `${(num / 1000).toFixed(1)}k`;
        }
        return num.toString();
    };

    return {
        stats,
        loading,
        error,
        formatNumber,
    };
}
