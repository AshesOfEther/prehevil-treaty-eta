import type { ApiApplyRequest, ApiApplyResponse, ApiErrorResponse, ApiLookupResponse } from "prehevil-treaty-eta-common";

const apiBase = import.meta.env.VITE_API_BASE ?? "http://localhost:3000";

export async function apply(body: ApiApplyRequest): Promise<ApiApplyResponse> {
	return await apiRequest("POST", "/apply", body) as ApiApplyResponse;
}

export async function lookup(issuingAuthority: string, passportNumber: string): Promise<ApiLookupResponse> {
	return await apiRequest("GET", `/lookup?issuingAuthority=${issuingAuthority}&passportNumber=${passportNumber}`) as ApiLookupResponse;
}

async function apiRequest(method: string, path: string, body?: any): Promise<unknown> {
	const response = await fetch(apiBase + path, {
		method,
		headers: {
			"Content-Type": "application/json"
		},
		body: body != null ? JSON.stringify(body) : null
	});
	if (response.ok) {
		return await response.json();
	} else {
		throw new Error("API request returned error: " + await response.text());
	}
}
