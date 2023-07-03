import * as core from "@actions/core";
import * as constants from "../constants";
import closeStagingRepo from "../impl-close-staging-repo";

async function run() {
    try {
        const username = core.getInput(constants.INPUT_USERNAME, { required: true });
        const password = core.getInput(constants.INPUT_PASSWORD, { required: true });
        const baseUrl = core.getInput(constants.INPUT_BASE_URL, { required: true });

        const stagingRepositoryId = core.getInput(constants.INPUT_STAGING_REPOSITORY_ID, { required: true });
        const description = core.getInput(constants.INPUT_DESCRIPTION);

        const transitionTimeout = parseInt(core.getInput(constants.INPUT_TRANSITION_TIMEOUT, { required: true }));

        if (stagingRepositoryId.length == 0) {
            core.setFailed("Staging repository ID may not be empty");
            return;
        }

        if (isNaN(transitionTimeout)) {
            core.setFailed(`Transition timeout is not a valid number: ${transitionTimeout}`);
            return;
        }

        await closeStagingRepo({
            baseUrl: baseUrl,
            username: username,
            password: password,
            data: {
                stagedRepositoryIds: [stagingRepositoryId],
                description: description
            }
        })

        core.info(`Successfully closed staging repository (${stagingRepositoryId}).`);
    } catch (error) {
        core.setFailed(`${(error as any)?.message ?? error}`);
    }
}

// noinspection JSIgnoredPromiseFromCall
run();