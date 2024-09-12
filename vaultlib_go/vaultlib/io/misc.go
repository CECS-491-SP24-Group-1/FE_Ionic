package io

/*
Checks if 2 slices have the same underlying array. See:
https://www.willem.dev/code-snippets/check-slices-share-same-backing-array/
*/
func SameUnderlyingArray[T any](s1, s2 []T) bool {
	//Get the capacities of both arrays
	cap1 := cap(s1)
	cap2 := cap(s2)

	//nil slices will never have the same array
	if cap1 == 0 || cap2 == 0 {
		return false
	}

	//Compare the address of the last element in each backing array
	return &s1[0:cap1][cap1-1] == &s2[0:cap2][cap2-1]
}
