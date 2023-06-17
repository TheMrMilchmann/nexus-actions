import fetchMock, {enableFetchMocks} from "jest-fetch-mock";
enableFetchMocks();

import closeStagingRepo from "../src/impl-close-staging-repo";

beforeEach(() => {
    fetchMock.resetMocks();
    jest.clearAllMocks();
});

afterEach(() => {
    expect(fetchMock.mock.calls[0][0]).toEqual("https://example.com/service/local/staging/bulk/close");
});

test("Success", async () => {
    fetchMock.mockResponseOnce(
        "",
        { status: 200 }
    );

    fetchMock.mockResponseOnce(
        JSON.stringify({
            data: {
                profileId: "string",
                profileName: "string",
                profileType: "string",
                repositoryId: "foobar",
                type: "closed",
                policy: "string",
                userId: "string",
                userAgent: "string",
                ipAddress: "string",
                repositoryURI: "string",
                created: "string",
                createdDate: "1970-01-01",
                createdTimestamp: 0,

                transitioning: false
            }
        }),
        { status: 200 }
    );

    await closeStagingRepo(
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

    expect(fetchMock).toBeCalledTimes(2);
}, 30_000);

test("Unauthorized", async () => {
    fetchMock.mockResponse(
        "",
        {
            status: 401
        }
    );

    expect(async () => {
        await closeStagingRepo(
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
    }).rejects.toThrowError();

    expect(fetchMock).toBeCalledTimes(1);
});