/** Server startup for BizTime. */
require("dotenv").config();

const app = require("./app");


app.listen(process.env.PORT || 3001 , function () {
  console.log("Listening on 3000");
});