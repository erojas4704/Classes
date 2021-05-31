### Conceptual Exercise

Answer the following questions below:

- What is PostgreSQL?

Postgres is software designed to allow the creation and maintenance of databases.

- What is the difference between SQL and PostgreSQL?

Postgres is a more advanced version of SQL that adds support for data interconnectivity.

- In `psql`, how do you connect to a database?

  \c name_of_database

- What is the difference between `HAVING` and `WHERE`?

WHERE filters individual rows, and HAVING filters groups.

- What is the difference between an `INNER` and `OUTER` join?

An INNER join returns a table where 2 tables intersect. That is to say, it'll show the data that the 2 tables have in common. An OUTER join only shows data where there is no intersection. 

- What is the difference between a `LEFT OUTER` and `RIGHT OUTER` join?

A left outer join is a join where the first table referenced in the query is the one whose rows we will use alongside any non-collisions with the second table in the query. A right outer join is the inverse where the latter table is the one whose rows we will return.

- What is an ORM? What do they do?

An ORM is a diagram of a database schema and it shows how tables in a database are interconnected.

- What are some differences between making HTTP requests using AJAX 
  and from the server side using a library like `requests`?

A key difference is that HTTP requests using AJAX from a client are generally prohibited by cross-server policies so they would have to go through the server. Servers can make requests to other servers without a problem.

- What is CSRF? What is the purpose of the CSRF token?
  
The CSRF token helps us to validate our form so that it's the one that we originally sent out to the client.

- What is the purpose of `form.hidden_tag()`?

The form hidden tag allows us to place the hidden CSRF token into the form we render to the client.
