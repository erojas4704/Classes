# Broken App Issues

1. Missing JSON parser middleware.
2. Missing body parser middleware.
3. Refactored clunky syntax.
4. Made all API calls run concurrently, so that we're not waiting on a call to end before we can move on.
5. Added unit tests to make sure changes work properly.
6. Added error handling that doesn't discard good data, but makes sure bad data is labeled as such.
7. The POST route, while not even functional, would've returned a JSON-formatted string, and not the JSON array of objects we needed. This is redundant as Express would've simply handled the parsing and interpretation of JSON.