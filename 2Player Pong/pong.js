const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const grid = 15;
const paddleHeight = grid * 5;
const maxPaddleY = canvas.height - grid - paddleHeight;
const paddleSpeed = 6;
const ballSpeed = 5;

const leftPaddle = {
  x: grid * 2,
  y: canvas.height / 2 - paddleHeight / 2,
  width: grid,
  height: paddleHeight,
  dy: 0
};

const rightPaddle = {
  x: canvas.width - grid * 3,
  y: canvas.height / 2 - paddleHeight / 2,
  width: grid,
  height: paddleHeight,
  dy: 0
};

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  width: grid,
  height: grid,
  resetting: false,
  dx: ballSpeed,
  dy: -ballSpeed
};

// Define variables to store player scores
let player1Score = 0;
let player2Score = 0;

// Update scoreboard function
function updateScoreboard() {
  document.getElementById('player1-score').textContent = `Player 1: ${player1Score}`;
  document.getElementById('player2-score').textContent = `Player 2: ${player2Score}`;
}

// Inside the loop function, where you reset the ball when it goes past a paddle:
function loop() {
  requestAnimationFrame(loop);
  context.clearRect(0,0,canvas.width,canvas.height);

  leftPaddle.y += leftPaddle.dy;
  rightPaddle.y += rightPaddle.dy;

  leftPaddle.y = Math.min(Math.max(leftPaddle.y, grid), maxPaddleY);
  rightPaddle.y = Math.min(Math.max(rightPaddle.y, grid), maxPaddleY);

  context.fillStyle = 'white';
  context.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
  context.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);

  ball.x += ball.dx;
  ball.y += ball.dy;

  if (ball.y < grid || ball.y + grid > canvas.height - grid) {
    ball.dy *= -1;
  }

  if ((ball.x < 0 || ball.x > canvas.width) && !ball.resetting) {
    ball.resetting = true;

    // Increment the score for the appropriate player
    if (ball.x < 0) {
        player2Score++; // Player 2 scores when ball goes past left wall
    } else {
        player1Score++; // Player 1 scores when ball goes past right wall
    }
      
    setTimeout(() => {
        ball.resetting = false;
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
      
        // Update the scoreboard
      updateScoreboard();
    }, 400);
  }

  if (collides(ball, leftPaddle)) {
    ball.dx *= -1;
    ball.x = leftPaddle.x + leftPaddle.width;
  } else if (collides(ball, rightPaddle)) {
    ball.dx *= -1;
    ball.x = rightPaddle.x - ball.width;
  }

  context.fillStyle = 'white';
  context.fillRect(ball.x, ball.y, ball.width, ball.height);

  context.fillStyle = 'lightgrey';
  context.fillRect(0, 0, canvas.width, grid);
  context.fillRect(0, canvas.height - grid, canvas.width, canvas.height);

  for (let i = grid; i < canvas.height - grid; i += grid * 2) {
    context.fillRect(canvas.width / 2 - grid / 2, i, grid, grid);
  }
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'ArrowUp') {
    rightPaddle.dy = -paddleSpeed;
  } else if (e.key === 'ArrowDown') {
    rightPaddle.dy = paddleSpeed;
  }

  if (e.key === 'w') {
    leftPaddle.dy = -paddleSpeed;
  } else if (e.key === 's') {
    leftPaddle.dy = paddleSpeed;
  }
});

document.addEventListener('keyup', function(e) {
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    rightPaddle.dy = 0;
  }

  if (e.key === 's' || e.key === 'w') {
    leftPaddle.dy = 0;
  }
});

requestAnimationFrame(loop);

// check for collision between two objects using axis-aligned bounding box (AABB)
function collides(obj1, obj2) {
  return obj1.x < obj2.x + obj2.width &&
         obj1.x + obj1.width > obj2.x &&
         obj1.y < obj2.y + obj2.height &&
         obj1.y + obj1.height > obj2.y;
}
