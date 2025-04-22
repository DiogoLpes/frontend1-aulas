const gameCanvas = document.getElementById("animate-canvas");
const gameCtx = gameCanvas.getContext("2d");

// Player square properties
const player = {
  x: gameCanvas.width / 2 - 25,
  y: gameCanvas.height / 2 - 25,
  width: 50,
  height: 50,
  color: "blue",
  speed: 5,
};

// Track which keys are currently pressed
const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
};

// Event listeners for key presses
window.addEventListener("keydown", (e) => {
  if (keys.hasOwnProperty(e.key)) {
    keys[e.key] = true;
  }
});

window.addEventListener("keyup", (e) => {
  if (keys.hasOwnProperty(e.key)) {
    keys[e.key] = false;
  }
});

const obstacles = [
    { x: 100, y: 100, width: 6, height: 500, color: "red" },
    { x: 300, y: 200, width: 50, height: 50, color: "red" },
    { x: 280, y: 100, width: 6, height: 500, color: "red" },
    { x: 300, y: 200, width: 50, height: 50, color: "red" },
  ];
  
  // Function to draw obstacles
  function drawObstacles() {
    obstacles.forEach((obstacle) => {
      gameCtx.fillStyle = obstacle.color;
      gameCtx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
  }
  
  // Collision detection
  function checkCollision(player, obstacle) {
    return (
      player.x < obstacle.x + obstacle.width &&
      player.x + player.width > obstacle.x &&
      player.y < obstacle.y + obstacle.height &&
      player.y + player.height > obstacle.y
    );
  }
  
  // Update game loop
  function gameLoop() {
    // Clear the canvas
    gameCtx.fillStyle = "black";
    gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
  
    // Update player position based on key presses
    if (keys.ArrowUp) player.y = Math.max(0, player.y - player.speed);
    if (keys.ArrowDown) player.y = Math.min(gameCanvas.height - player.height, player.y + player.speed);
    if (keys.ArrowLeft) player.x = Math.max(0, player.x - player.speed);
    if (keys.ArrowRight) player.x = Math.min(gameCanvas.width - player.width, player.x + player.speed);
  
    // Draw obstacles
    drawObstacles();
  
    // Check for collisions
    obstacles.forEach((obstacle) => {
      if (checkCollision(player, obstacle)) {
        alert("Game Over!");
        player.x = gameCanvas.width / 2 - 25;
        player.y = gameCanvas.height / 2 - 25;
      }
    });
  
    // Draw the player
    gameCtx.fillStyle = player.color;
    gameCtx.fillRect(player.x, player.y, player.width, player.height);
  
    // Continue the animation
    requestAnimationFrame(gameLoop);
  }

  // Draw the player
  gameCtx.fillStyle = player.color;
  gameCtx.fillRect(player.x, player.y, player.width, player.height);

  // Continue the animation
  requestAnimationFrame(gameLoop);




// Start the game loop
gameLoop();