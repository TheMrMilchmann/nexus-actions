import core from "@actions/core";
import nexusRequest, {NexusDTO} from "./impl";

interface DropRequestDTO {
    description: string,
    stagedRepositoryIds: string[]
}

async function dropStagingRepo(): Promise<void> {
    try {
        const username = core.getInput(INPUT_USERNAME, { required: true });
        const password = core.getInput(INPUT_PASSWORD, { required: true });
        const baseURL = core.getInput(INPUT_BASE_URL, { required: true });

        const stagingRepositoryID = core.getInput(INPUT_STAGING_REPOSITORY_ID, { required: true });
        const description = core.getInput(INPUT_DESCRIPTION);

        const requestData: NexusDTO<DropRequestDTO> = {
            data: {
                description: description,
                stagedRepositoryIds: [stagingRepositoryID]
            }
        };

        await nexusRequest(
            new URL(`/service/local/staging/bulk/drop`, baseURL),
            username,
            password,
            requestData
        );

        core.info(`Successfully dropped staging repository (${stagingRepositoryID}).`);
    } catch (error) {
        core.setFailed(`${(error as any)?.message ?? error}`);
    }
}

// noinspection JSIgnoredPromiseFromCall
dropStagingRepo();