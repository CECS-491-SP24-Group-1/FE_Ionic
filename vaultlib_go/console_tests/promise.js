// Test case 1: Positive numbers
promise(5, 4)
	.then(result => console.log("Test 1 (5 * 4) Result:", result))
	.catch(err => console.error("Test 1 Error:", err));

// Test case 2: Zero
promise(0, 10)
	.then(result => console.log("Test 2 (0 * 10) Result:", result))
	.catch(err => console.error("Test 2 Error:", err));

// Test case 3: Negative number (should reject)
promise(-3, 7)
	.then(result => console.log("Test 3 (-3 * 7) Result:", result))
	.catch(err => console.error("Test 3 Error:", err));

// Test case 4: Large numbers
promise(1000, 2000)
	.then(result => console.log("Test 4 (1000 * 2000) Result:", result))
	.catch(err => console.error("Test 4 Error:", err));

// Test case 5: Both negative numbers (should reject)
promise(-5, -5)
	.then(result => console.log("Test 5 (-5 * -5) Result:", result))
	.catch(err => console.error("Test 5 Error:", err));

// Test case 6: Non-integer input (behavior depends on your implementation)
promise(3.14, 2)
	.then(result => console.log("Test 6 (3.14 * 2) Result:", result))
	.catch(err => console.error("Test 6 Error:", err));

console.log("All test cases have been initiated. Check the results above.");
