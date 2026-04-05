import { H3, H3Event, handleCors, readBody } from "h3";
import { type ApiApplyRequest, type ApiApplyResponse, type ApiAttestRequest, type ApiAttestResponse, type ApiErrorResponse, type ApiLookupResponse, countries } from "prehevil-treaty-eta-common";
import { attest } from "./attest.ts";
import prisma from "./prisma.ts";

type ApiResponse<T> = Promise<T | ApiErrorResponse>;

const api = new H3({
	onError(error, event) {
		console.error(error);
	},
});

api.use((event) => {
	if (handleCors(event, { origin: "*" }) !== false) {
		return "";
	}
});

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

	return await attest(issuingAuthority, body.passport.passportNumber);
});

api.post("/apply", async (event): ApiResponse<ApiApplyResponse> => {
	const body = await readBody(event) as ApiApplyRequest;

	const passport = body.passport;
	const issuingAuthority = passport.issuingAuthority;

	if (!Object.hasOwn(countries, issuingAuthority)) {
		event.res.status = 400 // Bad Request
		return {
			error: `Issuing authority '${issuingAuthority}' was specified, but it does not exist`
		};
	}

	const country = countries[issuingAuthority];

	if (country.status == "ftz" || country.status == "waiver") {
		event.res.status = 400; // Bad Request
		return {
			error: `Passport holders from '${issuingAuthority}' cannot apply for an ETA, as they do not require one`
		};
	}

	// The client can fake this, but then the holder will still be rejected at the gate.
	if (passport.isExpired) {
		return {
			accepted: false,
			reason: "passportExpired"
		};
	}

	const answers = body.answers;
	if (country.status == "reject" || answers.hasBeenDeported || answers.hasCriminalConviction || answers.hasTuberculosis) {
		return {
			accepted: false,
			reason: "other"
		};
	}

	const passportNumber = passport.passportNumber;

	const existingEta = await prisma.eta.findUnique({
		where: { passportNumber }
	});

	if (existingEta != null) {
		await prisma.eta.delete({ where: { passportNumber } });
	}

	await prisma.passport.upsert({
		where: { passportNumber },
		update: {},
		create: {
			passportNumber: passport.passportNumber,
			username: body.username,

			givenName: passport.givenName,
			familyName: passport.familyName,
			issuingAuthority: passport.issuingAuthority,
			nationality: passport.nationality,
			expiryDate: new Date(passport.expiryDate),
			dateOfBirth: new Date(passport.dateOfBirth),
			placeOfBirth: passport.placeOfBirth,
		}
	});

	const expiresAt = new Date();
	expiresAt.setUTCDate(expiresAt.getUTCDate() + 7);

	await prisma.eta.create({
		data: {
			expiresAt,
			passportNumber
		}
	});

	return {
		accepted: true,
		expiresAt: expiresAt.toISOString()
	};
});

api.get("/lookup", async (event): ApiResponse<ApiLookupResponse> => {
	const issuingAuthority = event.url.searchParams.get("issuingAuthority") ?? "";
	const passportNumber = event.url.searchParams.get("passportNumber") ?? "";

	if (!Object.hasOwn(countries, issuingAuthority)) {
		event.res.status = 400 // Bad Request
		return {
			error: `Issuing authority '${issuingAuthority}' was specified, but it does not exist`
		};
	}

	const canEnter = (await attest(issuingAuthority, passportNumber)).accepted;

	return { canEnter };
});

export default api;
