const express = require('express');
const ExpressError = require('./Handlers');
const {mean, median, mode} = require('./Operations');
//const operations = { mean, median, mode};

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use( (req, res, next) => {
    console.log("BEIS", req.url);
    next();
});

app.get('/all', (req, res, next) => {
    try {
        let numbersArray = getNumbersFromRequest(req);
        return res.json({
            operation: "all",
            mean: mean(numbersArray),
            median: median(numbersArray),
            mode: mode(numbersArray)
        });
    } catch (err) {
        next(err);
    }
});

app.get('/mean', (req, res, next) => {
    try {
        let numbersArray = getNumbersFromRequest(req);
        return res.json({
            operation: "mean",
            value: mean(numbersArray)
        });
    } catch (err) {
        next(err);
    }
});

app.get('/median', (req, res, next) => {
    try {
        let numbersArray = getNumbersFromRequest(req);
        return res.json({
            operation: "median",
            value: median(numbersArray)
        });
    } catch (err) {
        next(err);
    }
});

app.get('/mode', (req, res, next) => {
    try {
        let numbersArray = getNumbersFromRequest(req);
        return res.json({
            operation: "mode",
            value: mode(numbersArray)
        });
    } catch (err) {
        next(err);
    }
});

function getNumbersFromRequest(req) {
    let str = req.query.nums;
    if(!str) throw new ExpressError("Input cannot be blank!", 400);
    
    let strAr = str.split(",");


    return strAr.map(s => {
        if(isNaN(s)) throw new ExpressError(`Invalid number ${s} in input!`, 400);
        let num = Number(s);
        return num;
    });
}

//404 Handler
app.use( (req, res, next) => {
    const notFoundError = new ExpressError("Not found", 404);
    if(req.url == "/sw.js") return; //Work around to silence annoying error.
    next(notFoundError);
});

//Error handler
app.use( (err, req, res, next) => {
    //Errors flow through these handlers
    let status = err.status || 500;
    let message = err.message;

    return res.status(status).json({
        error: {message, status}
    });
});

app.listen(3000, () => { console.log("App active port 3000.") });
