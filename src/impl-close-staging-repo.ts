import nexusRequest, {NexusRequest} from "./impl";
import * as core from "@actions/core";

export interface CloseStagingRepoRequestDTO {
    stagedRepositoryIds: string[],
    description: string
}

interface RepositoryStateResponseDTO {
    profileId: string,
    profileName: string,
    profileType: string,
    repositoryId: string,
    type: string,
    policy: string,
    userId: string,
    userAgent: string,
    ipAddress: string,
    repositoryURI: string,
    created: string,
    createdDate: string,
    createdTimestamp: number,

    transitioning: boolean
}

export default async function closeStagingRepo(
    request: NexusRequest<CloseStagingRepoRequestDTO>
): Promise<void> {
    await nexusRequest<void>(
        "/service/local/staging/bulk/close",
        request
    );

    const transitionStartTime = Date.now();

    let isClosed = request.data.stagedRepositoryIds.map(() => false);
    let wasTransitioning = request.data.stagedRepositoryIds.map(() => false);

    do {
        await new Promise(r => setTimeout(r, 10_000));

        await Promise.all(request.data.stagedRepositoryIds.map((stagingRepositoryId, index) => {
            if (isClosed[index]) {
                return new Promise(() => {});
            } else {
                return nexusRequest<RepositoryStateResponseDTO>(
                    `/service/local/staging/repository/${stagingRepositoryId}`,
                    {
                        baseUrl: request.baseUrl,
                        username: request.username,
                        password: request.password,
                        data: {}
                    }
                ).then(state => {
                    if (state.transitioning && !wasTransitioning[index]) {
                        wasTransitioning[index] = true;
                        core.debug(`Repository (${stagingRepositoryId}) is now transitioning.`);
                    }

                    if (state.type == "closed") {
                        isClosed[index] = true;
                        core.debug(`Repository (${stagingRepositoryId}) is now closed.`);
                    }
                });
            }
        }));

        if (isClosed.every(it => it)) {
            break;
        }
    } while ((Date.now() - transitionStartTime) < (5 * 60 * 1000));
}