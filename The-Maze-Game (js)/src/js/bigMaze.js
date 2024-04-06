document.getElementById('regenerateMaze').addEventListener('click', () => {
    localStorage.getItem('lifetimeScore') ? localStorage.setItem('lifetimeScore', parseInt(localStorage.getItem('lifetimeScore')) - 1) : localStorage.setItem('lifetimeScore', 0);
    regenerateMaze();
});

document.getElementById('lifetimeScore').innerText = localStorage.getItem('lifetimeScore') ? `Lifetime Score: ${localStorage.getItem('lifetimeScore')}` : 'Lifetime Score: 0';

const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');

const [mazeWidth, mazeHeight] = [1000, 800]; // Increase the size of the maze
canvas.width = mazeWidth;
canvas.height = mazeHeight;

const [rows, cols] = [25, 30]; // Increase the number of rows and columns
const cellSize = Math.min(mazeWidth / cols, mazeHeight / rows);
const maze = Array.from({ length: rows }, () => Array(cols).fill(1));

const player = { x: 0, y: 0, size: cellSize / 2, color: 'blue' };
const exit = { x: cols - 1, y: rows - 1, size: cellSize, color: 'green' };

let redDot = { x: 0, y: 0, size: cellSize / 4, color: 'red', exploded: false };

function carvePassagesFrom(x, y, numPassages = 2) {
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]].sort(() => Math.random() - 0.5);
    let passagesCarved = 0;
    for (const [dx, dy] of dirs) {
        const [nx, ny] = [x + dx * 2, y + dy * 2];
        if (nx >= 0 && nx < cols && ny >= 0 && ny < rows && maze[ny][nx] === 1) {
            [maze[y + dy][x + dx], maze[ny][nx]] = [0, 0];
            carvePassagesFrom(nx, ny);
            passagesCarved++;
            if (passagesCarved === numPassages) {
                break; // Stop carving passages after reaching the specified number
            }
        }
    }
}

maze[0][0] = 0;
carvePassagesFrom(0, 0);
maze[rows - 1][cols - 1] = 0;

// Add event listeners to difficulty buttons
document.getElementById('easy').addEventListener('click', () => generateRedDotMines(1));
document.getElementById('medium').addEventListener('click', () => generateRedDotMines(2));
document.getElementById('hard').addEventListener('click', () => generateRedDotMines(3));

function generateRedDotMines(numRedDots) {
    redDots.length = 0; // Clear existing red dots
    for (let i = 0; i < numRedDots; i++) {
        if (pathToWin) {
            const availableCells = [];
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    if (maze[y][x] === 0 && !pathToWin.some(([px, py]) => px === x && py === y) && (x !== player.x || y !== player.y)) {
                        availableCells.push({ x, y });
                    }
                }
            }
            if (availableCells.length > 0) {
                const randomCellIndex = Math.floor(Math.random() * availableCells.length);
                const redDot = { x: availableCells[randomCellIndex].x, y: availableCells[randomCellIndex].y, size: cellSize / 4, color: 'red', exploded: false };
                redDots.push(redDot);
            } else {
                console.error("No available white cells found outside the path to win to place the mine.");
            }
        } else {
            console.error("No path to win found.");
        }
    }
    draw(); // Redraw the maze with new red dots
}


function findPathToWin(maze, start, end) {
    const rows = maze.length;
    const cols = maze[0].length;
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    const path = [];
    const queue = [start];

    const isValidCell = (x, y) => x >= 0 && x < cols && y >= 0 && y < rows && maze[y][x] === 0 && !visited[y][x];

    while (queue.length > 0) {
        const [x, y] = queue.shift();
        path.push([x, y]);
        visited[y][x] = true;

        if (x === end[0] && y === end[1]) {
            return path;
        }

        const neighbors = [
            [x + 1, y], // Right
            [x - 1, y], // Left
            [x, y + 1], // Down
            [x, y - 1]  // Up
        ];

        for (const [nx, ny] of neighbors) {
            if (isValidCell(nx, ny)) {
                queue.push([nx, ny]);
            }
        }
    }

    return null;
}

// Find the path to win
const pathToWin = findPathToWin(maze, [0, 0], [cols - 1, rows - 1]);

