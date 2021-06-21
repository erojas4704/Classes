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

async function webCat(path, output = undefined){
    try{
        let res = await axios.get(path);
        if(output){
            fs.writeFile(output, res.data, (err, wrRes) => {
                if(err){
                    console.log(`Could not write to file ${output}.`);
                    console.log(err);
                    return;
                }

                console.log(wrRes);
            });
        }
        
        console.log(res.data);
        return res;
    }catch(err){
        console.log(`Error loading ${path}`);
        console.log(err);
        process.exit(1);
    }
}


if(process.argv.length > 2){
    let args = parseArgs(process.argv);
    let path = args.path;

    if(path.substr(0, 4).toLowerCase() == "http"){
        webCat(path, args.out);
    }else{
        cat(path, args.out);
    }
}

function parseArgs(arr){
    let args = {};

    arr.forEach( (a, i) => {
        if(a.slice(0, 2) == "--"){
            let argument = a.slice(2);
            let param;
            if(i < arr.length - 1){
                param = arr[i + 1];
                arr.splice(i, 2);
            }else{
                arr.splice(i);
            }
            args[argument] = param;
            
        }
    });
    
    args.path = arr.pop();
    return args;
}