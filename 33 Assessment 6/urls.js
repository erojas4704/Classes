const { default: axios } = require('axios');
const fs = require('fs');
const { CatError } = require('./handlers')

function cat(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf-8', (err, res) => {
            if (err) {
                throw new CatError(`File ${path} not found.`);
            }
            resolve(res);
        });
    });
}

async function webCat(path, output = undefined) {
    try {
        let res = await axios.get(path);
        if (output) {
            fs.writeFile(output, res.data, (err, wrRes) => {
                if (err) {
                    console.log(`Cannot write to ${output}`)
                    return { error: `Cannot write to ${output}` }
                }
            });
        }
        console.log(`Wrote to ${output}`)
        return res.data;
    } catch (err) {
        console.log(`Couldn't download ${path}`)
        return { error: `Couldn't download ${path}` }
    }
}

function parseArgs(arr) {
    let args = {};

    arr.forEach((a, i) => {
        if (a.slice(0, 2) == "--") {
            let argument = a.slice(2);
            let param;
            if (i < arr.length - 1) {
                param = arr[i + 1];
                arr.splice(i, 2);
            } else {
                arr.splice(i);
            }
            args[argument] = param;

        }
    });

    args.path = arr.pop();
    return args;
}

function extractHostname(url) {
    const pattern = /https?:\/\/(www.)?(?<host>[\w.]*)[\/\w\?]*/i;
    return url.match(pattern).groups['host'];
}

async function loadURLSFromFile(path, output) {
    let strUrls = await cat(path, output);
    let ar = strUrls.split("\n");

    let resp = await Promise.all(ar.map(url => {
        if (!url) return;
        let file = extractHostname(url) + ".txt";
        return webCat(url, file);
    }));

    resp.forEach(p => {
        //do something
    });
}

if (process.argv.length > 2) {
    let args = parseArgs(process.argv);
    let path = args.path;

    if (path.substr(0, 4).toLowerCase() == "http") {
        webCat(path, args.out);
    } else {
        loadURLSFromFile(path, args.out);
    }
}

module.exports = {
    extractHostname
}