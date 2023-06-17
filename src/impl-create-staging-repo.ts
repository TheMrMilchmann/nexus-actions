import nexusRequest, {NexusRequest} from "./impl";

export interface CreateStagingRepoRequestDTO {
    description: string
}

export interface CreateStagingRepoResponseDTO {
    stagedRepositoryId: string
}

export default async function createStagingRepo(
    stagingProfileId: string,
    request: NexusRequest<CreateStagingRepoRequestDTO>
): Promise<CreateStagingRepoResponseDTO> {
    if (stagingProfileId.length == 0) {
        throw new Error("Staging profile ID may not be empty");
    }

    return await nexusRequest<CreateStagingRepoResponseDTO>(
        `/service/local/staging/profiles/${stagingProfileId}/start`,
        request
    );
}