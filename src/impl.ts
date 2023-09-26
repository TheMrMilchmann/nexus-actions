import fetch, {Response} from "node-fetch";
import * as core from "@actions/core";

export interface NexusRequest<T> {
    baseUrl: string,
    username: string,
    password: string,
    timeoutMs?: number
    data: T
}

export interface NexusDTO<T> {
    data: T
}

export default async function nexusRequest<S>(
    method: string,
    path: string,
    request: NexusRequest<any>
): Promise<S> {
    const controller = new AbortController();
    const timeout = setTimeout(() => {
        core.info("Request timeout exceeded. Signalling abort...");
        controller.abort();
    }, request.timeoutMs ?? 45_000);

    const payload: NexusDTO<any> = {
        data: request.data
    };

    const href = new URL(path, request.baseUrl).href;
    let response: Response;

    try {
        response = await fetch(href, {
            method: method,
            headers: {
                "Authorization": "Basic " + Buffer.from(request.username + ":" + request.password).toString("base64"),
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: (method == "GET" || method == "HEAD") ? undefined : JSON.stringify(payload),
            // @ts-ignore
            signal: controller.signal
        });
    } catch (e) {
        throw new Error(`Failed to call Nexus API [url=${href}]`, { cause: e });
    } finally {
        clearTimeout(timeout);
    }

    if (!response.ok) {
        throw new Error(`Nexus API request was unsuccessful. Nexus returned ${response.status} (${response.statusText}) [url=${href}].`);
    }

    let responseText = await response.text();

    if (responseText) {
        return (JSON.parse(responseText) as S);
    } else {
        return undefined as S;
    }
}