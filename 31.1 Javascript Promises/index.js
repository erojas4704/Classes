
const BASE_URL = 'http://numbersapi.com';

function getMyFavoriteNumber(number) {
    return new Promise((resolve, reject) => {
        axios.get(`${BASE_URL}/${number.toString()}/trivia?json`).then(
            resp => {
                resolve(resp.data.text);
            }
        ).catch(err => {
            reject(err);
        });
    });
}

function getMultipleNumbers(...nums) {
    return new Promise((resolve, reject) => {
        let s = "";
        nums.forEach((num, i) => {
            if (i != 0) {
                s += ",";
            }

            s += num.toString();
        });

        axios.get(`${BASE_URL}/${s}/trivia?json`).then(
            resp => {
                console.log(resp.data);
                resolve(resp.data);
            }
        ).catch(err => {
            reject(err);
        });
    });
}

function renderText(text) {
    document.querySelector("#text").innerHTML += `\n<div>${text}</div>`;
}

getMyFavoriteNumber(14).then(resp => renderText(resp));
getMultipleNumbers(1, 7, 14, 17, 21).then(resp => {
    for (let data in resp) {
        renderText(resp[data]);
    }
});

let promises = [];
for (let i = 0; i < 4; i++) {
    promises.push(getMyFavoriteNumber(14));
}

Promise.all(promises).then( resp => {
    resp.forEach( str => {
        renderText(str);
    })
});