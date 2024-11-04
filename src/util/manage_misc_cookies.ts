import Cookies from "js-cookie";

/**
 * Adds the current user's UUID and username to the cookies. This should
 * be called after login succeeds.
 * @param uid The user's ID
 * @param uname The user's username
 */
export function addMiscCookies(uid: string, uname: string) {
	setCookie(import.meta.env.VITE_USER_ID, uid);
	setCookie(import.meta.env.VITE_USER_USERNAME, uname);
}

/**
 * Adds the current user's UUID and username from the cookies. This should
 * be called after logout succeeds.
 */
export function removeMiscCookies() {
	Cookies.remove(import.meta.env.VITE_USER_ID);
	Cookies.remove(import.meta.env.VITE_USER_USERNAME);

	//TODO: remove these too if user opts to remove evault
	//Cookies.remove(import.meta.env.VITE_VSALT_COOKIE_NAME);
	//Cookies.remove(import.meta.env.VITE_VEKEY_COOKIE_NAME);
}

/**
 * Sets a cookie with options.
 * @param key The name of the cookie
 * @param value The cookie's value
 */
export function setCookie(key: string, value: string) {
	Cookies.set(key, value, { sameSite: "Strict" });
}
