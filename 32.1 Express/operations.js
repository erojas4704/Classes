
function mean(numbers){
    let sum = numbers.reduce((a, b) => a + b, 0);
    return sum / numbers.length;
}

function median(numbers){
    numbers = numbers.sort((a, b) => a - b);
    let midpoint = numbers.length / 2;

    if(numbers.length % 2 == 0){ //Even
        return (numbers[midpoint - 1] + numbers[midpoint]) / 2;
    }
    //Odd
    return numbers[Math.floor(midpoint)];
}

function mode(numbers){
    let occurrences = {};
    numbers.forEach( n => {
        if(occurrences[n]){
            occurrences[n] ++;
        }else{
            occurrences[n] = 1;
        }
    });

    let mostFrequent;
    for(let k in occurrences){
        if(!mostFrequent){
            mostFrequent = k;
            continue;
        }

        if(occurrences[k] > occurrences[mostFrequent]){
            mostFrequent = k;
        }
    }

    return Number(mostFrequent);
}

module.exports = {
    mode,
    mean,
    median
}