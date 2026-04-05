import { countries, type ApiAttestResponse, type Passport } from "prehevil-treaty-eta-common";
import prisma from "./prisma.ts";

export async function attest(issuingAuthority: keyof typeof countries, passportNumber: string): Promise<ApiAttestResponse> {
	const country = countries[issuingAuthority];

	switch (country.status) {
		case "required":
			const eta = await prisma.eta.findUnique({ where: { passportNumber } });
			if (eta == null)
				return {
					accepted: false,
					reason: "none"
				};
			if (Date.now() >= eta.expiresAt.valueOf())
				return {
					accepted: false,
					reason: "none"
				};
			return {
				accepted: true,
				reason: "eta"
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
}
