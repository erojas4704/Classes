
document.addEventListener("DOMContentLoaded", () => {
    console.log("go");
    let container = document.getElementById("container");
    console.log("Container no querySelector: ", container);

    container = document.querySelector("#container");
    console.log("Container query selector: ", container);

    let nodesSecond = document.querySelector(".second");
    console.log("Second ", nodesSecond);

    let nodeThirdOl = document.querySelector("ol .third");
    console.log("ol third: ", nodeThirdOl);


    container.prepend("Hello!");

    let footer = document.querySelector(".footer");

    footer.classList.add("main");
    console.log("footer class: ", footer.className);

    footer.classList.remove("main");
    console.log("footer class: ",footer.className);


    let element = document.createElement("li");
    element.innerText = "four";

    document.querySelector("ul").append(element);

    for(let lis of document.querySelector("ol").children){
        lis.style.backgroundColor = "green";
    }

    footer.remove();

});