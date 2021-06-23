const { mode, mean, median } = require("./Operations");

const SEQUENCE_1 = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10];
const SEQUENCE_2 = [ 1, 24, 24, 32, 55];


test('calculating mean', () => {
    expect(mean(SEQUENCE_1)).toEqual(6.25);
    expect(mean(SEQUENCE_2)).toEqual(27.2);
});

test('calculating median', () => {
    expect(median(SEQUENCE_1)).toEqual(6.5);
    expect(median(SEQUENCE_2)).toEqual(24);
});

test('calculating mode', () => {
    expect(mode(SEQUENCE_1)).toEqual(10);
    expect(mode(SEQUENCE_2)).toEqual(24);
});
