### Conceptual Exercise

Answer the following questions below:

- What are some ways of managing asynchronous code in JavaScript?

1. Callbacks. One can incorporate a function that is called when asynchronous code execution is finished.

2. Promises. Promises wrapped inside of functions execute callbacks when they are finished. The functions return a promise which is a value that will be fulfilled at a later time.

3. Async functions. These functions can halt execution of a specific thread until the promise is fulfilled.

- What is a Promise?

A promise is a special kind of a value that will be fulfilled at a later time. You can assign callbacks to promises like `.then` or `.catch` which are called when the promise has a value or an error, respetively.

- What are the differences between an async function and a regular function?

An async function is a function that can incorporate the `await` keyboard. `await` can halt execution of code in that thread until a certain requirement is met.

- What is the difference between Node.js and Express.js?

Express is a module of Node.js. Node.js is server technology that allows programmers to write servers using javascript. Express is a module incorporated in node that allows servers to serve pages over HTTP using routing.

- What is the error-first callback pattern?

Error first callback pattern refers to most callbacks in node having error as the first parameter and the results as the second. `function cb(err, res){}`.

- What is middleware?

Middleware is code that runs before every request in Express. You can chain middleware callbacks and pass execution to the next part of middleware by calling `next`.

- What does the `next` function do?

`next` passes middleware to the next middleware callback, and, eventually, to the routes themselves. If next is not called, execution will cease and the server will return nothing. Passing a parameter in `next` will cause it to be interpreted as an error, which is great for error handling.

- What does `RETURNING` do in SQL? When would you use it?

Returning allows you to see what columns were actually modified after an SQL statement. This would be handy to verify the changes that were made.

- What are some issues with the following code? (consider all aspects: performance, structure, naming, etc)

```js
async function getUsers() {
  const elie = await $.getJSON('https://api.github.com/users/elie');
  const joel = await $.getJSON('https://api.github.com/users/joelburton');
  const matt = await $.getJSON('https://api.github.com/users/mmmaaatttttt');

  return [elie, matt, joel];
}
```

1. The function name implies that it's supposed to retrieve all users, but there are 3 users hardcoded in. I would change it to make a database call directly or configure the JSON with a route for database requests of all users. Or, without access to a database, we can use a `...params` operator to take an arbitrary amount of users.

```js
async function getUsers(...users){
  let promises = [];
  users.forEach( u => {
    promises.push($.getJSON(`https://api.github.com/users/${u}`));
  });
  return await Promise.all(promise);
}
```

2. The promises are handled one by one. That is, execution will stop until we get `elie`, then `joel`, then, finally, `matt`. Stopping at each one. This will cause slowness in the long term. I would write something more like this.

```js
async function getUsers() {
  let users = await Promise.all([
    $.getJSON('https://api.github.com/users/elie'),
    $.getJSON('https://api.github.com/users/joelburton'),
    $.getJSON('https://api.github.com/users/mmmaaatttttt')
  ]);

  return users;
}
```

3. There is no error handling incorporated in the function. I would throw a custom exception to let devs know specifically what the error is and what name could not be found.

4. There is redundancy in the function. You can make a singular, easily testable `getUser` function and call it for each user.
