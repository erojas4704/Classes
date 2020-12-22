/*
function filterOutOdds() {
  var nums = Array.prototype.slice.call(arguments);
  return nums.filter(function(num) {
    return num % 2 === 0
  });
}
*/

/* Write an ES2015 Version */
const filterOutOdds = (...nums) => {
  return nums.filter(num => num % 2 === 0);
}

console.log(filterOutOdds(1, 2, 3, 4, 5, 6, 7)); //2, 4, 6


const findMin = (...nums) => {
  return Math.min(...nums);
}

console.log(findMin(1, 4, 12, -3)); // -3
console.log(findMin(1, -1)); // -1
console.log(findMin(3, 1)); // 1

const mergeObjects = (...objects) => {
  return objects.reduce((o, current) => {
    return { ...o, ...current };
  }, objects[0]);
}

console.log(mergeObjects({ a: 1, b: 2 }, { c: 3, d: 4 }));
console.log(mergeObjects({ a: 1, b: 2 }, { c: 3, d: 4 }, { a: 5, f: 7, g: "unit" }));

const doubleAndReturnArgs = (initialArray, ...values) => {
  //initialArray.push(...values.map( v => v * 2));
  return [...initialArray, ...values.map(v => v * 2)];
}

console.log(doubleAndReturnArgs([1, 2, 3], 4, 4)); // [1,2,3,8,8]
console.log(doubleAndReturnArgs([2], 10, 4)); // [2, 20, 8]

/** remove a random element in the items array
and return a new array without that item. */

let removeRandom = (items) => {
  let rand = Math.floor(Math.random() * items.length);
  return items.filter((item, index) => index != rand);
}

/** Return a new array with every item in array1 and array2. */

let extend = (array1, array2) => {
  return [...array1, ...array2];
}

/** Return a new object with all the keys and values
from obj and a new key/value pair */

let addKeyVal = (obj, key, val) => {
  let newObj = {...obj};
  newObj[key] = val;
  return newObj;
}


/** Return a new object with a key removed. */

let removeKey = (obj, key) => {
  let newObj = {...obj};
  delete newObj[key];
  return newObj;
}


/** Combine two objects and return a new object. */

let combine = (obj1, obj2) => {
  return {...obj1, ...obj2};
}


/** Return a new object with a modified key and value. */

let update = (obj, key, val) => {
  let newObj = {...obj};
  newObj[key] = val;
  return newObj;
}