console.log("Hello world");

var str = `the string ${1+1+1+1}`;
console.log(`the string is ${str}`);

//debugger;

console.log("wow")


function countDown(value, steps = 0){
    if(value > 0){
        if(steps > 0){
            value --;
        }

        console.log(value);
        steps ++;
        setTimeout(countDown, 1000, value, steps);
    }else{
        console.log("done");
    }
}


function randomGame(){
    var attempts = 0;

    var interval = setInterval(() => {
        var roll = Math.random();
        attempts ++;
        
        if(roll > .75){
            clearInterval(interval);
            console.log(`We won the game. It took ${attempts} ${attempts > 1 ? "attempts" : "attempt"}.`);
        }else{
            console.log(`${attempts}: We didn't win the game yet. Rolled a ${roll}`)
        }
    }, 1000);

}

countDown();
randomGame();