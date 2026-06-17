/**
 * Minesweeper Game Logic
 */

$(document).ready(function() {
    let board = [];
    let rows = 16;
    let cols = 16;
    let minesCount = 40;
    let flagsCount = 40;
    let revealedCount = 0;
    let isGameOver = false;
    let firstClick = true;
    
    let timer = null;
    let timeElapsed = 0;

    const difficulties = {
        easy: { r: 9, c: 9, m: 10 },
        medium: { r: 16, c: 16, m: 40 },
        hard: { r: 16, c: 30, m: 99 }
    };

    function startTimer() {
        if(timer) clearInterval(timer);
        timeElapsed = 0;
        $('#timeDisplay').text('000');
        timer = setInterval(() => {
            timeElapsed++;
            $('#timeDisplay').text(timeElapsed.toString().padStart(3, '0'));
        }, 1000);
    }

    function stopTimer() {
        if(timer) clearInterval(timer);
    }

    function initGame() {
        const diff = $('#difficultySelect').val();
        rows = difficulties[diff].r;
        cols = difficulties[diff].c;
        minesCount = difficulties[diff].m;
        flagsCount = minesCount;
        revealedCount = 0;
        isGameOver = false;
        firstClick = true;
        board = [];
        
        $('#minesCount').text(flagsCount);
        $('#timeDisplay').text('000');
        stopTimer();
        $('#resultOverlay').addClass('d-none');

        const boardEl = $('#minesweeperBoard');
        boardEl.empty();
        boardEl.css('grid-template-columns', `repeat(${cols}, 1fr)`);

        for (let r = 0; r < rows; r++) {
            let rowArray = [];
            for (let c = 0; c < cols; c++) {
                const cell = {
                    r: r, c: c,
                    isMine: false,
                    isRevealed: false,
                    isFlagged: false,
                    neighborMines: 0,
                    el: $(`<div class="cell" data-r="${r}" data-c="${c}"></div>`)
                };
                rowArray.push(cell);
                boardEl.append(cell.el);

                // Events
                cell.el.on('mousedown', function(e) {
                    if (isGameOver) return;
                    if (e.which === 1) { // Left click
                        handleLeftClick(r, c);
                    } else if (e.which === 3) { // Right click
                        handleRightClick(r, c);
                    }
                });
            }
            board.push(rowArray);
        }
    }

    // Prevent context menu
    $('#minesweeperBoard').on('contextmenu', function(e) {
        e.preventDefault();
    });

    function placeMines(excludeR, excludeC) {
        let placed = 0;
        while (placed < minesCount) {
            let r = Math.floor(Math.random() * rows);
            let c = Math.floor(Math.random() * cols);
            
            // Don't place mine on first click or already placed
            if (!board[r][c].isMine && !(r === excludeR && c === excludeC)) {
                board[r][c].isMine = true;
                placed++;
            }
        }
        calculateNeighbors();
    }

    function calculateNeighbors() {
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (board[r][c].isMine) continue;
                let count = 0;
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        let nr = r + i, nc = c + j;
                        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].isMine) {
                            count++;
                        }
                    }
                }
                board[r][c].neighborMines = count;
            }
        }
    }

    function handleLeftClick(r, c) {
        let cell = board[r][c];
        if (cell.isRevealed || cell.isFlagged) return;

        if (firstClick) {
            firstClick = false;
            placeMines(r, c);
            startTimer();
        }

        if (cell.isMine) {
            gameOver(false);
            return;
        }

        revealCell(r, c);
        checkWin();
    }

    function handleRightClick(r, c) {
        let cell = board[r][c];
        if (cell.isRevealed) return;

        if (cell.isFlagged) {
            cell.isFlagged = false;
            cell.el.text('');
            flagsCount++;
        } else {
            if(flagsCount > 0) {
                cell.isFlagged = true;
                cell.el.text('🚩');
                flagsCount--;
            }
        }
        $('#minesCount').text(flagsCount);
    }

    function revealCell(r, c) {
        let cell = board[r][c];
        if (cell.isRevealed || cell.isFlagged) return;

        cell.isRevealed = true;
        revealedCount++;
        cell.el.addClass('revealed');

        if (cell.neighborMines > 0) {
            cell.el.text(cell.neighborMines);
            cell.el.addClass(`num-${cell.neighborMines}`);
        } else {
            // Reveal neighbors recursively
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    let nr = r + i, nc = c + j;
                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                        revealCell(nr, nc);
                    }
                }
            }
        }
    }

    function checkWin() {
        if (revealedCount === (rows * cols) - minesCount) {
            gameOver(true);
        }
    }

    function gameOver(win) {
        isGameOver = true;
        stopTimer();
        
        // Reveal all mines
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                let cell = board[r][c];
                if (cell.isMine) {
                    if(!cell.isFlagged) {
                        cell.el.addClass('revealed mine').text('💣');
                    }
                } else if (cell.isFlagged) {
                    cell.el.addClass('revealed').text('❌'); // Wrong flag
                }
            }
        }

        const msg = $('#resultMessage');
        if(win) {
            msg.text('You Win! 🎉').addClass('text-success').removeClass('text-danger');
        } else {
            msg.text('Game Over! 💥').addClass('text-danger').removeClass('text-success');
        }
        
        $('#finalTime').text(timeElapsed);
        setTimeout(() => $('#resultOverlay').removeClass('d-none'), 1000);
    }

    $('#restartBtn, #playAgainBtn').click(initGame);
    $('#difficultySelect').change(initGame);

    initGame();
});
