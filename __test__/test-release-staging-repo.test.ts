import fetchMock, {enableFetchMocks} from "jest-fetch-mock";
enableFetchMocks();

import releaseStagingRepo from "../src/impl-release-staging-repo";

beforeEach(() => {
    fetchMock.resetMocks();
    jest.clearAllMocks();
});

afterEach(() => {
    expect(fetchMock.mock.calls[0][0]).toEqual("https://example.com/service/local/staging/bulk/promote");
    expect(fetchMock).toHaveBeenCalledTimes(1);
})

test("Success", async () => {
    fetchMock.mockResponse(
        "",
        {
            status: 200
        }
    );

    await releaseStagingRepo(
        {
            baseUrl: "https://example.com",
            username: "user",
            password: "pass",
            data: {
                stagedRepositoryIds: ["foobar"],
                description: "Some random description",
                autoDropAfterRelease: true
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
        await releaseStagingRepo(
            {
                baseUrl: "https://example.com",
                username: "user",
                password: "pass",
                data: {
                    stagedRepositoryIds: ["foobar"],
                    description: "Some random description",
                    autoDropAfterRelease: false
                }
            }
        );
    }).rejects.toThrow();
});