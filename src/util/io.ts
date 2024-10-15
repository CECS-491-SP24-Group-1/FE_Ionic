import FileSaver from "file-saver";

/** Saves a string to a file using FilSaver.js. */
export function string2File(str: string, fn: string) {
	const blob = new Blob([str], { type: "text/plain;charset=utf-8" });
	FileSaver.saveAs(blob, fn);
}

/** Reads a string from a `File` blob. */
export async function readText(file: File): Promise<string> {
	return new Promise<string>((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			if (typeof reader.result === "string") {
				resolve(reader.result);
			} else {
				reject(new Error("FileReader did not return a string"));
			}
		};
		reader.onerror = () => reject(reader.error);
		reader.readAsText(file);
	});
}
