import core from "@actions/core";
import nexusRequest, {NexusDTO} from "./impl";

interface PromoteRequestDTO {
    description: string,
    stagedRepositoryIds: string[],
    autoDropAfterRelease: boolean
}

async function promoteStagingRepo(): Promise<void> {
    try {
        const username = core.getInput(INPUT_USERNAME, { required: true });
        const password = core.getInput(INPUT_PASSWORD, { required: true });
        const baseURL = core.getInput(INPUT_BASE_URL, { required: true });

        const stagingRepositoryID = core.getInput(INPUT_STAGING_REPOSITORY_ID, { required: true });
        const description = core.getInput(INPUT_DESCRIPTION);
        const autoDrop = core.getBooleanInput(INPUT_AUTO_DROP, { required: true });

        const requestData: NexusDTO<PromoteRequestDTO> = {
            data: {
                description: description,
                stagedRepositoryIds: [stagingRepositoryID],
                autoDropAfterRelease: autoDrop
            }
        };

        await nexusRequest(
            new URL(`/service/local/staging/bulk/promote`, baseURL),
            username,
            password,
            requestData
        );

        core.info(`Successfully released staging repository (${stagingRepositoryID}).`);
    } catch (error) {
        core.setFailed(`${(error as any)?.message ?? error}`);
    }
}

// noinspection JSIgnoredPromiseFromCall
promoteStagingRepo();