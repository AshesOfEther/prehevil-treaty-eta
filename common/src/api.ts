export interface Passport {
	givenName: string;
	familyName: string;
	issuingAuthority: string;
	nationality: string;
	expiryDate: string;
	dateOfBirth: string;
	placeOfBirth: string;
	isExpired: boolean;
	passportNumber: string;
}

export interface ApiErrorResponse {
	error: string;
}

export interface ApiApplyRequest {
	passport: Passport;
	username: string;
	hasCriminalConviction: boolean;
	hasBeenDeported: boolean;
	hasTuberculosis: boolean;
}

export interface ApiApplyAcceptResponse {
	accepted: true;
	expiresAt: string;
}

export interface ApiApplyRejectResponse {
	accepted: false;
	reason: "passportExpired" | "other";
}

export type ApiApplyResponse = ApiApplyAcceptResponse | ApiApplyRejectResponse;

export interface ApiAttestRequest {
	passport: Passport;
}

export interface ApiAttestAcceptResponse {
	accepted: true;
	reason: ApiAttestAcceptReason;
}

export type ApiAttestAcceptReason = "eta" | "waiver" | "ftz";

export interface ApiAttestRejectResponse {
	accepted: false;
	reason: ApiAttestRejectReason;
}

export type ApiAttestRejectReason = "none" | "other";

export type ApiAttestResponse = ApiAttestAcceptResponse | ApiAttestRejectResponse;
