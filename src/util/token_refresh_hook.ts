//https://stackoverflow.com/a/53256982

import axios from "axios";
import Cookies from "js-cookie";
import { HttpResponse } from "@ptypes/http_response";
import { prettyError } from "./http_util";

//Sets the maximum delta between the current time and the expiry time before auto-refreshes occur (in seconds).
const MAX_DELTA_TO_EXPIRY = 43200; //12 hours

//Create a new Axios instance; this is needed to prevent infinite loops from the inner request
const axiosInst = axios.create({ withCredentials: true });

//Add a request interceptor
axiosInst.interceptors.request.use(
	async function (config) {
		//Get the expiry cookies and convert them to Unix timestamps
		const accessTExpCVal = Cookies.get(import.meta.env.VITE_ACOOKIE_EXPR_NAME);
		const refreshTExpCVal = Cookies.get(import.meta.env.VITE_RCOOKIE_EXPR_NAME);
		if (!accessTExpCVal || !refreshTExpCVal) return config;
		const accessTExp = getUnixTime(accessTExpCVal),
			refreshTExp = getUnixTime(refreshTExpCVal);

		console.log("access token expires on:", accessTExp);
		console.log("refresh token expires on:", refreshTExp);

		//Check if the access token needs to be refreshed
		const delta2Exp = accessTExp - getUnixTime(Date.now().toString());
		if (delta2Exp >= MAX_DELTA_TO_EXPIRY) {
			console.log("No need to refresh access token; delta to expiry:", delta2Exp);
			return config;
		}
		console.log(
			`Delta to expiry is ${delta2Exp} (< ${MAX_DELTA_TO_EXPIRY}); refreshing access token automatically...`
		);

		//Refresh the access token
		try {
			const response: HttpResponse<any> = (
				await axios.post(
					`${import.meta.env.VITE_API_URL}/auth/refresh`,
					{},
					{ withCredentials: true }
				)
			).data;
			console.log("Access token refreshed; response:", response);
		} catch (error: any) {
			//Check if the error has a response section
			let rtext = "";
			if (error.response !== undefined) {
				const response: HttpResponse<null> = error.response.data;
				rtext = prettyError(response);
			} else {
				rtext = error.message;
			}

			//Log the error
			console.error("An error occurred while refreshing the access token:", rtext);
		}

		//Pass on the config to the original request
		return config;
	},
	async function (error) {
		//Do something with request error
		return Promise.reject(error);
	}
);

//Add a response interceptor
axiosInst.interceptors.response.use(
	async function (response) {
		//Do something with response data
		return response;
	},
	async function (error) {
		//Do something with response error
		return Promise.reject(error);
	}
);

//Export for use elsewhere
const taxios = axiosInst;
export default taxios;

//-- Utilities
/*
/**
 * Gets the value of a cookie, if it exists.
 * @param name The name of the cookie
 * @returns The cookie's value
 * /
function getCookie(name: string): string | null {
	const pair = document.cookie.split("; ").find(row => row.startsWith(`${name}=`));
	if (pair) {
		return pair.split("=")[1];
	}
	return null;
}
*/

/**
 * Converts a date to a Unix timestamp. See: https://stackoverflow.com/a/28683720
 * @param date The date to convert
 * @returns The resulting Unix timestamp
 */
function getUnixTime(date: string): number {
	return parseInt((new Date(date).getTime() / 1000).toFixed(0));
}
