/**
 * search for element starts from the end of the array
 */
export default (arr, callback, context) => {
  for (let index = arr.length - 1; index >= 0; index--) {
    const value = arr[index];
    if (callback.call(context, value, index, arr)) {
      return value;
    }
  }

  return undefined;
};
