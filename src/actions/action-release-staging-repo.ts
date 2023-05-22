import core from "@actions/core";
import releaseStagingRepo from "../impl-release-staging-repo";

async function run(): Promise<void> {
    try {
        const baseUrl = core.getInput(INPUT_BASE_URL, { required: true });
        const username = core.getInput(INPUT_USERNAME, { required: true });
        const password = core.getInput(INPUT_PASSWORD, { required: true });

        const stagingRepositoryId = core.getInput(INPUT_STAGING_REPOSITORY_ID, { required: true });
        const description = core.getInput(INPUT_DESCRIPTION);
        const autoDrop = core.getBooleanInput(INPUT_AUTO_DROP, { required: true });

        await releaseStagingRepo({
            baseUrl: baseUrl,
            username: username,
            password: password,
            data: {
                description: description,
                stagedRepositoryIds: [stagingRepositoryId],
                autoDropAfterRelease: autoDrop
            }
        });

        core.info(`Successfully released staging repository (${stagingRepositoryId}).`);
    } catch (error) {
        core.setFailed(`${(error as any)?.message ?? error}`);
    }
}

// noinspection JSIgnoredPromiseFromCall
run();