function starOutGrid(grid) {

    for(let y = 0; y < grid.length; y ++){
        for( let x = 0; x < grid[y].length; x ++){
            if(grid[y][x] == "*"){
                
                //Set everything crossing to 2 Asterisks
                for(let y = 0; y < grid.length; y ++){
                    grid[y][x] = "**";
                }
                for(let x = 0; x < grid[y].length; x ++){
                    grid[y][x] = "**";
                }

                grid[y][x] = "**";
            }
        }
    }

    for(let y = 0; y < grid.length; y ++){
        for( let x = 0; x < grid[y].length; x ++){
            if(grid[y][x] == "**"){
                grid[y][x] = "*";
            }
        }
    }

    return grid;
}
