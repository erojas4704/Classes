const { extractHostname } = require("../urls");

test("Extract host name.", async () => {
    expect(extractHostname("http://www.yahoo.com"))
        .toEqual('yahoo.com');
});

test("Extract host name with https ", async () => {
    expect(extractHostname("https://www.yahoo.com"))
        .toEqual('yahoo.com');
});

test("Extract host name without www. ", async () => {
    expect(extractHostname("https://google.com"))
        .toEqual('google.com');
});

test("Extract host name with more stuff at the end", async () => {
    expect(extractHostname("https://regexr.com/barriguite/users/marna"))
        .toEqual('regexr.com');
});

test("Extract host name with a query string", async () => {
    expect(extractHostname("https://regexr.com?users=marna,zarna,perrite"))
        .toEqual('regexr.com');
});