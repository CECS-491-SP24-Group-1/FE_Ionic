import React, { useState, useEffect } from "react";
import {
	IonPage,
	IonHeader,
	IonToolbar,
	IonTitle,
	IonContent,
	IonList,
	IonItem,
	IonButton,
	IonIcon
} from "@ionic/react";
import { people, peopleOutline, searchCircleOutline, chatbubble } from "ionicons/icons";
import taxios from "@/util/token_refresh_hook";
import PageHandler from "@/components/PageHandler";
import { createAvatar } from "@dicebear/core";
import { thumbs } from "@dicebear/collection";
interface User {
	id: string;
	display_name: string;
	profilePictureUrl?: string;
	isFriend?: boolean;
	generatedAvatarUrl?: string;
}

const FriendsPage: React.FC = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(10);
	const [perPage, setPerPage] = useState(5);
	const [searchQuery, setSearchQuery] = useState("");

	const api = import.meta.env.VITE_API_URL;

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await taxios.get(
					`${api}/users/list?page=${currentPage}&per_page=${perPage}`
				);
				const usersData = response.data.payloads[0].data;

				const usersWithAvatars = await Promise.all(
					usersData.map(async (user: User) => {
						const avatarUri = await createAvatar(thumbs, {
							seed: user.display_name
						}).toDataUri();
						return { ...user, generatedAvatarUrl: avatarUri };
					})
				);

				setUsers(usersWithAvatars);
				setTotalPages(response.data.payloads[0].pagination.total_pages);
			} catch (error) {
				console.error("Error fetching users:", error);
			}
		};

		fetchUsers();
	}, [currentPage, perPage]);

	const handleMessageUser = (userId: string) => {
		/* Implement when friends route works; basic GPT boilerplate here
    taxios.post(`${api}/friends/add`, { userId })
      .then(() => {
        alert('Friend request sent!');
      })
      .catch(error => {
        console.error('Error sending friend request:', error);
      });
    */
	};

	const handleStartChat = (userId: string) => {
		console.log(`Starting chat with user ${userId}`);
	};

	const handleRemoveFriend = (userId: string) => {
		console.log(`Removing friend ${userId}`);
	};

	const filteredUsers = users.filter((user) =>
		user.display_name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<IonPage id="friends-page">
			<IonHeader className="bg-primary dark:bg-primary-light">
				<div className="flex flex-row items-center gap-4 px-4">
					{/* Icon and Heading */}
					<IonIcon icon={peopleOutline} className="text-3xl text-white" />
					<h1 className="mb-5 text-xl font-bold text-gray-200">Friends</h1>

					{/* Separator Line */}
					<div className="h-8 w-[1px] bg-gray-500"></div>

					{/* Add Friend Button */}
					<button className="bold text-md rounded bg-[#3C8E59] px-4 py-2 font-bold text-white hover:bg-green-700">
						Add Friend
					</button>
				</div>
			</IonHeader>
			<IonContent className="bg-primary text-gray-100 dark:bg-primary-light">
				<div className="min-h-screen bg-primary p-4 dark:bg-primary-light">
					{/* Search Bar */}
					<div
						className="sticky top-0 z-10 bg-primary pb-4 pt-2 dark:bg-primary-light"
						style={{ boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)" }}>
						<div className="relative">
							<IonIcon
								icon={searchCircleOutline}
								className="absolute left-3 top-1/2 -translate-y-1/2 transform text-3xl text-gray-400"
							/>
							<input
								type="text"
								className="w-full rounded-lg bg-backgroundHighlight px-12 py-2 text-gray-200 focus:outline-none dark:bg-backgroundHighlight-light dark:text-textPrimary-light"
								placeholder="Search friends..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
					</div>

					{/* Friends List */}
					<div className="gap-4 rounded-lg bg-transparent">
						{filteredUsers.length > 0 ? (
							<ul>
								{filteredUsers.map((user) => (
									<li
										key={user.id}
										className="mb-4 flex items-center justify-between rounded-lg bg-backgroundHighlight p-3 dark:bg-backgroundHighlight-light">
										<div className="flex items-center gap-3">
											<img
												src={user.profilePictureUrl || user.generatedAvatarUrl}
												alt={`${user.display_name}'s avatar`}
												className="h-10 w-10 rounded-full"
											/>
											<span className="font-semibold">{user.display_name}</span>
										</div>
										<div className="relative flex items-center gap-1">
											{/* Start Chat Button with Icon */}
											<button
												onClick={() => handleStartChat(user.id)}
												className="rounded-full bg-backgroundHighlight p-2 hover:bg-blue-700 dark:bg-backgroundHighlight-light">
												<IonIcon icon={chatbubble} className="text-2xl text-white" />
											</button>

											{/* Dropdown Menu */}
											<div className="group relative">
												<button className="rounded px-3 py-1 text-2xl font-extrabold hover:text-gray-500">
													⋮
												</button>
												<div className="absolute right-0 mt-1 hidden w-40 rounded bg-gray-800 shadow-lg group-hover:block">
													<button
														onClick={() => handleRemoveFriend(user.id)}
														className="block w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-gray-700">
														Remove Friend
													</button>
												</div>
											</div>
										</div>
									</li>
								))}
							</ul>
						) : (
							<div className="text-center text-gray-500">No friends found.</div>
						)}
						{/* Pagination Bar */}
						<div className="mb-4 flex items-center justify-center rounded-lg bg-transparent p-2">
							<PageHandler
								currentPage={currentPage}
								setCurrentPage={setCurrentPage}
								totalPages={totalPages}
								perPage={perPage}
								setPerPage={setPerPage}
							/>
						</div>
					</div>
				</div>
			</IonContent>
		</IonPage>
	);
};

export default FriendsPage;
