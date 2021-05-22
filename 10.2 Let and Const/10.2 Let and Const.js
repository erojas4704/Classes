const PI = 3.14;
PI = 42; //Will throw exception

//var declarations fall back to function or document scopes. Whichever's first. 
//let declarations only exist in whatever block they are declared in.

//consts can only be declared once.

//hoisting is when the compiler reserves a var declaration prior to its assignment, regardless of where the var keyword is. 
//It will be undefined if referenced, as opposed to throwing an exception.
