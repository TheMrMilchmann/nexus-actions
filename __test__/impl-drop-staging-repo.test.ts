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