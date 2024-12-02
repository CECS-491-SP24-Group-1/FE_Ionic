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
		<div className="lr-container z-100 relative">
			{/* Page title */}
			<h2 className="title">{title}</h2>

			{/* Action form */}
			<form onSubmit={onSubmit}>{content}</form>
		</div>
	);
};

export default LRContainer;
