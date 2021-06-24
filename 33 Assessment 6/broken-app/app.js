const express = require('express');
let axios = require('axios');
var app = express();

app.post('/', function(req, res, next) {
  try {
    let developers = req.body.developers;
    let resp = await Promise.all(
      developers.map( d => axios.get(`https://api.github.com/users/${d}`))
    );

    console.log(resp);

    

    let results = req.body.developers.map(async d => {
      return await axios.get(`https://api.github.com/users/${d}`);
    });
    let out = results.map(r => ({ name: r.data.name, bio: r.data.bio }));

    return res.send(JSON.stringify(out));
  } catch {
    next(err);
  }
});

app.listen(3002);
