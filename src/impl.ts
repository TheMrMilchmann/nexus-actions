import fetch, {Response} from "node-fetch";
import core from "@actions/core";

export interface NexusRequest<T> {
    baseUrl: string,
    username: string,
    password: string,
    timeoutMs?: number
    data: T
}

interface NexusDTO<T> {
    data: T
}

export default async function nexusRequest<S>(
    path: string,
    request: NexusRequest<any>
): Promise<S> {
    const controller = new AbortController();
    const timeout = setTimeout(() => {
        core.info("Request timeout exceeded. Signalling abort...");
        controller.abort();
    }, request.timeoutMs ?? 5_000);

    const payload: NexusDTO<any> = {
        data: request.data
    };

    let response: Response;

    try {
        response = await fetch(new URL(path, request.baseUrl).href, {
            method: "POST",
            headers: {
                "Authorization": "Basic " + Buffer.from(request.username + ":" + request.password).toString("base64"),
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(payload),
            // @ts-ignore
            signal: controller.signal
        });
    } catch (e) {
        // @ts-ignore
        throw new Error("Failed to call Nexus API", { cause: e });
    } finally {
        clearTimeout(timeout);
    }

    if (!response.ok) {
        throw new Error(`Nexus API request was unsuccessful. Nexus returned ${response.status} (${response.statusText}).`);
    }

    let responseText = await response.text();

    if (responseText) {
        return (JSON.parse(responseText) as NexusDTO<S>).data
    } else {
        return undefined as S;
    }
}