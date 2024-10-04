import { Link } from "react-router-dom"; // Use react-router-dom for web routing
import { type ComponentProps } from "react"; // Import React component types

// Define Props based on the Link component from react-router-dom
type Props = Omit<ComponentProps<typeof Link>, "to"> & { href: string };

export function ExternalLink({ href, ...rest }: Props) {
	return (
		<Link
			target="_blank" // Open in a new tab
			to={href} // Use "to" instead of "href" for react-router-dom
			{...rest}
		/>
	);
}
