const express = require('express');
const app = express();
const ExpressError = require('./Handlers');
const companyRoutes = require('./routes/companies');
const invoiceRoutes = require('./routes/invoices');
const industryRoutes = require('./routes/industries');
const morgan = require("morgan");

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/companies", companyRoutes);
app.use("/invoices", invoiceRoutes);
app.use("/industries", industryRoutes);


//404 Handler
app.use( (req, res, next) => {
    const notFoundError = new ExpressError("Not found", 404);
    //if(req.url == "/sw.js") return; //Work around to silence annoying error.
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

module.exports = app;