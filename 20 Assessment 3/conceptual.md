### Conceptual Exercise

Answer the following questions below:

- What are important differences between Python and JavaScript?

 The most important difference between python and javascript is their syntax. Beyond some surface level
 differences, like true being True and false being False, Python takes
 indentation into consideration where in Javascript it's meaningless. Functionally, however, 
 they are very similar.  
 Python syntax allows to generate an array around a loop. [loop logic here], javascript doesn't.
 Python seems to pride itself on its more concise structure, and many of its methods support this. 

 Python and Javascript have very different data structures as well, for example the tuple.

- Given a dictionary like ``{"a": 1, "b": 2}``: , list two ways you
  can try to get a missing key (like "c") *without* your programming
  crashing.

  To get a non-exitent key, you can either encapsulate the access inside of a try:
  block.

  ```
    try:
        print({"a": 1, "b": 2}["c"])
    except:
        print("error")
  ```  
  Or, you could try accessing the key using the .get method, which would return None if it's not found.

  ```
    print({"a": 1, "b": 2}.get("c"))
  ```

- What is a unit test?  

An unit test is a function that tests a particular piece of code to make sure it does what it's supposed to be doing.

- What is an integration test?  

An integration test is a program that tests many pieces of code that work together to make sure they are behaving as expected.

- What is the role of web application framework, like Flask?

Web application frameworks like Flask are designed to facilitate building and deployment of web services using a standard that's up-to-date and secure without bogging down the developer with the minutiae. 

- You can pass information to Flask either as a parameter in a route URL
  (like '/foods/pretzel') or using a URL query param (like
  'foods?type=pretzel'). How might you choose which one is a better fit
  for an application?

  I would go about it logically. If the food is the main subject the page is about, I would make it part of the route, whereas if it's a property used to describe something, I would make it part of the query.

- How do you collect data from a URL placeholder parameter using Flask?

  You pass the data to a parameter in the route function with the same name. Then you can reference it from that parameter.

- How do you collect data from the query string using Flask?
  
  You use the request library to access the data from the query string.
 ```
 request.args.get('query')
 ```

- How do you collect data from the body of the request using Flask?

 Using `request.form['data']` or `request.json['key']` you can access the data from the body of a request.

- What is a cookie and what kinds of things are they commonly used for?

  A cookie is a piece of information sent back and forth between a browser and a server. They are commonly used to store session information about a specific user. 

- What is the session object in Flask?

 The session object provides an interface for the developer to modify and read the cookies for each user. The cookies are serialized and ideally unreadable on the client-side.

- What does Flask's `jsonify()` do?
  
  jsonify() turns a dictionary into a json string, which can be sent by the server.
