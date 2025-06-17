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
import * as core from "@actions/core";
import * as constants from "../constants";
import releaseStagingRepo from "../impl-release-staging-repo";

async function run(): Promise<void> {
    try {
        const baseUrl = core.getInput(constants.INPUT_BASE_URL, { required: true });
        const username = core.getInput(constants.INPUT_USERNAME, { required: true });
        const password = core.getInput(constants.INPUT_PASSWORD, { required: true });

        const stagingRepositoryId = core.getInput(constants.INPUT_STAGING_REPOSITORY_ID, { required: true });
        const description = core.getInput(constants.INPUT_DESCRIPTION);
        const autoDrop = core.getBooleanInput(constants.INPUT_AUTO_DROP, { required: true });

        if (stagingRepositoryId.length == 0) {
            core.setFailed("Staging repository ID may not be empty");
            return;
        }

        await releaseStagingRepo({
            baseUrl: baseUrl,
            username: username,
            password: password,
            data: {
                description: description,
                stagedRepositoryIds: [stagingRepositoryId],
                autoDropAfterRelease: autoDrop
            }
        });

        core.info(`Successfully released staging repository (${stagingRepositoryId}).`);
    } catch (error) {
        core.setFailed(`${(error as any)?.message ?? error}`);
    }
}

// noinspection JSIgnoredPromiseFromCall
run();