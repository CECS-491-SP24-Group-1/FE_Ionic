#!/bin/bash
## This script pulls in dependencies from the serverside utils ##

# Define constants
BASE_SRC="../../SMS/message_server"
BASE_DST="./vaultlib"

# Copies a list of files and adds a header
copy_files() {
	local subdir="$1"
	shift
	local files=("$@")

	local src_dir="${BASE_SRC}/${subdir}"
	local dst_dir="${BASE_DST}/${subdir}"

	# Ensure destination directory exists
	mkdir -p "$dst_dir"
	for file in "${files[@]}"; do
		cp "${src_dir}/${file}" "${dst_dir}/"
		sed -i "1i\\// --|==== This file is sourced from '${src_dir}/${file}'; DO NOT EDIT ====|--\n" "${dst_dir}/${file}"
	done
}

# Copy the crypto files
crypto_files=("privkey.go" "privseed.go" "pubkey.go" "signature.go" "utils.go")
copy_files "crypto" "${crypto_files[@]}"

# Copy the util files
crypto_files=("uuid.go")
copy_files "util" "${crypto_files[@]}"
