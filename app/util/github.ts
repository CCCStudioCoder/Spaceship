import {App, Octokit} from "octokit";
import HttpStatusCode from "@/app/util/status-code";

const github = new App({
    appId: process.env.GITHUB_APP_ID!,
    privateKey: process.env.GITHUB_APP_KEY!,
});

export default github;

type GitHubResource = Awaited<
    ReturnType<InstanceType<typeof Octokit>["rest"]["repos"]["getContent"]>
>["data"];

export function resourceJSON(resource: GitHubResource): string[]|string|Response {
    if(Array.isArray(resource)) {
        return resource.map(item => item.name);
    } else if(resource.type === "file") {
        return Buffer.from(resource.content, resource.encoding as BufferEncoding).toString("utf-8");
    } else {
        return Response.json({error: "Submodules and symlinks are not valid translation objects"}, {status: HttpStatusCode.NOT_ACCEPTABLE});
    }
}

export async function branchExists(
    owner: string,
    repo: string,
    branch: string,
    installation: number|Octokit
) {
    try {
        const octokit = installation instanceof Octokit
            ? installation
            : await github.getInstallationOctokit(installation);

        await octokit.rest.repos.getBranch({
            owner: owner,
            repo: repo,
            branch: branch,
        });

        return true
    } catch (e) {
        return false
    }
}

/**
 * Returns a Promise containing whether the branch exists.
 */
export async function createBranchIfNotExists(owner: string, repo: string, branch: string, octokit: Octokit): Promise<boolean> {
    if(!await branchExists(owner, repo, branch, octokit)) {
        const commit = await octokit.rest.repos.listCommits({
            owner,
            repo,
        }).then(res => res.data[0].sha);

        await octokit.rest.git.createRef({
            owner,
            repo,
            ref: `refs/heads/${branch}`,
            sha: commit
        });

        return false;
    }
    return true;
}