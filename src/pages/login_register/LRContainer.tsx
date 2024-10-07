import { IonPage, IonContent } from "@ionic/react";

import LRLogo from "./LRLogo";

import "./LRContainer.scss";

/** The datatype wrapper for the `LRContainer` container. */
interface LRContainerProps {
	/** The title of the page. */
	title: string;
	/** The inner HTML content. */
	content: React.ReactNode;
	/** The action to do when submitting the form. */
	onSubmit: (e: React.FormEvent) => Promise<void>;
}

/** Defines a common container format for login/register pages. */
const LRContainer: React.FC<LRContainerProps> = ({ title, content, onSubmit }) => {
	return (
		<IonPage>
			<IonContent className="lr-page">
				<LRLogo></LRLogo>
				<div className="lr-container">
					{/* Page title */}
					<h2 className="title">{title}</h2>

					{/* Action form */}
					<form onSubmit={onSubmit}>{content}</form>
				</div>
			</IonContent>
		</IonPage>
	);
};

export default LRContainer;
