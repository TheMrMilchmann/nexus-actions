/*
 * Copyright (c) 2023-2025 Leon Linhart
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
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
        "POST",
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
                    "GET",
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