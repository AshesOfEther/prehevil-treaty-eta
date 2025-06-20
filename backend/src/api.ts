import { H3, H3Event, readBody } from "h3";
import { ApiAttestRequest, ApiAttestResponse, ApiErrorResponse, countries } from "prehevil-treaty-eta-common";

type ApiResponse<T> = Promise<T | ApiErrorResponse>;

const api = new H3();

api.post("/attest", async (event): ApiResponse<ApiAttestResponse> => {
	const body = await readBody(event) as ApiAttestRequest;

	const issuingAuthority = body.passport.issuingAuthority;

	console.log(body);

	if (!Object.hasOwn(countries, issuingAuthority)) {
		event.res.status = 400 // Bad Request
		return {
			error: `Issuing authority '${issuingAuthority}' was specified, but it does not exist`
		};
	}

	const country = countries[issuingAuthority];

	switch (country.status) {
		case "required":
			return {
				accepted: false,
				reason: "none"
			};
		case "ftz":
			return {
				accepted: true,
				reason: "ftz"
			};
		case "waiver":
			return {
				accepted: true,
				reason: "waiver"
			};
		case "reject": {
			return {
				accepted: false,
				reason: "other"
			};
		}
	}
});

export default api;
