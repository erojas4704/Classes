document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#todoForm");
    const list = document.querySelector("#todoList");

    function createTodoElement(todo, done = false){
        var element = document.createElement("li");
        element.innerHTML = `<button data-action="done" class='btn-done'>Done</button> <span class='form-item ${done?"form-done":""}'>${todo}</span><button data-action="delete" class='btn-delete'>X</button>`
        list.append(element);
        return element;
    }

    function saveToStorage(){
        var listItems = list.querySelectorAll("li");
        var buffer = [];

        for(let todoItem of listItems){
            let todoText = todoItem.querySelector(".form-item");
            buffer.push( { 
                'text': todoText.innerText, 
                'done': todoText.classList.contains("form-done")
            });
        }

        localStorage.todoList = JSON.stringify(buffer);
    }
    
    
    //Load items from storage   
    if(localStorage.todoList){
        for(let loadedItem of JSON.parse(localStorage.todoList)){
            createTodoElement(loadedItem.text, loadedItem.done);
        }
    }
    

    list.addEventListener("click", e => {
        let parent = e.target.parentElement;

        switch(e.target.getAttribute("data-action")){
            case "done":
                parent.querySelector(".form-item").classList.toggle("form-done");
                break;
            case "delete":
                parent.remove();
                break;
        }

        saveToStorage();
    });

    form.addEventListener("submit", e => {
        e.preventDefault();
        var todo = form.todoText.value;
        form.todoText.value = "";

        if(todo.length > 0){
            createTodoElement(todo);
            saveToStorage();
        }
    });
});
