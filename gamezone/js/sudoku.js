/**
 * Sudoku Generator & Solver Logic
 */

$(document).ready(function () {

    let originalBoard = [];
    let currentBoard = [];
    let timerInterval;
    let elapsedSeconds = 0;
    let gameFinished = false;

    function initGrid() {

        const grid = $("#sudokuGrid");
        grid.empty();

        for (let r = 0; r < 9; r++) {

            for (let c = 0; c < 9; c++) {

                const wrapper = $(`
                    <div class="sudoku-cell" data-r="${r}" data-c="${c}">
                    </div>
                `);

                const input = $(`
                    <input
                        type="text"
                        maxlength="1"
                        inputmode="numeric"
                        pattern="[1-9]"
                        class="sudoku-input"
                        id="cell-${r}-${c}"
                    >
                `);

                input.on("input", function () {

                    let value = $(this).val();

                    if (value.length > 1) {
                        value = value.slice(0, 1);
                    }

                    if (
                        value !== "" &&
                        (parseInt(value) < 1 || parseInt(value) > 9)
                    ) {
                        value = "";
                    }

                    $(this).val(value);

                    $(this).removeClass("error solved-cell");

                    validateBoardDOM();
                    checkWin();

                });

                wrapper.append(input);
                grid.append(wrapper);
            }
        }
    }

    function getDifficultyHoles() {

        const diff = $("#difficultySelect").val();

        if (diff === "easy") return 30;
        if (diff === "medium") return 45;
        if (diff === "hard") return 55;

        return 45;
    }

    function isValid(board, row, col, num) {

        for (let x = 0; x < 9; x++) {

            if (board[row][x] === num) return false;

            if (board[x][col] === num) return false;

            const boxRow =
                3 * Math.floor(row / 3) + Math.floor(x / 3);

            const boxCol =
                3 * Math.floor(col / 3) + (x % 3);

            if (board[boxRow][boxCol] === num) return false;
        }

        return true;
    }

    function solve(board) {

        for (let row = 0; row < 9; row++) {

            for (let col = 0; col < 9; col++) {

                if (board[row][col] === 0) {

                    for (let num = 1; num <= 9; num++) {

                        if (isValid(board, row, col, num)) {

                            board[row][col] = num;

                            if (solve(board)) return true;

                            board[row][col] = 0;
                        }
                    }

                    return false;
                }
            }
        }

        return true;
    }

    function isSafeInBox(rowStart, colStart, num) {

        for (let r = 0; r < 3; r++) {

            for (let c = 0; c < 3; c++) {

                if (
                    currentBoard[rowStart + r][colStart + c] === num
                ) {
                    return false;
                }
            }
        }

        return true;
    }

    function fillBox(rowStart, colStart) {

        for (let r = 0; r < 3; r++) {

            for (let c = 0; c < 3; c++) {

                let num;

                do {
                    num = Math.floor(Math.random() * 9) + 1;
                }
                while (
                    !isSafeInBox(rowStart, colStart, num)
                );

                currentBoard[rowStart + r][colStart + c] = num;
            }
        }
    }

    function fillDiagonal() {

        for (let i = 0; i < 9; i += 3) {
            fillBox(i, i);
        }
    }

    function formatTime(sec){

    const minutes=Math.floor(sec/60);
    const seconds=sec%60;

    return String(minutes).padStart(2,'0')
        + ":"
        + String(seconds).padStart(2,'0');
    }

    function startTimer(){

        clearInterval(timerInterval);

        elapsedSeconds=0;

        $("#timer").text("00:00");

        timerInterval=setInterval(()=>{

            elapsedSeconds++;

            $("#timer").text(
                formatTime(elapsedSeconds)
            );

        },1000);
    }

    function stopTimer(){

        clearInterval(timerInterval);
    }

    function generatePuzzle() {

        $("#loadingOverlay").removeClass("d-none");

        setTimeout(() => {

            currentBoard = Array.from(
                { length: 9 },
                () => Array(9).fill(0)
            );

            fillDiagonal();

            solve(currentBoard);

            let holes = getDifficultyHoles();

            while (holes > 0) {

                let cell = Math.floor(Math.random() * 81);

                let row = Math.floor(cell / 9);

                let col = cell % 9;

                if (currentBoard[row][col] !== 0) {

                    currentBoard[row][col] = 0;

                    holes--;
                }
            }

            originalBoard =
                JSON.parse(JSON.stringify(currentBoard));

            renderBoard();

            gameFinished=false;

            startTimer();

            $("#loadingOverlay").addClass("d-none");

            $("#resultOverlay").addClass("d-none");

        }, 100);
    }

    function renderBoard() {

        for (let r = 0; r < 9; r++) {

            for (let c = 0; c < 9; c++) {

                const input =
                    $(`#cell-${r}-${c}`);

                input
                    .val("")
                    .removeClass(
                        "initial solved-cell error"
                    )
                    .prop("disabled", false);

                if (originalBoard[r][c] !== 0) {

                    input
                        .val(originalBoard[r][c])
                        .addClass("initial")
                        .prop("disabled", true);
                }
            }
        }
    }

    function resetPuzzle() {

        renderBoard();

        $("#resultOverlay").addClass("d-none");

        $("#errorMsg").addClass("d-none");

        startTimer();
        gameFinished=false;
    }

    function readBoardDOM() {

        const board =
            Array.from(
                { length: 9 },
                () => Array(9).fill(0)
            );

        for (let r = 0; r < 9; r++) {

            for (let c = 0; c < 9; c++) {

                let value =
                    $(`#cell-${r}-${c}`).val();

                if (value !== "") {

                    board[r][c] =
                        parseInt(value);
                }
            }
        }

        return board;
    }

    function validateBoardDOM() {

        const board = readBoardDOM();

        let valid = true;

        $(".sudoku-input")
            .removeClass("error");

        for (let r = 0; r < 9; r++) {

            for (let c = 0; c < 9; c++) {

                if (board[r][c] !== 0) {

                    let value = board[r][c];

                    board[r][c] = 0;

                    if (
                        !isValid(
                            board,
                            r,
                            c,
                            value
                        )
                    ) {

                        $(`#cell-${r}-${c}`)
                            .addClass("error");

                        valid = false;
                    }

                    board[r][c] = value;
                }
            }
        }

        return valid;
    }

    function saveScore(seconds){

        let scores =
            JSON.parse(
                localStorage.getItem("sudokuLeaderboard")
            ) || [];

        scores.push(seconds);

        scores.sort((a,b)=>a-b);

        scores = scores.slice(0,5);

        localStorage.setItem(
            "sudokuLeaderboard",
            JSON.stringify(scores)
        );

        renderLeaderboard();
    }

    function renderLeaderboard(){

        const scores =
            JSON.parse(
                localStorage.getItem("sudokuLeaderboard")
            ) || [];

        const list = $("#leaderboardList");

        if(!list.length) return;

        list.empty();

        scores.forEach(score=>{

            list.append(`
                <li>${formatTime(score)}</li>
            `);

        });
    }

    function checkWin(){

        if(gameFinished) return;

        const board = readBoardDOM();

        for(let r=0;r<9;r++){

            for(let c=0;c<9;c++){

                if(board[r][c]===0){
                    return;
                }
            }
        }

        if(!validateBoardDOM()){
            return;
        }

        gameFinished = true;

        stopTimer();

        saveScore(elapsedSeconds);

        $("#resultOverlay").removeClass("d-none");
    }

    function solvePuzzle() {

        const board = readBoardDOM();

        if (!validateBoardDOM()) {

            $("#errorMsg")
                .removeClass("d-none");

            setTimeout(() => {

                $("#errorMsg")
                    .addClass("d-none");

            }, 3000);

            return;
        }

        if (solve(board)) {

            for (let r = 0; r < 9; r++) {

                for (let c = 0; c < 9; c++) {

                    const input =
                        $(`#cell-${r}-${c}`);

                    if (
                        !input.hasClass("initial")
                    ) {

                        input
                            .val(board[r][c])
                            .addClass(
                                "solved-cell"
                            );
                    }
                }
            }

            gameFinished = true;

            stopTimer();
            saveScore(elapsedSeconds);

            setTimeout(() => {
                $("#resultOverlay").removeClass("d-none");
            }, 500);

        } 
        
        else {

            $("#errorMsg")
                .removeClass("d-none");

            setTimeout(() => {

                $("#errorMsg").addClass("d-none");

            }, 3000);
        }
    }

    $("#generateBtn").on("click", generatePuzzle);

    $("#playAgainBtn").on("click", generatePuzzle);

    $("#resetBtn").on("click", resetPuzzle);

    $("#solveBtn").on("click", solvePuzzle);

    $("#difficultySelect").on("change", generatePuzzle);

    initGrid();
    generatePuzzle();
    renderLeaderboard();

});