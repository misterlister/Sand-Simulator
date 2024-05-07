const COLS = 100
const ROWS = 50
const SQSIZE = 20
let grid


function setup() {
    
    createCanvas(COLS * SQSIZE, ROWS * SQSIZE)
    grid = makeGrid(COLS, ROWS, SQSIZE)
    grid.arr[50][20] = 1
}

function draw() {
    background(0)
    drawGrid(grid)
    grid = getNextGrid(grid)
    
    
}

function makeGrid(num_cols, num_rows, square_size) {
    // create grid
    const grid = {
        cols: num_cols,
        rows: num_rows,
        sq_size: square_size,
        arr: []
    }
    grid.arr = new Array(num_cols)
    for (let i = 0; i < num_cols; i++) {
        grid.arr[i] = new Array(num_rows)
        // initialize each square to 0
        for (let j = 0; j < num_rows; j++) {
            grid.arr[i][j] = 0
        }
    }
    return grid
}

function drawGrid(grid) {
    for (let i = 0; i < grid.cols; i++) {
        for (let j = 0; j < grid.rows; j++) {
            stroke(255)
            fill(grid.arr[i][j]*255)
            let x = i * grid.sq_size
            let y = j * grid.sq_size
            square(x, y, grid.sq_size)
        }
    }
}

function getNextGrid(grid) {
    let nextGrid = makeGrid(grid.cols, grid.rows, grid.sq_size)
    for (let i = 0; i < grid.cols; i++) {
        for (let j = 0; j < grid.rows; j++) {
            let state = grid.arr[i][j]
            // check if this space has sand
            if (state === 1) {
                nextGrid.arr[i][j] = 1
                // don't move if this space is at the bottom of the grid
                if (j+1 < grid.rows) {
                    let below = grid.arr[i][j+1]
                    // if the space beneath is empty, then move this grain down
                    if (below == 0) {
                        nextGrid.arr[i][j] = 0
                        nextGrid.arr[i][j+1] = 1
                    }
                }
            }
        }
    }
    return nextGrid
}

function mouseClick() {
    let mouseCol = floor(mouseX / SQSIZE)
    let mouseRow = floor(mouseY / SQSIZE)
    grid.arr[mouseCol][mouseRow] = 1
}