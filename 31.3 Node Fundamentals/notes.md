# Nodejs

npm install # installs all dependencies in package.json

require('') without a relative file will look in node_modules.a

Pass the dependency as a parameter ot the function. Dependency injection.
Inversion of control.

Helmet. Useful middleware to hnadle common security issues.
require("helmet")
app.use(helmet());

Look at helmet docs to learn about the common types of attacks

Passport -> Third party authentication. Supports facebook/google/git/etc.
```js
const cookieParser = require('cookie-parser');
app.use(cookieParser());
```
now you can access -> req.cookies
```js
ASsin values to cookies. req.cookie('prop', 'value');
```

Selenium will help you test clientside interactions.
Selenium can take screenshots and compare throughout interations.