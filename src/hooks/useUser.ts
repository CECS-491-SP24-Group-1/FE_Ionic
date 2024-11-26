import useSWR, { mutate } from "swr";
import taxios from "@/util/token_refresh_hook";

const api = import.meta.env.VITE_API_URL;

const fetchUser = async (url: string) => {
	const response = await taxios.get(url);
	return response.data.payloads[0]; // Return the first payload as user data
};

const updateUser = async (uid: string, data: Record<string, any>) => {
	try {
		const response = await taxios.patch(`${api}/user/${uid}`, data);
		console.log("Update response:", response.data);
		if (response.status !== 200) {
			throw new Error("Failed to update user on the server.");
		}
		mutate(`${api}/user/${uid}`); // Revalidate the SWR cache
	} catch (error) {
		console.error("Error updating user:", error);
		throw error;
	}
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
		updateUser: (data: Record<string, any>) => updateUser(uid, data) // Expose updateUser
	};
};
