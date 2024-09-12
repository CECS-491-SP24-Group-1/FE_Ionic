import React, {PropsWithChildren, useState} from "react";
import {IoChevronDown, IoChevronForwardOutline} from "react-icons/io5";
import "./Collapsible.css";

// Assuming you've created these components or imported them from a UI library
import {ThemedText} from "./ThemedText";
import {useThemeColor} from "../hooks/useThemeColor";

export function Collapsible({children, title}: PropsWithChildren & {title: string}) {
	const [isOpen, setIsOpen] = useState(false);
	const theme = useThemeColor({}, "icon"); // Get theme color for icons

	return (
		<div className="themed-view collapsible">
			<button
				className="collapsible-heading"
				onClick={() => setIsOpen((value) => !value)}>
				{isOpen ? (
					<IoChevronDown size={18} color={theme} />
				) : (
					<IoChevronForwardOutline size={18} color={theme} />
				)}
				<ThemedText className="defaultSemiBold">{title}</ThemedText>
			</button>
			{isOpen && <div className="collapsible-content">{children}</div>}
		</div>
	);
}
