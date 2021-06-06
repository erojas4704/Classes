function snakeToCamel(str) {
    ar = str.split("_");
    if(str.toUpperCase() == str){
        return ar.join("");
    }
    
    for(let i = 0; i < ar.length; i ++){
        ar[i] = ar[i][0].toUpperCase() + ar[i].slice(1).toLowerCase();
    }
    
    ar[0] = ar[0][0].toLowerCase() + ar[0].slice(1);
    
    return ar.join("");
}

