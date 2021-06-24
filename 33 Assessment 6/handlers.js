class CatError extends Error{
    constructor(message, url){
        super();
        this.message = message;
        this.url = url;
        console.error(this.stack);
    }
}

module.exports = {
    CatError
}