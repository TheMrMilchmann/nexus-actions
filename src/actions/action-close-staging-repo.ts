import core from "@actions/core";
import closeStagingRepo from "../impl-close-staging-repo";

async function run() {
    try {
        const username = core.getInput(INPUT_USERNAME, { required: true });
        const password = core.getInput(INPUT_PASSWORD, { required: true });
        const baseUrl = core.getInput(INPUT_BASE_URL, { required: true });

        const stagingRepositoryId = core.getInput(INPUT_STAGING_REPOSITORY_ID, { required: true });
        const description = core.getInput(INPUT_DESCRIPTION);

        const transitionTimeout = parseInt(core.getInput(INPUT_TRANSITION_TIMEOUT, { required: true }));

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