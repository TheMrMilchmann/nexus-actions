import * as core from "@actions/core";
import * as constants from "../constants";
import dropStagingRepo from "../impl-drop-staging-repo";

async function run(): Promise<void> {
    try {
        const baseUrl = core.getInput(constants.INPUT_BASE_URL, { required: true });
        const username = core.getInput(constants.INPUT_USERNAME, { required: true });
        const password = core.getInput(constants.INPUT_PASSWORD, { required: true });

        const stagingRepositoryId = core.getInput(constants.INPUT_STAGING_REPOSITORY_ID, { required: true });
        const description = core.getInput(constants.INPUT_DESCRIPTION);

        if (stagingRepositoryId.length == 0) {
            core.setFailed("Staging repository ID may not be empty");
            return;
        }

        await dropStagingRepo({
            baseUrl: baseUrl,
            username: username,
            password: password,
            data: {
                description: description,
                stagedRepositoryIds: [stagingRepositoryId]
            }
        });

        core.info(`Successfully dropped staging repository (${stagingRepositoryId}).`);
    } catch (error) {
        core.setFailed(`${(error as any)?.message ?? error}`);
    }
}

// noinspection JSIgnoredPromiseFromCall
run();