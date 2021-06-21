const { default: axios } = require('axios');
const fs = require('fs');

function cat(path){
    fs.readFile(path, 'utf-8', (err, res) => {
        if(err){
            console.log(`File at ${path} could not be found.`);
            console.log(err);
            process.exit(1);
        }

        console.log(res);
        return res;
    });
}

async function webCat(path){
    try{
        let res = await axios.get(path);
        console.log(res);
        return res;
    }catch(err){
        console.log(`Error loading ${path}`);
        console.log(err);
        process.exit(1);
    }
}

if(process.argv.length > 2){
    let path = process.argv[2];
    if(path.substr(0, 4).toLowerCase() == "http"){
        webCat(path);
    }else{
        cat(path);
    }
}