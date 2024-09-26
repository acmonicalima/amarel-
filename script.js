const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const scoreBoard = document.getElementById('score');
const startButton = document.getElementById('startButton');

let score = 0;
let shapes = [];
let obstacles = [];
let player = { x: 50, y: 50, size: 20 };
let gameInterval;

// Função para gerar uma forma geométrica aleatória
function generateShape() {
    const shapeTypes = ['circle', 'square', 'triangle'];
    const shape = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
    const size = 30 + Math.random() * 20;
    const x = Math.random() * (canvas.width - size);
    const y = Math.random() * (canvas.height - size);
    shapes.push({ type: shape, x, y, size });
}

// Função para gerar um obstáculo
function generateObstacle() {
    const size = 40 + Math.random() * 20;
    const x = Math.random() * (canvas.width - size);
    const y = Math.random() * (canvas.height - size);
    obstacles.push({ x, y, size });
}

// Função para desenhar formas e obstáculos
function drawShapes() {
    shapes.forEach(shape => {
        context.fillStyle = 'yellow'; // Cor das formas a serem capturadas
        if (shape.type === 'circle') {
            context.beginPath();
            context.arc(shape.x + shape.size / 2, shape.y + shape.size / 2, shape.size / 2, 0, Math.PI * 2);
            context.fill();
        } else if (shape.type === 'square') {
            context.fillRect(shape.x, shape.y, shape.size, shape.size);
        } else if (shape.type === 'triangle') {
            context.beginPath();
            context.moveTo(shape.x + shape.size / 2, shape.y);
            context.lineTo(shape.x, shape.y + shape.size);
            context.lineTo(shape.x + shape.size, shape.y + shape.size);
            context.closePath();
            context.fill();
        }
    });
}

function drawObstacles() {
    context.fillStyle = 'red';
    obstacles.forEach(obstacle => {
        context.fillRect(obstacle.x, obstacle.y, obstacle.size, obstacle.size);
    });
}

function drawPlayer() {
    context.fillStyle = 'white'; // Cor do jogador
    context.beginPath();
    context.arc(player.x, player.y, player.size, 0, Math.PI * 2);
    context.fill();
}

// Função para verificar colisões
function checkCollisions() {
    shapes = shapes.filter(shape => {
        if (shape.type === 'circle') {
            const dx = player.x - (shape.x + shape.size / 2);
            const dy = player.y - (shape.y + shape.size / 2);
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < player.size + shape.size / 2) {
                score += 10;
                scoreBoard.textContent = `Pontuação: ${score}`;
                return false; // Remove a forma capturada
            }
        } else {
            const collisionX = player.x < shape.x + shape.size && player.x + player.size > shape.x;
            const collisionY = player.y < shape.y + shape.size && player.y + player.size > shape.y;
            if (collisionX && collisionY) {
                score += 10;
                scoreBoard.textContent = `Pontuação: ${score}`;
                return false; // Remove a forma capturada
            }
        }
        return true;
    });
    
    obstacles.forEach(obstacle => {
        const collisionX = player.x < obstacle.x + obstacle.size && player.x + player.size > obstacle.x;
        const collisionY = player.y < obstacle.y + obstacle.size && player.y + player.size > obstacle.y;
        if (collisionX && collisionY) {
            const motivationalMessages = [
                "Continue tentando!",
                "Você consegue!",
                "Não desista!",
                "Tente de novo!",
                "Cada erro é uma lição!",
                "A prática leva à perfeição!",
            ];
            const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
            alert(`Game Over! Sua pontuação: ${score}\n${randomMessage}`);
            resetGame();
        }
    });
}

function resetGame() {
    score = 0;
    shapes = [];
    obstacles = [];
    player.x = 50;
    player.y = 50;
    scoreBoard.textContent = `Pontuação: ${score}`;
    clearInterval(gameInterval);
}

// Função de atualização do jogo
function update() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawShapes();
    drawObstacles();
    drawPlayer();
    checkCollisions();

    // Gera novas formas e obstáculos
    if (Math.random() < 0.02) generateShape(); // 2% de chance de gerar uma forma
    if (Math.random() < 0.01) generateObstacle(); // 1% de chance de gerar um obstáculo
}

// Função para mover o jogador com o teclado
function movePlayer(event) {
    const step = 10; // Define a quantidade de movimento do jogador
    switch (event.key) {
        case 'ArrowUp':
            player.y = Math.max(0, player.y - step); // Limite superior
            break;
        case 'ArrowDown':
            player.y = Math.min(canvas.height, player.y + step); // Limite inferior
            break;
        case 'ArrowLeft':
            player.x = Math.max(0, player.x - step); // Limite esquerdo
            break;
        case 'ArrowRight':
            player.x = Math.min(canvas.width, player.x + step); // Limite direito
            break;
    }
}

// Iniciar o jogo
startButton.addEventListener('click', () => {
    resetGame();
    gameInterval = setInterval(update, 100); // Atualiza o jogo a cada 100 ms
});

// Adicionar evento de teclado
document.addEventListener('keydown', movePlayer);
