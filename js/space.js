/**
 * Space Invaders - Improved Version
 */

$(document).ready(function () {

    const canvas = document.getElementById("spaceCanvas");
    const ctx = canvas.getContext("2d");

    let gameLoopId;
    let isPlaying = false;
    let isGameOver = false;

    let score = 0;
    let wave = 1;

    let bestScore = localStorage.getItem("gamezone_space_high") || 0;
    $("#bestScore").text(bestScore);

    let lastShot = 0;

    // =========================
    // PLAYER
    // =========================

    const player = {
        x: canvas.width / 2 - 20,
        y: canvas.height - 50,
        width: 40,
        height: 20,
        speed: 6,
        dx: 0,

        draw() {
            ctx.fillStyle = "#00cec9";

            ctx.fillRect(this.x, this.y + 10, this.width, 10);
            ctx.fillRect(this.x + 15, this.y, 10, 10);
        },

        update() {
            this.x += this.dx;

            if (this.x < 0) this.x = 0;

            if (this.x + this.width > canvas.width) {
                this.x = canvas.width - this.width;
            }
        }
    };

    // =========================
    // BULLETS
    // =========================

    let bullets = [];

    function shoot() {

        if (!isPlaying) return;

        const now = Date.now();

        if (now - lastShot < 250) return;

        lastShot = now;

        bullets.push({
            x: player.x + player.width / 2 - 2,
            y: player.y,
            width: 4,
            height: 12,
            speed: 10
        });
    }

    function drawBullets() {

        ctx.fillStyle = "#ffffff";

        bullets.forEach(b => {
            ctx.fillRect(
                b.x,
                b.y,
                b.width,
                b.height
            );
        });
    }

    function updateBullets() {

        for (let i = 0; i < bullets.length; i++) {

            let b = bullets[i];

            b.y -= b.speed;

            if (b.y + b.height < 0) {
                bullets.splice(i, 1);
                i--;
                continue;
            }

            for (let j = 0; j < enemies.length; j++) {

                let e = enemies[j];

                if (
                    e.status &&
                    b.x < e.x + e.width &&
                    b.x + b.width > e.x &&
                    b.y < e.y + e.height &&
                    b.y + b.height > e.y
                ) {

                    e.status = 0;

                    bullets.splice(i, 1);
                    i--;

                    score += 10;
                    updateScore();

                    break;
                }
            }
        }
    }

    // =========================
    // ENEMIES
    // =========================

    let enemies = [];

    let enemyDirection = 1;
    let enemySpeed = 1;

    function createEnemies() {

        enemies = [];

        enemyDirection = 1;

        let rows = Math.min(2 + wave, 6);
        let cols = 8;

        enemySpeed = Math.min(
            0.8 + wave * 0.15,
            3
        );

        const spacingX = 55;
        const spacingY = 40;

        const startX =
            (canvas.width - (cols * spacingX)) / 2;

        for (let r = 0; r < rows; r++) {

            for (let c = 0; c < cols; c++) {

                enemies.push({

                    x: startX + c * spacingX,

                    y: 30 + r * spacingY,

                    width: 30,

                    height: 20,

                    status: 1
                });
            }
        }
    }

    function drawEnemies() {

        enemies.forEach(enemy => {

            if (!enemy.status) return;

            ctx.fillStyle = "#fd79a8";

            ctx.fillRect(
                enemy.x,
                enemy.y,
                enemy.width,
                enemy.height
            );

            ctx.fillStyle = "#000";

            ctx.fillRect(enemy.x + 5, enemy.y + 5, 5, 5);
            ctx.fillRect(enemy.x + 20, enemy.y + 5, 5, 5);
        });
    }

    function updateEnemies() {

        let hitEdge = false;

        enemies.forEach(enemy => {

            if (!enemy.status) return;

            enemy.x += enemyDirection * enemySpeed;

            if (
                enemy.x <= 0 ||
                enemy.x + enemy.width >= canvas.width
            ) {
                hitEdge = true;
            }

            if (
                enemy.y + enemy.height >= player.y &&
                enemy.x < player.x + player.width &&
                enemy.x + enemy.width > player.x
            ) {
                gameOver();
            }

            if (enemy.y + enemy.height >= canvas.height) {
                gameOver();
            }
        });

        if (hitEdge) {

            enemyDirection *= -1;

            enemies.forEach(enemy => {
                enemy.y += 15;
            });
        }
    }

    // =========================
    // SCORE
    // =========================

    function updateScore() {

        $("#score").text(score);

        if (score > bestScore) {

            bestScore = score;

            localStorage.setItem(
                "gamezone_space_high",
                bestScore
            );

            $("#bestScore").text(bestScore);
        }
    }

    // =========================
    // WAVES
    // =========================

    function checkWaveClear() {

        const aliveEnemies =
            enemies.filter(e => e.status === 1);

        if (
            aliveEnemies.length === 0 &&
            isPlaying
        ) {

            wave++;

            $("#wave").text(wave);

            createEnemies();
        }
    }

    // =========================
    // DRAW
    // =========================

    function drawBackground() {

        ctx.fillStyle = "#000";
        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        ctx.fillStyle = "#fff";

        for (let i = 0; i < 50; i++) {

            let x =
                (i * 137) % canvas.width;

            let y =
                (i * 91 + wave * 10) %
                canvas.height;

            ctx.fillRect(x, y, 2, 2);
        }
    }

    function draw() {

        drawBackground();

        player.draw();

        drawBullets();

        drawEnemies();
    }

    // =========================
    // UPDATE
    // =========================

    function update() {

        player.update();

        updateBullets();

        updateEnemies();

        checkWaveClear();
    }

    // =========================
    // GAME LOOP
    // =========================

    function loop() {

        if (!isPlaying) return;

        update();

        draw();

        gameLoopId =
            requestAnimationFrame(loop);
    }

    // =========================
    // START GAME
    // =========================

    function initGame() {

        score = 0;
        wave = 1;

        updateScore();

        $("#wave").text(wave);

        player.x =
            canvas.width / 2 - 20;

        player.dx = 0;

        bullets = [];

        createEnemies();

        isPlaying = true;
        isGameOver = false;

        $("#startOverlay").addClass("d-none");
        $("#gameOverOverlay").addClass("d-none");

        cancelAnimationFrame(gameLoopId);

        loop();
    }

    // =========================
    // GAME OVER
    // =========================

    function gameOver() {

        if (isGameOver) return;

        isPlaying = false;
        isGameOver = true;

        $("#finalScore").text(score);

        $("#gameOverOverlay")
            .removeClass("d-none");
    }

    // =========================
    // KEYBOARD
    // =========================

    $(document).keydown(function (e) {

        if (!isPlaying) return;

        if (e.key === "ArrowLeft") {
            player.dx = -player.speed;
        }

        if (e.key === "ArrowRight") {
            player.dx = player.speed;
        }

        if (
            e.key === " " ||
            e.key === "ArrowUp"
        ) {

            e.preventDefault();

            shoot();
        }
    });

    $(document).keyup(function (e) {

        if (
            e.key === "ArrowLeft" ||
            e.key === "ArrowRight"
        ) {
            player.dx = 0;
        }
    });

    window.addEventListener("blur", () => {
        player.dx = 0;
    });

    // =========================
    // MOBILE CONTROLS
    // =========================

    $("#btnLeft").on("pointerdown", function (e) {
        player.dx = -player.speed;
        e.preventDefault();
    });

    $("#btnRight").on("pointerdown", function (e) {
        player.dx = player.speed;
        e.preventDefault();
    });

    $("#btnLeft, #btnRight").on(
        "pointerup pointerleave",
        function (e) {
            player.dx = 0;
            e.preventDefault();
        }
    );

    $("#btnShoot").on(
        "pointerdown",
        function (e) {
            shoot();
            e.preventDefault();
        }
    );

    // =========================
    // BUTTONS
    // =========================

    $("#startBtn, #restartBtn")
        .click(initGame);

    // Initial Screen
    drawBackground();
    player.draw();

});

// const canvas = document.getElementById('spaceCanvas');
// const ctx = canvas.getContext('2d');

// function resizeCanvas() {

//     if (window.innerWidth <= 576) {
//         canvas.width = 360;
//         canvas.height = 650;
//     }
//     else if (window.innerWidth <= 768) {
//         canvas.width = 500;
//         canvas.height = 600;
//     }
//     else {
//         canvas.width = 600;
//         canvas.height = 400;
//     }
// }

// resizeCanvas();

// window.addEventListener("resize", resizeCanvas);