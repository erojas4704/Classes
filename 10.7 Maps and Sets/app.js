/*
What does the following code return?
new Set([1,1,2,2,3,4]);

Returns a set with 4 values being, 1, 2, 3, 4.
*/

/*
What does the following code return?

[...new Set("referee")].join("")

Returns a string with all the unique characters in referee. "ref"
*/

/*
What does the Map m look like after running the following code?

let m = new Map();
m.set([1,2,3], true);
m.set([1,2,3], false);

The map will have 2 identical keys with array [1, 2, 3] representing first true, then false.

*/

function hasDuplicate(arr) {
    return new Set(arr).size < arr.length;
}


function vowelCount(str) {
    let map = new Map();
    const vowels = 'aeiou'.split('');
    str = str.toLowerCase();

    str.split('')
    .filter(char => vowels.find( v => v === char))
    .forEach(vowel => {
        map.set(vowel, map.get(vowel) + 1 || 1);
    });

    return map;
}
