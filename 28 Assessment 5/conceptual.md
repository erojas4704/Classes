### Conceptual Exercise

Answer the following questions below:

- What is RESTful routing?

RESTful routing is when we create routes for our server application using different methods like POST, GET, PATCH, and DELETE. Each route corresponds to a function called on the server, and that function will return something to the browser to display.

- What is a resource?

A resource is a static image or file that is served through HTTP.

- When building a JSON API why do you not include routes to render a form that when submitted creates a new user?

If we directly render a form, that form will not be secure. Meaning it can be falsified and sent from anywhere.

- What does idempotent mean? Which HTTP verbs are idempotent?

Something idempotent is a method that can be called many times and the result does not change.  DELETE, PATCH, and POST are not idempotent, whereas GET is.

- What is the difference between PUT and PATCH?

The PATCH method modifies a resource, whereas the PUT method replaces it entirely.

- What is one way encryption?

One way encryption is a method of encryption that cannot be performed backwards. That is, you cannot get the original data from a hash.

- What is the purpose of a `salt` when hashing a password?

The salt makes it very difficult to perform an attack using known hashes of passwords by 'salting' your input with a random string.

- What is the purpose of the Bcrypt module?

Bcrypt allows us to authenticate users with hashed passwords. 

- What is the difference between authorization and authentication?

Authentication is letting users log in, authorization is making sure users have right privileges assigned to them based on who they are.
