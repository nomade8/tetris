const canvas = document.getElementById('tetrisCanvas');
const ctx = canvas.getContext('2d');

const ROW = 20;
const COL = 10;
const SQ = 25; // Tamanho de cada quadrado - AUMENTADO EM 25%
const VACANT = "BLACK"; // Cor dos quadrados vazios

// Desenhar um quadrado
function drawSquare(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * SQ, y * SQ, SQ, SQ);
    ctx.strokeStyle = "BLACK";
    ctx.strokeRect(x * SQ, y * SQ, SQ, SQ);
}

// Criar o tabuleiro
let board = [];
for (r = 0; r < ROW; r++) {
    board[r] = [];
    for (c = 0; c < COL; c++) {
        board[r][c] = VACANT;
    }
}

// Desenhar o tabuleiro
function drawBoard() {
    for (r = 0; r < ROW; r++) {
        for (c = 0; c < COL; c++) {
            drawSquare(c, r, board[r][c]);
        }
    }
}

drawBoard();

// As formas das peças - MOVIDAS PARA CÁ
const Z = [
    [
        [0, 0, 0],
        [1, 1, 0],
        [0, 1, 1]
    ],
    [
        [0, 1, 0],
        [1, 1, 0],
        [1, 0, 0]
    ]
];

const S = [
    [
        [0, 0, 0],
        [0, 1, 1],
        [1, 1, 0]
    ],
    [
        [1, 0, 0],
        [1, 1, 0],
        [0, 1, 0]
    ]
];

const T = [
    [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0]
    ],
    [
        [0, 1, 0],
        [1, 1, 0],
        [0, 1, 0]
    ],
    [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 1, 0],
        [0, 1, 1],
        [0, 1, 0]
    ]
];

const O = [
    [
        [1, 1],
        [1, 1]
    ]
];

const L = [
    [
        [0, 0, 0],
        [1, 1, 1],
        [1, 0, 0]
    ],
    [
        [1, 1, 0],
        [0, 1, 0],
        [0, 1, 0]
    ],
    [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1]
    ]
];

const I = [
    [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    [
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0]
    ]
];

const J = [
    [
        [0, 0, 0],
        [1, 1, 1],
        [0, 0, 1]
    ],
    [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0]
    ],
    [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 1, 1],
        [0, 1, 0],
        [0, 1, 0]
    ]
];

// As peças do Tetris
const PIECES = [
    [Z, "red"],
    [S, "green"],
    [T, "purple"],
    [O, "yellow"],
    [L, "orange"],
    [I, "cyan"],
    [J, "blue"]
];

// Gerar uma peça aleatória
function randomPiece() {
    let r = Math.floor(Math.random() * PIECES.length); // 0 a 6
    return new Piece(PIECES[r][0], PIECES[r][1]);
}

let p = randomPiece();

// O objeto Piece
function Piece(tetromino, color) {
    this.tetromino = tetromino;
    this.color = color;

    this.tetrominoN = 0; // Começa com a primeira rotação
    this.activeTetromino = this.tetromino[this.tetrominoN];

    // Posição inicial
    this.x = 3;
    this.y = -2;
}

// Desenhar a peça
Piece.prototype.draw = function() {
    for (r = 0; r < this.activeTetromino.length; r++) {
        for (c = 0; c < this.activeTetromino.length; c++) {
            // Desenha apenas quadrados ocupados
            if (this.activeTetromino[r][c]) {
                drawSquare(this.x + c, this.y + r, this.color);
            }
        }
    }
}

// Apagar a peça
Piece.prototype.unDraw = function() {
    for (r = 0; r < this.activeTetromino.length; r++) {
        for (c = 0; c < this.activeTetromino.length; c++) {
            if (this.activeTetromino[r][c]) {
                drawSquare(this.x + c, this.y + r, VACANT);
            }
        }
    }
}

// Mover a peça para baixo
Piece.prototype.moveDown = function() {
    if (!this.collision(0, 1, this.activeTetromino)) {
        this.unDraw();
        this.y++;
        this.draw();
    } else {
        this.lock();
        p = randomPiece();
    }
}

