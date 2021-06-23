global.items = [];

function addItem(item){
    global.items.push(item);
}

function getItem(name){
    return global.items.find( i => i.name === name);
}

function updateItem(name, data){
    let item = getItem(name);
    
    for(let k in item){
        item[k] = data[k] || item[k];
    }
    return item;
}

function deleteItem(name){
    let item = getItem(name);
    let index = global.items.indexOf(item);
    if(index < 0) return false; //Item does not exist.
    
    global.items.splice(index, 1);
    return true;
}

module.exports = {
    items,
    addItem,
    getItem,
    updateItem,
    deleteItem
};
