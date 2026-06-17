$(document).ready(function () {

    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    const gridSize = 20;

    let tileCount = canvas.width / gridSize;

    let snake = [];
    let velocity = { x: 0, y: 0 };
    let apple = {};

    let score = 0;
    let level = 1;

    let highScore = parseInt(localStorage.getItem("gamezone_snake_high")) || 0;

    let speed = 250; // Slower initial speed

    let gameLoopId = null;

    let isPlaying = false;
    let isPaused = false;
    let isGameOver = false;

    $("#highScore").text(highScore);

    function resizeCanvas() {

        if (window.innerWidth < 576) {

            canvas.width = 320;
            canvas.height = 320;

        } else {

            canvas.width = 400;
            canvas.height = 400;
        }

        tileCount = canvas.width / gridSize;

        draw();
    }

    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);

    function initGame() {

        snake = [
            { x: 10, y: 10 },
            { x: 9, y: 10 },
            { x: 8, y: 10 }
        ];

        velocity = { x: 1, y: 0 };

        score = 0;
        level = 1;
        speed = 250;

        isPaused = false;
        isGameOver = false;
        isPlaying = true;

        placeApple();
        updateScoreboard();

        $("#startOverlay").addClass("d-none");
        $("#pauseOverlay").addClass("d-none");
        $("#gameOverOverlay").addClass("d-none");

        clearTimeout(gameLoopId);

        gameLoop();
    }

    function gameLoop() {

        if (!isPlaying || isPaused || isGameOver) return;

        update();
        draw();

        gameLoopId = setTimeout(gameLoop, speed);
    }

    function update() {

        const head = {
            x: snake[0].x + velocity.x,
            y: snake[0].y + velocity.y
        };

        // Wall collision
        if (
            head.x < 0 ||
            head.y < 0 ||
            head.x >= tileCount ||
            head.y >= tileCount
        ) {
            gameOver();
            return;
        }

        // Self collision
        for (let segment of snake) {

            if (
                head.x === segment.x &&
                head.y === segment.y
            ) {
                gameOver();
                return;
            }
        }

        snake.unshift(head);

        if (
            head.x === apple.x &&
            head.y === apple.y
        ) {

            score += 10;

            if (score > highScore) {

                highScore = score;

                localStorage.setItem(
                    "gamezone_snake_high",
                    highScore
                );
            }

            // Level up every 50 points

            if (score % 50 === 0) {

                level++;

                speed = Math.max(
                    100,
                    Math.floor(speed * 0.90)
                );
            }

            updateScoreboard();

            placeApple();

        } else {

            snake.pop();
        }
    }

    function draw() {

        ctx.fillStyle = "#000";
        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        // Grid

        ctx.strokeStyle = "#111";

        for (let i = 0; i < tileCount; i++) {

            ctx.beginPath();
            ctx.moveTo(i * gridSize, 0);
            ctx.lineTo(i * gridSize, canvas.height);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0, i * gridSize);
            ctx.lineTo(canvas.width, i * gridSize);
            ctx.stroke();
        }

        // Apple

        ctx.fillStyle = "#ff4757";

        ctx.beginPath();

        ctx.arc(
            apple.x * gridSize + gridSize / 2,
            apple.y * gridSize + gridSize / 2,
            gridSize / 2 - 2,
            0,
            Math.PI * 2
        );

        ctx.fill();

        // Snake

        snake.forEach((segment, index) => {

            ctx.fillStyle =
                index === 0
                    ? "#2ed573"
                    : "#1dd1a1";

            ctx.fillRect(
                segment.x * gridSize + 1,
                segment.y * gridSize + 1,
                gridSize - 2,
                gridSize - 2
            );
        });
    }

    function placeApple() {

        let validPosition = false;

        while (!validPosition) {

            validPosition = true;

            apple = {

                x: Math.floor(
                    Math.random() * tileCount
                ),

                y: Math.floor(
                    Math.random() * tileCount
                )
            };

            for (let segment of snake) {

                if (
                    segment.x === apple.x &&
                    segment.y === apple.y
                ) {
                    validPosition = false;
                    break;
                }
            }
        }
    }

    function updateScoreboard() {

        $("#score").text(score);
        $("#highScore").text(highScore);
        $("#level").text(level);
    }

    function gameOver() {

        isGameOver = true;
        isPlaying = false;

        clearTimeout(gameLoopId);

        $("#finalScore").text(score);

        $("#gameOverOverlay").removeClass("d-none");
    }

    function togglePause() {

        if (!isPlaying || isGameOver) return;

        isPaused = !isPaused;

        if (isPaused) {

            $("#pauseOverlay").removeClass("d-none");

            $("#pauseGameBtn").text("Resume");

        } else {

            $("#pauseOverlay").addClass("d-none");

            $("#pauseGameBtn").text("Pause");

            gameLoop();
        }
    }

    $(document).keydown(function (e) {

        if (!isPlaying || isPaused) return;

        switch (e.key) {

            case "ArrowUp":
            case "w":
            case "W":

                if (velocity.y !== 1)
                    velocity = { x: 0, y: -1 };

                break;

            case "ArrowDown":
            case "s":
            case "S":

                if (velocity.y !== -1)
                    velocity = { x: 0, y: 1 };

                break;

            case "ArrowLeft":
            case "a":
            case "A":

                if (velocity.x !== 1)
                    velocity = { x: -1, y: 0 };

                break;

            case "ArrowRight":
            case "d":
            case "D":

                if (velocity.x !== -1)
                    velocity = { x: 1, y: 0 };

                break;

            case " ":

                togglePause();

                break;
        }
    });

    $("#btnUp").click(() => {

        if (velocity.y !== 1)
            velocity = { x: 0, y: -1 };
    });

    $("#btnDown").click(() => {

        if (velocity.y !== -1)
            velocity = { x: 0, y: 1 };
    });

    $("#btnLeft").click(() => {

        if (velocity.x !== 1)
            velocity = { x: -1, y: 0 };
    });

    $("#btnRight").click(() => {

        if (velocity.x !== -1)
            velocity = { x: 1, y: 0 };
    });

    $("#startBtn").click(initGame);

    $("#restartBtn").click(initGame);

    $("#pauseGameBtn").click(togglePause);

    $("#resumeBtn").click(togglePause);

    draw();
});