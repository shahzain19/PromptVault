import { Octokit } from "octokit";

export async function createGithubIssue(token: string, owner: string, repo: string, title: string, body: string) {
    const octokit = new Octokit({ auth: token });
    try {
        const { data } = await octokit.rest.issues.create({
            owner,
            repo,
            title,
            body,
        });
        return data;
    } catch (error: any) {
        console.error("GitHub Error:", error);
        throw new Error(error.message || "Failed to create GitHub issue");
    }
}

export async function getRepoInfo(token: string, owner: string, repo: string) {
    const octokit = new Octokit({ auth: token });
    try {
        const { data } = await octokit.rest.repos.get({
            owner,
            repo,
        });
        return data;
    } catch (error: any) {
        console.error("GitHub Error:", error);
        throw new Error(error.message || "Failed to fetch repository info");
    }
}
