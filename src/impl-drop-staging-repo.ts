import nexusRequest, {NexusRequest} from "./impl";

export interface DropStagingRepoRequestDTO {
    description: string,
    stagedRepositoryIds: string[]
}

export default async function dropStagingRepo(
    request: NexusRequest<DropStagingRepoRequestDTO>
): Promise<void> {
    return await nexusRequest<void>(
        "POST",
        "/service/local/staging/bulk/drop",
        request
    );
}