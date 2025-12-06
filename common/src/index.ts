import countriesJson from "./countries.json" with { type: "json" };

export interface Country {
	name: string;
	status: "required" | "waiver" | "ftz" | "reject";
}

export const countries = countriesJson as Record<string, Country>;

export * from "./api.ts";
