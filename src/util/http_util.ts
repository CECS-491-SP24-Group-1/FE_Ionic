/**
 * Emits an API error as a pretty string.
 * @param resp The error response to emit.
 * @returns The error response pretty printed as a string
 */
export function prettyError(resp: HttpResponse<any>): string {
	let etext = resp.status;
	if (resp.errors) {
		etext = resp.errors.length > 1 ? `[${resp.errors.join(", ")}]` : resp.errors[0];
	}
	return `<${resp.code}> ${etext}`;
}
