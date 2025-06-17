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