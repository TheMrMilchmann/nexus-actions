import nexusRequest, {NexusRequest} from "./impl";

interface ReleaseStagingRepoRequestDTO {
    description: string,
    stagedRepositoryIds: string[],
    autoDropAfterRelease: boolean
}

export default async function releaseStagingRepo(
    request: NexusRequest<ReleaseStagingRepoRequestDTO>
): Promise<void> {
    return await nexusRequest(
        "POST",
        "/service/local/staging/bulk/promote",
        request
    );
}