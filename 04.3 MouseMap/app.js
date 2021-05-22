// JavaScript source code
document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("mousemove", e => {
        document.body.style.backgroundColor = getColorHexFromPosition(e.x, e.y);
    });
});

function getColorHexFromPosition(x, y){
    var r = (x / screen.width) * 256 | 0;
    var g = (y / screen.height) * 256 | 0;
    var b = 255;

    var hex = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}` 
    console.log(hex);
    return hex;
}