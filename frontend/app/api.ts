import type { ApiApplyRequest, ApiApplyResponse, ApiErrorResponse } from "prehevil-treaty-eta-common";

const API_BASE = "http://localhost:3000";

export async function apply(body: ApiApplyRequest): Promise<ApiApplyResponse> {
	return await apiRequest("POST", "/apply", body) as ApiApplyResponse;
}

async function apiRequest(method: string, path: string, body?: any): Promise<unknown> {
	const response = await fetch(API_BASE + path, {
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
