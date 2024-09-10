import React from "react";
import {useThemeColor} from "../hooks/useThemeColor";
import "./ThemedText.css";

export type ThemedTextProps = React.HTMLAttributes<HTMLSpanElement> & {
	lightColor?: string;
	darkColor?: string;
	type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function ThemedText({
	className,
	lightColor,
	darkColor,
	type = "default",
	...rest
}: ThemedTextProps) {
	// Get the correct color based on theme
	const color = useThemeColor({light: lightColor, dark: darkColor}, "text");

	return (
		<span
			className={[
				"themed-text", // Default class for text styling
				type === "default" ? "default-text" : "",
				type === "title" ? "title-text" : "",
				type === "defaultSemiBold" ? "default-semi-bold-text" : "",
				type === "subtitle" ? "subtitle-text" : "",
				type === "link" ? "link-text" : "",
				className // Allow custom classNames to be passed in
			].join(" ")}
			style={{color}} // Apply the color dynamically
			{...rest} // Pass any remaining props (e.g., children)
		/>
	);
}
