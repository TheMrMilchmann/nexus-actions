import * as core from "@actions/core";
import * as constants from "../constants";
import releaseStagingRepo from "../impl-release-staging-repo";

async function run(): Promise<void> {
    try {
        const baseUrl = core.getInput(constants.INPUT_BASE_URL, { required: true });
        const username = core.getInput(constants.INPUT_USERNAME, { required: true });
        const password = core.getInput(constants.INPUT_PASSWORD, { required: true });

        const stagingRepositoryId = core.getInput(constants.INPUT_STAGING_REPOSITORY_ID, { required: true });
        const description = core.getInput(constants.INPUT_DESCRIPTION);
        const autoDrop = core.getBooleanInput(constants.INPUT_AUTO_DROP, { required: true });

        if (stagingRepositoryId.length == 0) {
            core.setFailed("Staging repository ID may not be empty");
            return;
        }

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