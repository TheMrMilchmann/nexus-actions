import core from "@actions/core";
import createStagingRepo from "../impl-create-staging-repo";

async function run(): Promise<void> {
    try {
        const baseUrl = core.getInput(INPUT_BASE_URL, { required: true });
        const username = core.getInput(INPUT_USERNAME, { required: true });
        const password = core.getInput(INPUT_PASSWORD, { required: true });

        const stagingProfileId = core.getInput(INPUT_STAGING_PROFILE_ID, { required: true });
        const description = core.getInput(INPUT_DESCRIPTION);

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
        core.setOutput(OUTPUT_STAGING_REPOSITORY_ID, response.stagedRepositoryId);
    } catch (error) {
        core.setFailed(`${(error as any)?.message ?? error}`);
    }
}

// noinspection JSIgnoredPromiseFromCall
run();