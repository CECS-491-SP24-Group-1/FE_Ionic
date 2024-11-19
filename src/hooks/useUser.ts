import useSWR, { mutate } from "swr";
import taxios from "@/util/token_refresh_hook";

const api = import.meta.env.VITE_API_URL;

const fetchUser = async (url: string) => {
	const response = await taxios.get(url);
	return response.data.payloads[0]; // Return the first payload as user data
};
const updateUser = async (uid: string, data: Record<string, any>) => {
	await taxios.put(`${api}/user/${uid}`, data); // Update user data
	mutate(`${api}/user/${uid}`); // Revalidate the SWR cache
};

export const useUser = (uid: string) => {
	console.log(uid);
	const { data, error, isLoading } = useSWR(`${api}/user/${uid}`, fetchUser, {
		revalidateOnFocus: false
	});

	return {
		user: data,
		isLoading,
		error,
		updateUser: (data: Record<string, any>) => updateUser(uid, data), // Expose updateUser
	};
};
