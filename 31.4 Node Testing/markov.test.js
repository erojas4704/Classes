const { MarkovMachine } = require("./markov");

CHAIN_1 = {
    'the': ['cat', 'hat', 'hat'],
    'cat': ['in'],
    'in': ['the', 'the'],
    'hat': ['is', undefined],
    'is': ['in']
}


describe("building dictionaries", () => {
    let m;
    
    beforeAll( () => {
        m = new MarkovMachine("the cat in the hat is in the hat");
    });

    test('making a dictionary', () =>{
        expect(m.chains).toEqual(CHAIN_1);
    });

});

function hasDuplicateKeys(dict){

}