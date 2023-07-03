import * as core from "@actions/core";
import * as constants from "../constants";
import createStagingRepo from "../impl-create-staging-repo";

async function run(): Promise<void> {
    try {
        const baseUrl = core.getInput(constants.INPUT_BASE_URL, { required: true });
        const username = core.getInput(constants.INPUT_USERNAME, { required: true });
        const password = core.getInput(constants.INPUT_PASSWORD, { required: true });

        const stagingProfileId = core.getInput(constants.INPUT_STAGING_PROFILE_ID, { required: true });
        const description = core.getInput(constants.INPUT_DESCRIPTION);

        const response = await createStagingRepo(
            stagingProfileId,
            {
                baseUrl: baseUrl,
                username: username,
                password: password,
                data: {
                    description: description
                }
            }
        );

        core.info(`Successfully created staging repository (${response.stagedRepositoryId}).`);
        core.setOutput(constants.OUTPUT_STAGING_REPOSITORY_ID, response.stagedRepositoryId);
    } catch (error) {
        core.setFailed(`${(error as any)?.message ?? error}`);
    }
}

// noinspection JSIgnoredPromiseFromCall
run();