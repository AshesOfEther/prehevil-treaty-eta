export function formatDate(date: string) {
	return new Date(date).toLocaleString("en-US", { dateStyle: "long", timeZone: "UTC" });
}
