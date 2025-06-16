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
import fetchMock, {enableFetchMocks} from "jest-fetch-mock";
enableFetchMocks();

import dropStagingRepo from "../src/impl-drop-staging-repo";

beforeEach(() => {
    fetchMock.resetMocks();
    jest.clearAllMocks();
});

afterEach(() => {
    expect(fetchMock.mock.calls[0][0]).toEqual("https://example.com/service/local/staging/bulk/drop");
    expect(fetchMock).toHaveBeenCalledTimes(1);
});

test("Success", async () => {
    fetchMock.mockResponse(
        "",
        {
            status: 200
        }
    );

    await dropStagingRepo(
        {
            baseUrl: "https://example.com",
            username: "user",
            password: "pass",
            data: {
                stagedRepositoryIds: ["foobar"],
                description: "Some random description"
            }
        }
    );
});

test("Unauthorized", async () => {
    fetchMock.mockResponse(
        "",
        {
            status: 401
        }
    );

    await expect(async () => {
        await dropStagingRepo(
            {
                baseUrl: "https://example.com",
                username: "user",
                password: "pass",
                data: {
                    stagedRepositoryIds: ["foobar"],
                    description: "Some random description"
                }
            }
        );
    }).rejects.toThrow();
});