import { H3, H3Event, readBody } from "h3";
import { ApiApplyRequest, ApiApplyResponse, ApiAttestRequest, ApiAttestResponse, ApiErrorResponse, countries } from "prehevil-treaty-eta-common";
import { PrismaClient } from "@prisma/client";

type ApiResponse<T> = Promise<T | ApiErrorResponse>;

const prisma = new PrismaClient();

const api = new H3({
	onError(error, event) {
		console.error(error);
	},
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

	if (country.status == "reject" || body.hasBeenDeported || body.hasCriminalConviction || body.hasTuberculosis) {
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
} );

export default api;
