/**
 * Derives a `Date` object from a given UUIDv7.
 * @param {string} uuid The UUIDv7 to ingest
 * @returns {Date} The date that's encoded in the given UUIDv7
 */
export function uuidv72Date(uuid: string): Date {
	//Strip away the dashes
	const uv7 = uuid.replace(/-/g, "");

	//Convert the hex string to a Uint8Array
	const bytes = new Uint8Array(16);
	for (let i = 0; i < 16; i++) {
		bytes[i] = parseInt(uv7.substring(i * 2, i * 2 + 2), 16);
	}

	//Extract the timestamp bytes
	const timestampBytes = new Uint8Array(8);
	timestampBytes.set(bytes.slice(0, 6), 2);

	//Convert the timestamp bytes to a BigInt
	let timestamp = BigInt(0);
	for (let i = 0; i < 8; i++) {
		timestamp = (timestamp << BigInt(8)) | BigInt(timestampBytes[i]);
	}

	//Convert BigInt to number and create a Date object
	return new Date(Number(timestamp));
}