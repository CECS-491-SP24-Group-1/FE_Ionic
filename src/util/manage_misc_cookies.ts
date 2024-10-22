import Cookies from "js-cookie";

/**
 * Adds the current user's UUID and username to the cookies. This should
 * be called after login succeeds.
 * @param uid The user's ID
 * @param uname The user's username
 */
export function addMiscCookies(uid: string, uname: string) {
	Cookies.set(import.meta.env.VITE_USER_ID, uid);
	Cookies.set(import.meta.env.VITE_USER_USERNAME, uname);
}

/**
 * Adds the current user's UUID and username from the cookies. This should
 * be called after logout succeeds.
 */
export function removeMiscCookies() {
	Cookies.remove(import.meta.env.VITE_USER_ID);
	Cookies.remove(import.meta.env.VITE_USER_USERNAME);
}