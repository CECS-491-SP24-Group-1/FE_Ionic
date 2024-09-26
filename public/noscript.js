// Thanks Perplexity for this :))))

(function () {
	function checkFeatures() {
		var missingFeatures = [];

		// Check for ES6+ features
		try {
			eval(
				"const test = function() {}; function Test() {}; let x = 0; new Promise(function() {});"
			);
			eval("import('data:text/javascript;base64,Cg==')");
		} catch (e) {
			missingFeatures.push("Modern JavaScript features (including import)");
		}

		// Check for WebAssembly
		if (
			typeof WebAssembly === "undefined" ||
			typeof WebAssembly.instantiateStreaming === "undefined"
		) {
			missingFeatures.push("WebAssembly");
		}

		// Check for Crypto API
		if (
			typeof window.crypto === "undefined" ||
			typeof window.crypto.subtle === "undefined"
		) {
			missingFeatures.push("Crypto API");
		}

		// Check for Base64 encoding/decoding
		if (typeof btoa === "undefined" || typeof atob === "undefined") {
			missingFeatures.push("Base64 encoding/decoding");
		}

		return missingFeatures;
	}

	function showWarning(missingFeatures) {
		var warningHtml = "";
		warningHtml +=
			'<div style="background-color: #ffeeee; border: 1px solid #ff0000; padding: 15px; margin: 10px 0;">';
		warningHtml +=
			'<h2 style="color: #ff0000; margin-top: 0;">Browser Compatibility Error</h2>';
		warningHtml +=
			"<p>Your web browser is missing support for the following features:</p>";
		warningHtml += "<ul>";

		for (var i = 0; i < missingFeatures.length; i++) {
			warningHtml += "<li>" + missingFeatures[i] + "</li>";
		}

		warningHtml += "</ul>";
		warningHtml +=
			"<p>This application will not work correctly, and has been terminated as a result (check your console for more information).</p><p>Please upgrade your web browser to use this application (we recommend Google Chrome).</p>";
		warningHtml += "</div>";

		var tempDiv = document.createElement("div");
		tempDiv.innerHTML = warningHtml;
		document.body.insertBefore(tempDiv.firstChild, document.body.firstChild);
	}

	var missingFeatures = checkFeatures();
	if (missingFeatures.length > 0) {
		showWarning(missingFeatures);
	} else {
		if (window.console && console.log) {
			console.log("All required features are supported");
		}
		// Initialize your app or load your main script here
	}
})();
