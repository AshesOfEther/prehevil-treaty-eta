import type { Passport } from "prehevil-treaty-eta-common";

const BORDERKIT_API_BASE = "https://borderkit.aircs.racing/api";

export async function beam(username: string, passportNumber: string): Promise<BeamSession> {
	const codeResponse = await fetch(BORDERKIT_API_BASE + "/beam", {
		method: "POST",
		body: JSON.stringify({
			passportNumber,
			playerName: username,
			serviceName: "Prehevil Treaty ETA"
		})
	});

	const code = codeResponse.headers.get("X-BorderKit-Beam-Code") as string;

	const abortController = new AbortController();
	const result = fetch(BORDERKIT_API_BASE + `/beam/${code}`, {
		signal: abortController.signal,

	})
		.catch()
		.then<BeamResult>(async passportResponse => {
			if (!passportResponse.ok) {
				return {
					status: "error",
					error: passportResponse.headers.get("X-BorderKit-Beam-Error") as BeamErrorCode
				}
			}

			return {
				status: "success",
				passport: (await passportResponse.json()) as Passport
			}
		});

	return {
		code,
		promise: result,
		abortController: abortController
	};
}

export interface BeamSession {
	code: string,
	promise: Promise<BeamResult>,
	abortController: AbortController,
}

export type BeamResult = BeamSuccess | BeamError;

export interface BeamSuccess {
	status: "success",
	passport: Passport
}

export interface BeamError {
	status: "error",
	error: BeamErrorCode
}

export type BeamErrorCode = "timeout" | "bad-details";
