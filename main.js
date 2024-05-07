// number of columns and rows in the grid
const COLS = 300
const ROWS = 100
// size of grains of sand
const SQSIZE = 10
// radius of sand generation
const RADIUS = 1
let grid


function setup() {
    createCanvas(COLS * SQSIZE, ROWS * SQSIZE)
    grid = makeGrid(COLS, ROWS, SQSIZE)
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
            noStroke()
            if (grid.arr[i][j] === 1) {
                fill(194, 178, 128)
                let x = i * grid.sq_size
                let y = j * grid.sq_size
                square(x, y, grid.sq_size)
            }
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
                    if (below === 0) {
                        nextGrid.arr[i][j] = 0
                        nextGrid.arr[i][j+1] = 1
                    } else {
                        let belowL = -1
                        let belowR = -1
                        if (i-1 > 0) {
                            belowL = grid.arr[i-1][j+1]
                        }
                        if (i+1 < grid.cols) {
                            belowR = grid.arr[i+1][j+1]
                        }
                        if (belowL === 0 && belowR === 0) {
                            let dir = random([-1, 1])
                            nextGrid.arr[i][j] = 0
                            nextGrid.arr[i][j+dir] = 1
                        } else {
                            if (belowL === 0) {
                                nextGrid.arr[i][j] = 0
                                nextGrid.arr[i-1][j+1] = 1
                            }
                            if (belowR === 0) {
                                nextGrid.arr[i][j] = 0
                                nextGrid.arr[i+1][j+1] = 1
                            }
                        }
                        
                    }
                }
            }
        }
    }
    return nextGrid
}

function mouseDragged() {
    let mouseCol = floor(mouseX / SQSIZE)
    let mouseRow = floor(mouseY / SQSIZE)
    for (let i = -RADIUS; i <= RADIUS; i++) {
        for (let j = -RADIUS; j <= RADIUS; j++) {
            let col = mouseCol + i
            let row = mouseRow + j
            if (col < COLS && col >= 0 && row < ROWS && row >= 0) {
                if (random(1) < 0.75){
                    grid.arr[col][row] = 1
                }
            }
        }
    }
}