import core from "@actions/core";
import nexusRequest from "./impl";

interface StartRequestDTO {
    description: string
}

interface StartResponseDTO {
    stagedRepositoryId: string
}

async function createStagingRepo(): Promise<void> {
    try {
        const username = core.getInput(INPUT_USERNAME, { required: true });
        const password = core.getInput(INPUT_PASSWORD, { required: true });
        const baseURL = core.getInput(INPUT_BASE_URL, { required: true });

        const stagingProfileID = core.getInput(INPUT_STAGING_PROFILE_ID, { required: true });
        const description = core.getInput(INPUT_DESCRIPTION);

        const data: StartRequestDTO = {
            description: description
        };

        const response = await nexusRequest<StartResponseDTO>(
            new URL(`/service/local/staging/profiles/${stagingProfileID}/start`, baseURL),
            username,
            password,
            data
        );

        core.info(`Successfully created staging repository (${response.stagedRepositoryId}).`);
        core.setOutput(OUTPUT_STAGING_REPOSITORY_ID, response.stagedRepositoryId);
    } catch (error) {
        core.setFailed(`${(error as any)?.message ?? error}`);
    }
}

// noinspection JSIgnoredPromiseFromCall
createStagingRepo();