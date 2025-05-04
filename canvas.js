// Selecionar o canvas e o contexto
const gameCanvas = document.getElementById("animate-canvas");
const gameCtx = gameCanvas.getContext("2d");

// Configurações do jogador
const player = {
  x: 50,
  y: 50,
  width: 30,
  height: 30,
  color: "blue",
  speed: 5,
};

// Configurações do labirinto (barreiras vermelhas)
const obstacles = [
  { x: 0, y: 0, width: 500, height: 10 }, // Topo
  { x: 0, y: 0, width: 10, height: 500 }, // Esquerda
  { x: 490, y: 0, width: 10, height: 500 }, // Direita
  { x: 0, y: 490, width: 500, height: 10 }, // Base
  { x: 100, y: 100, width: 300, height: 10 },
  { x: 100, y: 200, width: 10, height: 200 },
  { x: 200, y: 200, width: 200, height: 10 },
  { x: 300, y: 300, width: 10, height: 100 },
];

// Controle de teclas
const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
};

// Eventos de teclado
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

// Função para desenhar barreiras
function drawObstacles() {
  obstacles.forEach((obstacle) => {
    gameCtx.fillStyle = "red";
    gameCtx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });
}

// Função para verificar colisão
function checkCollision(player, obstacle) {
  return (
    player.x < obstacle.x + obstacle.width &&
    player.x + player.width > obstacle.x &&
    player.y < obstacle.y + obstacle.height &&
    player.y + player.height > obstacle.y
  );
}

// Função principal do jogo
function gameLoop() {
  // Limpar o canvas
  gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

  // Atualizar posição do jogador
  if (keys.ArrowUp) player.y = Math.max(0, player.y - player.speed);
  if (keys.ArrowDown) player.y = Math.min(gameCanvas.height - player.height, player.y + player.speed);
  if (keys.ArrowLeft) player.x = Math.max(0, player.x - player.speed);
  if (keys.ArrowRight) player.x = Math.min(gameCanvas.width - player.width, player.x + player.speed);

  // Desenhar barreiras
  drawObstacles();

  // Verificar colisões
  obstacles.forEach((obstacle) => {
    if (checkCollision(player, obstacle)) {
      alert("Game Over!");
      player.x = 50;
      player.y = 50;
    }
  });

  // Desenhar o jogador
  gameCtx.fillStyle = player.color;
  gameCtx.fillRect(player.x, player.y, player.width, player.height);

  // Continuar o loop do jogo
  requestAnimationFrame(gameLoop);
}

// Iniciar o jogo
gameLoop();