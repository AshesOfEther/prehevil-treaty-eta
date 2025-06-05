import countriesJson from "@/../../countries.json";

interface Country {
	name: string;
	status: "required" | "waiver" | "ftz" | "reject";
}

export const countries = countriesJson as Record<string, Country>;
