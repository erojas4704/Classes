
const BASE_URL = 'http://numbersapi.com';

async function getMyFavoriteNumber(number) {
    let resp = await axios.get(`${BASE_URL}/${number.toString()}/trivia?json`);
    return resp.data.text;
}

async function getMultipleNumbers(...nums) {
    let s = "";
    nums.forEach((num, i) => {
        if (i != 0) {
            s += ",";
        }

        s += num.toString();
    });

    let resp = await axios.get(`${BASE_URL}/${s}/trivia?json`);
    console.log(resp.data);
    return resp.data;
}

function renderText(text) {
    document.querySelector("#text").innerHTML += `\n<div>${text}</div>`;
}

async function runTests() {
    renderText(await getMyFavoriteNumber(14));
    let resp = await getMultipleNumbers(1, 7, 14, 17, 21);

    for (let data in resp) {
        renderText(resp[data]);
    }

    let promises = [];
    for (let i = 0; i < 4; i++) {
        promises.push(getMyFavoriteNumber(14));
    }
    let bigPromise = await Promise.all(promises);
    bigPromise.forEach(str => {
        renderText(str);
    });
}

runTests();