if (pathToWin) {
    // Find available white cells outside the path to win
    const availableCells = [];
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            // Check if the cell is a white cell and not on the winning path or on the player's position
            if (maze[y][x] === 0 && !pathToWin.some(([px, py]) => px === x && py === y) && (x !== player.x || y !== player.y)) {
                availableCells.push({ x, y });
            }
        }
    }

    // Ensure there are available white cells to place the mine
    if (availableCells.length > 0) {
        const randomCellIndex = Math.floor(Math.random() * availableCells.length);
        redDot.x = availableCells[randomCellIndex].x;
        redDot.y = availableCells[randomCellIndex].y;
    } else {
        console.error("No available white cells found outside the path to win to place the mine.");
    }
} else {
    console.error("No path to win found.");
}

// Function to regenerate the maze with the specified number of red dot mines
function regenerateMaze() {
    localStorage.getItem('lifetimeScore') ? localStorage.setItem('lifetimeScore', parseInt(localStorage.getItem('lifetimeScore')) - 1) : localStorage.setItem('lifetimeScore', 0);
    placeRedDotMines(); // Call placeRedDotMines to generate mines
    window.location.reload();
}

// Generate 2 red dots
const redDots = []; // Array to store red dot objects
for (let i = 0; i < 2; i++) {
    if (pathToWin) {
        // Find available white cells outside the path to win
        const availableCells = [];
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                // Check if the cell is a white cell and not on the winning path or on the player's position
                if (maze[y][x] === 0 && !pathToWin.some(([px, py]) => px === x && py === y) && (x !== player.x || y !== player.y)) {
                    availableCells.push({ x, y });
                }
            }
        }

        // Ensure there are available white cells to place the mine
        if (availableCells.length > 0) {
            const randomCellIndex = Math.floor(Math.random() * availableCells.length);
            // Create red dot object
            const redDot = { x: availableCells[randomCellIndex].x, y: availableCells[randomCellIndex].y, size: cellSize / 4, color: 'red', exploded: false };
            redDots.push(redDot); // Add red dot object to the array
        } else {
            console.error("No available white cells found outside the path to win to place the mine.");
        }
    } else {
        console.error("No path to win found.");
    }
}

function drawMaze() {
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            ctx.fillStyle = maze[y][x] === 1 ? 'black' : 'white';
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }
}

function drawEntities() {
    // Draw player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x * cellSize + (cellSize - player.size) / 2, player.y * cellSize + (cellSize - player.size) / 2, player.size, player.size);

    // Draw exit
    ctx.fillStyle = exit.color;
    ctx.fillRect(exit.x * cellSize, exit.y * cellSize, exit.size, exit.size);

    // Draw red dots
    for (const redDot of redDots) {
        if (!redDot.exploded) {
            ctx.fillStyle = redDot.color;
            ctx.beginPath();
            ctx.arc(redDot.x * cellSize + cellSize / 2, redDot.y * cellSize + cellSize / 2, redDot.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

function checkCollision(x, y) {
    return maze[y][x] === 1;
}

function movePlayerAndCheckWin(dx, dy) {
    const newX = player.x + dx;
    const newY = player.y + dy;

    if (newX >= 0 && newX < cols && newY >= 0 && newY < rows && !checkCollision(newX, newY)) {
        player.x = newX;
        player.y = newY;

        if (player.x === exit.x && player.y === exit.y) {
            localStorage.getItem('lifetimeScore') ? localStorage.setItem('lifetimeScore', parseInt(localStorage.getItem('lifetimeScore')) + 1) : localStorage.setItem('lifetimeScore', 1);
            alert("Congratulations, you've escaped the maze! Now we dare you to do it again! FYI, your lifetime score is currently: " + localStorage.getItem('lifetimeScore'));
            window.location.reload();
        }

        // Check for collision with red dot
        if (player.x === redDot.x && player.y === redDot.y) {
            alert("Boom! You stepped on a red dot and exploded. Game over!");
            window.location.reload();
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMaze();
    drawEntities();
    requestAnimationFrame(draw);
}

draw();

window.addEventListener('keydown', (e) => {
    const keyMap = {
        ArrowUp: [0, -1],
        ArrowDown: [0, 1],
        ArrowLeft: [-1, 0],
        ArrowRight: [1, 0]
    };
    const move = keyMap[e.key];
    if (move) {
        movePlayerAndCheckWin(...move);
        e.preventDefault();
    }
});

const addMoveListener = (element, dx, dy) => element.addEventListener('click', () => movePlayerAndCheckWin(dx, dy));

addMoveListener(document.getElementById('moveUp'), 0, -1);
addMoveListener(document.getElementById('moveDown'), 0, 1);
addMoveListener(document.getElementById('moveLeft'), -1, 0);
addMoveListener(document.getElementById('moveRight'), 1, 0);
