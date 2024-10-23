import { useEffect } from "react";

const usePageTrap = () => {
	// Check if the page lock is enabled via the .env variable
	const isPageLockEnabled = import.meta.env.VITE_ENABLE_PAGE_LOCK === "true";

	useEffect(() => {
		if (!isPageLockEnabled) {
			return;
		}

		const handleBeforeUnload = (event: BeforeUnloadEvent) => {
			const shouldLeave = window.confirm(
				"You have unsaved changes. Are you sure you want to leave?"
			);
			if (!shouldLeave) {
				event.preventDefault();
				event.returnValue = ""; // Necessary for compatibility in some browsers
			}
		};

		// Add the beforeunload event listener
		window.addEventListener("beforeunload", handleBeforeUnload);

		// Cleanup the event listener on component unmount
		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
		};
	}, [isPageLockEnabled]); // Add isPageLockEnabled as a dependency to ensure it reacts to env changes
};

export default usePageTrap;