// Mover a peça para a direita
Piece.prototype.moveRight = function() {
    if (!this.collision(1, 0, this.activeTetromino)) {
        this.unDraw();
        this.x++;
        this.draw();
    }
}

// Mover a peça para a esquerda
Piece.prototype.moveLeft = function() {
    if (!this.collision(-1, 0, this.activeTetromino)) {
        this.unDraw();
        this.x--;
        this.draw();
    }
}

// Rotacionar a peça
Piece.prototype.rotate = function() {
    let nextTetromino = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];
    let kick = 0;

    if (this.collision(0, 0, nextTetromino)) {
        if (this.x > COL / 2) {
            // Colidiu na parede direita
            kick = -1; // Move a peça para a esquerda
        } else {
            // Colidiu na parede esquerda
            kick = 1; // Move a peça para a direita
        }
    }

    if (!this.collision(kick, 0, nextTetromino)) {
        this.unDraw();
        this.x += kick;
        this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
        this.activeTetromino = this.tetromino[this.tetrominoN];
        this.draw();
    }
}

let score = 0;
let dropInterval = 1000; // Intervalo de queda inicial (1 segundo)
const INITIAL_DROP_INTERVAL = 1000; // Constante para o intervalo inicial
const SPEED_INCREASE_SCORE_THRESHOLD = 100; // Aumenta a velocidade a cada 100 pontos
const SPEED_DECREASE_AMOUNT = 50; // Diminui o intervalo em 50ms
let nextSpeedIncreaseScore = SPEED_INCREASE_SCORE_THRESHOLD;

// Travar a peça
Piece.prototype.lock = function() {
    for (r = 0; r < this.activeTetromino.length; r++) {
        for (c = 0; c < this.activeTetromino.length; c++) {
            // Pula quadrados vazios
            if (!this.activeTetromino[r][c]) {
                continue;
            }
            // Peças para travar no topo do canvas = game over
            if (this.y + r < 0) {
                alert("Game Over");
                gameOver = true;
                break;
            }
            // Trava a peça
            board[this.y + r][this.x + c] = this.color;
        }
    }
    // Remover linhas cheias
    for (r = 0; r < ROW; r++) {
        let isRowFull = true;
        for (c = 0; c < COL; c++) {
            isRowFull = isRowFull && (board[r][c] != VACANT);
        }
        if (isRowFull) {
            // Mover todas as linhas acima da linha cheia para baixo
            for (y = r; y > 0; y--) { // Alterado para y > 0 para evitar problemas com a linha 0
                for (c = 0; c < COL; c++) {
                    board[y][c] = board[y - 1][c];
                }
            }
            // A linha superior se torna vazia
            for (c = 0; c < COL; c++) {
                board[0][c] = VACANT;
            }
            score += 10;
        }
    }
    drawBoard();
    document.getElementById('score').innerHTML = `Score: ${score}`; // Atualiza a exibição da pontuação

    // Verifica se é hora de aumentar a velocidade
    if (score >= nextSpeedIncreaseScore) {
        if (dropInterval > SPEED_DECREASE_AMOUNT) { // Garante que o intervalo não se torne negativo
            dropInterval -= SPEED_DECREASE_AMOUNT;
        } else {
            dropInterval = 50; // Define um limite mínimo para a velocidade
        }
        nextSpeedIncreaseScore += SPEED_INCREASE_SCORE_THRESHOLD; // Define o próximo limiar
        console.log(`Velocidade aumentada! Novo intervalo de queda: ${dropInterval}ms`);
    }
}

// Detecção de colisão
Piece.prototype.collision = function(x, y, piece) {
    for (r = 0; r < piece.length; r++) {
        for (c = 0; c < piece.length; c++) {
            // Se o quadrado não estiver ocupado, pule
            if (!piece[r][c]) {
                continue;
            }
            // Coordenadas da peça após o movimento
            let newX = this.x + c + x;
            let newY = this.y + r + y;

            // Condições de colisão
            if (newX < 0 || newX >= COL || newY >= ROW) {
                return true;
            }
            // Pula newY < 0; o tabuleiro [-1][x] não existe
            if (newY < 0) {
                continue;
            }
            // Verifica se há um quadrado ocupado no tabuleiro
            if (board[newY][newX] != VACANT) {
                return true;
            }
        }
    }
    return false;
}

