// Seleção do elemento canvas e contexto
const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");

const COLS = 10; // Colunas
const ROWS = 20; // Linhas
const BLOCK_SIZE = 30; // Tamanho de cada bloco (em pixels)

let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0)); // Tabuleiro vazio
let currentPiece = null; // Peça atual
let gameInterval; // Intervalo para o movimento da peça



// Define a resolução do canvas de acordo com o tamanho da tela
function resizeCanvas() {
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
        canvas.style.width = "100%";
        canvas.style.height = "100%";
    } else {
        canvas.style.width = "60%";
        canvas.style.height = `${window.innerHeight}px`;
    }

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

// Função para desenhar o tabuleiro
function drawBoard() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (board[row][col] !== 0) {
                context.fillStyle = board[row][col];
                context.fillRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                context.strokeStyle = "#ccc";
                context.strokeRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}

// Função para gerar uma nova peça
function createPiece() {
    const pieces = [
        { shape: [[1, 1, 1], [0, 1, 0]], color: "#F00" }, // Peça T
        { shape: [[1, 1], [1, 1]], color: "#0F0" }, // Peça O
        { shape: [[1, 1, 0], [0, 1, 1]], color: "#00F" }, // Peça S
        { shape: [[0, 1, 1], [1, 1, 0]], color: "#FF0" }, // Peça Z
        { shape: [[1, 0, 0], [1, 1, 1]], color: "#0FF" }, // Peça L
        { shape: [[0, 0, 1], [1, 1, 1]], color: "#F0F" }, // Peça J
        { shape: [[1, 1, 1, 1]], color: "#FFA500" } // Peça I
    ];

    const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
    return randomPiece;
}

// Função para desenhar a peça atual
function drawPiece() {
    for (let row = 0; row < currentPiece.shape.length; row++) {
        for (let col = 0; col < currentPiece.shape[row].length; col++) {
            if (currentPiece.shape[row][col]) {
                context.fillStyle = currentPiece.color;
                context.fillRect((currentPiece.x + col) * BLOCK_SIZE, (currentPiece.y + row) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                context.strokeStyle = "#ccc";
                context.strokeRect((currentPiece.x + col) * BLOCK_SIZE, (currentPiece.y + row) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}

// Função para mover a peça para baixo
function movePieceDown() {
    currentPiece.y++;
    if (collision()) {
        currentPiece.y--;
        placePiece();
        clearLines();
        currentPiece = createPiece();
        currentPiece.x = Math.floor(COLS / 2) - Math.floor(currentPiece.shape[0].length / 2);
        currentPiece.y = 0;

        if (collision()) {
            clearInterval(gameInterval);
            alert("Game Over!");
        }
    }
}

// Função para detectar colisões com as bordas ou outras peças
function collision() {
    for (let row = 0; row < currentPiece.shape.length; row++) {
        for (let col = 0; col < currentPiece.shape[row].length; col++) {
            if (currentPiece.shape[row][col]) {
                const x = currentPiece.x + col;
                const y = currentPiece.y + row;
                if (x < 0 || x >= COLS || y >= ROWS || board[y][x] !== 0) {
                    return true;
                }
            }
        }
    }
    return false;
}

// Função para fixar a peça no tabuleiro
function placePiece() {
    for (let row = 0; row < currentPiece.shape.length; row++) {
        for (let col = 0; col < currentPiece.shape[row].length; col++) {
            if (currentPiece.shape[row][col]) {
                const x = currentPiece.x + col;
                const y = currentPiece.y + row;
                board[y][x] = currentPiece.color;
            }
        }
    }
}

// Função para limpar as linhas completas
function clearLines() {
    for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row].every(cell => cell !== 0)) {
            board.splice(row, 1);
            board.unshift(Array(COLS).fill(0));
        }
    }
}

// Função para mover a peça para a esquerda ou direita
function movePiece(direction) {
    currentPiece.x += direction;
    if (collision()) {
        currentPiece.x -= direction;
    }
}

// Função para rotacionar a peça
function rotatePiece() {
    const rotatedShape = currentPiece.shape[0].map((_, index) =>
        currentPiece.shape.map(row => row[index])
    ).reverse();

    const originalShape = currentPiece.shape;
    currentPiece.shape = rotatedShape;

    if (collision()) {
        currentPiece.shape = originalShape;
    }
}

// Função principal de renderização
function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
    drawBoard();
    drawPiece();
}

// Função para iniciar o jogo
function startGame() {
    currentPiece = createPiece();
    currentPiece.x = Math.floor(COLS / 2) - Math.floor(currentPiece.shape[0].length / 2);
    currentPiece.y = 0;

    gameInterval = setInterval(() => {
        movePieceDown();
        draw();
    }, 500); // A cada 500ms a peça desce
}

// Função para reiniciar o jogo
function resetGame() {
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    startGame();
}

// Inicializa o jogo ao carregar a página
window.addEventListener("load", () => {
    resizeCanvas();
    startGame();
});

// Atualiza o tamanho do canvas quando a janela for redimensionada
window.addEventListener("resize", () => {
    resizeCanvas();
    draw();
});

// Controle via teclado
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
        movePiece(-1); // Move para a esquerda
    } else if (event.key === "ArrowRight") {
        movePiece(1); // Move para a direita
    } else if (event.key === "ArrowDown") {
        movePieceDown(); // Acelera a queda
    } else if (event.key === "ArrowUp") {
        rotatePiece(); // Rotaciona a peça
    }
});

let isMovingDown = false; // Flag para controle de movimento contínuo da tecla para baixo

// Controle via teclado
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
        movePiece(-1); // Move para a esquerda
    } else if (event.key === "ArrowRight") {
        movePiece(1); // Move para a direita
    } else if (event.key === "ArrowDown") {
        if (!isMovingDown) { // Se a tecla não foi pressionada anteriormente
            isMovingDown = true;
            accelerateDown(); // Começa a acelerar a queda
        }
    } else if (event.key === "ArrowUp") {
        rotatePiece(rondow); // Rotaciona a peça
    }
});

// Quando a tecla para baixo é liberada, parar a aceleração
document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowDown") {
        isMovingDown = false; // Para a aceleração da queda
    }
});

// Função para fazer a peça cair mais rápido
function accelerateDown() {
    // Verifica se a peça já colidiu ou está parada no fundo
    if (isMovingDown) {
        movePieceDown();
        setTimeout(accelerateDown, 100); // Chama a função repetidamente para acelerar a queda
    }
}

// Função para mover a peça para baixo (normal)
function movePieceDown() {
    currentPiece.y++;
    if (collision()) {
        currentPiece.y--;
        placePiece();
        clearLines();
        currentPiece = createPiece();
        currentPiece.x = Math.floor(COLS / 2) - Math.floor(currentPiece.shape[0].length / 2);
        currentPiece.y = 0;

        if (collision()) {
            clearInterval(gameInterval);
            alert("Game Over!");
        }
    }
}
