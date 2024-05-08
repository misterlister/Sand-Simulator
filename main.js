// number of columns and rows in the grid
const COLS = 500
const ROWS = 200
// size of grains of sand
const SQSIZE = 3
// radius of sand generation
const RADIUS = 3
const MAXSPEED = 8
let grid

function setup() {
    createCanvas(COLS * SQSIZE, ROWS * SQSIZE)
    grid = makeGrid()
}

function draw() {
    background(0)
    drawGrid(grid)
    grid = getNextGrid(grid)
}

function makeGrid(copy = null) {
    // create grid
    let grid = new Array(COLS)
    for (let i = 0; i < COLS; i++) {
        grid[i] = new Array(ROWS)
        // initialize each square
        for (let j = 0; j < ROWS; j++) {
            state = 0
            speed = 0
            resting = false
            if (copy != null) {
                state = copy[i][j].getState()
                speed = copy[i][j].getSpeed()
                resting = copy[i][j].isResting()
            }
            grid[i][j] = new GridSpace(i, j, state, speed, resting)
        }
    }
    return grid
}

function drawGrid(grid) {
    for (let i = 0; i < COLS; i++) {
        for (let j = 0; j < ROWS; j++) {
            noStroke()
            if (grid[i][j].getState() === 1) {
                fill(194, 178, 128)
                let x = i * SQSIZE
                let y = j * SQSIZE
                square(x, y, SQSIZE)
            }
        }
    }
}

function getNextGrid(grid) {
let nextGrid = makeGrid(grid)
    // iterate through columns
    for (let i = 0; i < COLS; i++) {
        // iterate rows from the bottom up
        for (let j = 0; j < ROWS -1; j++) {
            checkGridSpace(nextGrid[i][j], nextGrid)
        }
    }

    for (let i = 0; i < COLS; i++) {
        // iterate rows from the bottom up
        for (let j = 0; j < ROWS -1; j++) {
            nextGrid[i][j].resetMoved()
        }
    }
    return nextGrid
}

function checkGridSpace(space, nextGrid) {
    // if this space is empty, return
    if (space.getState() === 0) return
    // if this grain is resting, return
    if (space.isResting()) return
    if (space.hasMoved()) return
    space.speedUp()
    newSpace = moveSand(space, nextGrid)
    space.swap(newSpace)
}

function moveSand(space, nextGrid) {
    space.setMoved()
    let col = space.getCol()
    let row = space.getRow()
    let distance = space.getSpeed()
    let newSpace = space
    // look below for empty spaces while this grain has more distance to travel
    while (distance > 0) {
        let nextSpace = nextGrid[col][row+1]
        // if the next space isn't free, check the spaces to the side
        if (nextSpace.getState() != 0) {
            distance --
            let belowL = -1 // sentinel value
            let belowR = -1 // sentinel value
            if (col-1 >= 0) {
                belowL = nextGrid[col-1][row+1].getState()
            }
            if (col+1 < COLS) {
                belowR = nextGrid[col+1][row+1].getState()
            }
            // if neither space is available, return the last free space
            if (belowL != 0 && belowR != 0) {
                if (nextSpace.isResting()) {
                    newSpace.rest()
                }
                return newSpace
            }
            // if both are free, then pick one randomly
            if (belowL === 0 && belowR === 0) {
                let dir = random([-1, 1])
                col += dir
                row ++
            // otherwise choose the one that is free
            } else {
                if (belowL === 0) {
                    col --
                    row ++
                } else {
                    col ++
                    row ++
                } 
            }
        // otherwise the space is free, and the grain can move down
        } else {
            distance --
            row ++
        }
        newSpace = nextGrid[col][row]
        // if this grain has reached the bottom, then it should stop
        if (newSpace.getRow() === ROWS-1) {
            newSpace.rest()
            return newSpace
        }
    }
    return newSpace
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
                    grid[col][row].setState(1)
                }
            }
        }
    }
}

class GridSpace {
    constructor(col, row, state, speed, resting) {
        this.col = col
        this.row = row
        this.state = state
        this.speed = speed
        this.resting = resting
        this.moved = false
    }

    getCol() {
        return this.col
    }

    getRow() {
        return this.row
    }

    getState() {
        return this.state
    }

    getSpeed() {
        return this.speed
    }

    isResting() {
        return this.resting
    }

    hasMoved() {
        return this.moved
    }

    setCol(col) {
        this.col = col
    }

    setRow(row) {
        this.row = row
    }

    setState(state) {
        this.state = state
    }

    speedUp() {
        if (this.speed < MAXSPEED) {
            this.speed ++
        }
    }

    setSpeed(speed) {
        this.speed = speed
    }

    rest() {
        this.speed = 0
        this.resting = true
    }

    setMoved() {
        this.moved = true
    }

    resetMoved() {
        this.moved = false
    }

    swap(otherSpace) {
        let tempState = this.state
        let tempSpeed = this.speed
        let tempMoved = this.moved
        this.state = otherSpace.getState()
        this.speed = otherSpace.getSpeed()
        this.moved = otherSpace.hasMoved()
        otherSpace.setState(tempState)
        otherSpace.setSpeed(tempSpeed)
        if (tempMoved) {
            otherSpace.setMoved()
        }
        
    }
}