/*
Simple binary search utility function.

Params:
    arr: Sorted array of ranges
    target: Element to find in the array

Returns index of an element if it exists in the array.
Otherwise, it returns the index where the element should be inserted.
*/
export function binarySearch(arr: number[], target: number): number {
    let left = 0;
    let right = arr.length - 1;
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return left;
}