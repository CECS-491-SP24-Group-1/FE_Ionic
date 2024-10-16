import { HttpResponse } from "@ptypes/http_response";

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

/**
 * Swallows an Axios error and returns either the response error or
 * internal Axios error.
 * @param e The error to swallow
 * @returns The response from Axios
 */
export function swallowError(error: any): string {
	//Check if the error has a response section
	let rtext = "";
	if (error.response !== undefined) {
		const response: HttpResponse<null> = error.response.data;
		rtext = prettyError(response);
	} else {
		rtext = error.message;
	}
	return rtext;
}
