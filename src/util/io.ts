import FileSaver from "file-saver";

/** Saves a string to a file using FilSaver.js. */
export function string2File(str: string, fn: string) {
	const blob = new Blob([str], { type: "text/plain;charset=utf-8" });
	FileSaver.saveAs(blob, fn);
}