let isFastDropping = false; // Variável para controlar a queda rápida

// Função para detectar se é um dispositivo móvel
function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}

// Obter referências aos elementos de controle
const touchControls = document.querySelector('.touch-controls');
const pcControls = document.querySelector('.pc-controls');
const restartButton = document.getElementById('restartButton');
const pauseButton = document.getElementById('pauseButton');

// Os controles de PC devem estar sempre visíveis
pcControls.style.display = 'flex';

// Exibir os controles apropriados com base no dispositivo
if (isMobileDevice()) {
    touchControls.style.display = 'grid'; // Mostrar controles de toque
} else {
    touchControls.style.display = 'none'; // Esconder controles de toque
}

// Event Listeners para os botões de PC
restartButton.addEventListener('click', () => {
    location.reload(); // Recarrega a página para reiniciar o jogo
});

pauseButton.addEventListener('click', () => {
    gamePaused = !gamePaused;
    if (!gamePaused) {
        dropStart = Date.now(); // Reseta o tempo para evitar queda instantânea
        drop(); // Reinicia o loop do jogo se estiver pausado
    }
});

// Controlar a peça com as setas do teclado
document.addEventListener("keydown", CONTROL);
document.addEventListener("keyup", (event) => {
    if (event.keyCode == 40) { // Seta para Baixo
        isFastDropping = false;
    }
});

let gamePaused = false; // Variável para controlar o estado de pausa

function CONTROL(event) {
    if (gameOver || gamePaused) return; // Não permite controle se o jogo acabou ou está pausado

    if (event.keyCode == 37) {
        p.moveLeft();
        dropStart = Date.now();
    } else if (event.keyCode == 38) {
        p.rotate();
        dropStart = Date.now();
    } else if (event.keyCode == 39) {
        p.moveRight();
        dropStart = Date.now();
    } else if (event.keyCode == 40) {
        // Ao pressionar para baixo, move a peça e ativa a queda rápida
        p.moveDown();
        isFastDropping = true;
    }
}

let dropStart = Date.now();
let gameOver = false;

function drop() {
    if (gameOver || gamePaused) {
        requestAnimationFrame(drop); // Continua chamando para verificar o estado de pausa/game over
        return;
    }

    let now = Date.now();
    let delta = now - dropStart;
    let currentDropInterval = isFastDropping ? 50 : dropInterval; // Usa 50ms para queda rápida

    if (delta > currentDropInterval) {
        p.moveDown();
        dropStart = Date.now();
    }
    requestAnimationFrame(drop); // Chama requestAnimationFrame sempre, mas a execução é controlada por gameOver/gamePaused
}

// Funções para os botões de toque
const leftButton = document.getElementById('leftButton');
const rotateButton = document.getElementById('rotateButton');
const rightButton = document.getElementById('rightButton');
const downButton = document.getElementById('downButton');

leftButton.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Previne o comportamento padrão do toque (ex: scroll)
    p.moveLeft();
    dropStart = Date.now();
});

rotateButton.addEventListener('touchstart', (e) => {
    e.preventDefault();
    p.rotate();
    dropStart = Date.now();
});

rightButton.addEventListener('touchstart', (e) => {
    e.preventDefault();
    p.moveRight();
    dropStart = Date.now();
});

downButton.addEventListener('touchstart', (e) => {
    e.preventDefault();
    p.moveDown();
    isFastDropping = true; // Ativa a queda rápida ao tocar e segurar
});

downButton.addEventListener('touchend', (e) => {
    e.preventDefault();
    isFastDropping = false; // Desativa a queda rápida ao soltar
});

drop(); // Inicia o jogo