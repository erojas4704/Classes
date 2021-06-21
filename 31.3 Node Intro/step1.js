const fs = require('fs');

function cat(path){
    fs.readFile(path, 'utf-8', (error, res) => {
        if(error){
            console.log(`File at ${path} could not be found.`);
            console.log(error);
            process.exit(1);
        }

        console.log(res);
    });
}

if(process.argv.length > 2){
    cat(process.argv[2]);
}