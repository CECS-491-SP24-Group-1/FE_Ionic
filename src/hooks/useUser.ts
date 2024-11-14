import useSWR from "swr";
import taxios from "@/util/token_refresh_hook";

const api = import.meta.env.VITE_API_URL;

const fetchUser = async (url: string) => {
	const response = await taxios.get(url);
	return response.data.payloads[0]; // Return the first payload as user data
};

export const useUser = (uid: string) => {
	console.log(uid);
	const { data, error, isLoading } = useSWR(`${api}/api/user/${uid}`, fetchUser, {
		revalidateOnFocus: false
	});

	return {
		user: data,
		isLoading,
		error
	};
};
