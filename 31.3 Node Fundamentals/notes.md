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
//assign values to cookies. 
(req, res, next) => {
    req.cookie('prop', 'value');
}
```

Selenium will help you test clientside interactions.
Selenium can take screenshots and compare throughout interations.

Moment. Good library for dealing with date and time.

```js
const moment = require("moment")
moment(new Date()).format("MM Do YY"); // <- 04 2nd 92
moment(new Date()).fromNow(); // <- 2 minutes ago
```

lodash

```js
const _ = require("lodash");

_.isEqual(obj1, obj2); //Check if two objects are the sames

_.get(object, 'nested.property', 'DEFAULT VALUE')
```

MongoDB non-relational db.
Looks like JSON. 

Redis

Key/Value store. Simple 2 column table?

Can be extremely fast as it's stored in memory.

Some companies store information in redis as an intermediary to keep it fast.

Postgres

```sql
EXPLAIN SELECT * FROM table;
```

Returns metrics from a command. Performance.

Postgres Triggers. When something is inserted or deleted, then insert or delete something in another table, for example

PSQL json_agg(expression) <- Aggregates data into a JSON array.

```sql
SELECT name, json_agg(hobby) AS hobbies
FROM users AS u
JOIN hobbies AS h ON (u.name = h.user_name)
GROUP BY name;
```

Trinity
Backend - Database - Frontend

Backend is the custodian of the database.
1. Right person putting information into the database.
2. Relevant information being pulled from the database.
3. Making sure that information flowing out of the database is going to the right person.


1. Every table should have its own model.
2. When a model has its own table, they should only interact with each other. It should be a 1 to 1 relationship.

In Jobly, you should have a seperate applications model.

You can use middleware for mutating information.

Database is the heart and soul of everything

Service layer: Exists to help us interact with our model. It helps us merge model functionality.

services/applyTojob.js <- Checks if user exists, check if job exists, then create application. It's like a middle man between 2 or more models.
```js
function applyToJob(user, job){
    User.get(user.username); //Check if user exists
    Job.get(job.id)  //Check if job exists
    Application.create(job.id, username); // if we had an application model.
}

//getUserJobs.js
function getUserJobs(user){
    //This is where we should query what jobs each users have.
}
```

Much cleaner architecture.

When you get a job, find out where their layers are in their diagram. Where does this model fit in the landscape and why does it exist.

Helps you make sure you're not repeating your queries.

generateWhereClause - Spaghetti Code

Could've been solved with a series of if statements adding to the where clause.

test folders
and the subfolders should match the other folders.
test/routes
test/models

tests need to be more descriptive