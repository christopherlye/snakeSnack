// const nums = [-9, -8, 6, -9, 15, 6];

// const difference = (nums) => {
//     return Math.max(nums);
// }

// console.log(difference(nums));



let obj = {};

const arr = [
            ["a", 10],
            ["b", 5],
            ["c", 7],
            ["a", 7]
            ]

console.log(arr);

for (let i = 0; i < arr.length; i++) {
    obj[arr[i][0]] = null;
}

console.log(obj);

for (let i = 0; i < arr.length; i++) {
    for (key in obj) {
        if (key === arr[i][0]) {
            obj[key] += arr[i][1];
        }
    }
}

console.log(obj);

// for (key in obj) {
//     console.log(key);
// }