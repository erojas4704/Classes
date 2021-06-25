const express = require('express');
const axios = require('axios');
const app = express();
const morgan = require("morgan");
const ExpressError = require("./Handlers");

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/', async (req, res, next) => {
  let developers = req.body.developers;
  let resp = await Promise.all(
    developers.map(d => {
      return axios.get(`https://api.github.com/users/${d}`)
        .catch(err => {
          //We handle errors here so that partially correct data isn't discarded. 
          return { data: { error: err } }
        });
    }));

  let data = resp.map(user => parseUser(user));
  return res.status(200).json(data);
});

//404 Handler
app.use((req, res, next) => {
  const notFoundError = new ExpressError("Not found", 404);
  if (req.url == "/sw.js") return; //Work around to silence annoying error.
  next(notFoundError);
});

//Error handler
app.use((err, req, res, next) => {
  //Errors flow through these handlers
  let status = err.status || 500;
  let message = err.message;

  return res.status(status).json({
    error: { message, status }
  });
});

app.listen(3002, () => {
  console.log('Server listening on 3002');
});


/**Take all of the user's attributes from the API response and copy them into a new dictionary. */
function parseUser(user) {
  let newUser = {};
  for(let k in user.data){
    newUser[k] = user.data[k];
  }
  return newUser;
}

module.exports = app;