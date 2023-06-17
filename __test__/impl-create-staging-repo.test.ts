import fetchMock, {enableFetchMocks} from "jest-fetch-mock";
enableFetchMocks();

import createStagingRepo from "../src/impl-create-staging-repo";

beforeEach(() => {
    fetchMock.resetMocks();
    jest.clearAllMocks();
});

afterEach(() => {
    expect(fetchMock.mock.calls[0][0]).toEqual("https://example.com/service/local/staging/profiles/foo/start");
    expect(fetchMock).toBeCalledTimes(1);
});

test("Success", async () => {
    fetchMock.mockResponse(
        JSON.stringify({
            data: {
                stagedRepositoryId: "foobar"
            }
        }),
        {
            status: 200
        }
    );

    let res = await createStagingRepo(
        "foo",
        {
            baseUrl: "https://example.com",
            username: "user",
            password: "pass",
            data: {
                description: "Some random description"
            }
        }
    );

    expect(res.stagedRepositoryId).toEqual("foobar");
});

test("Unauthorized", async () => {
    fetchMock.mockResponse(
        "",
        {
            status: 401
        }
    );

    expect(async () => {
        await createStagingRepo(
            "foo",
            {
                baseUrl: "https://example.com",
                username: "user",
                password: "pass",
                data: {
                    description: "Some random description"
                }
            }
        );
    }).rejects.toThrowError();
});