/**
 * Flappy Bird Clone - Fixed Version
 */

$(document).ready(function () {

    const canvas = document.getElementById("flappyCanvas");
    const ctx = canvas.getContext("2d");

    let animationId;
    let score = 0;
    let bestScore = localStorage.getItem("gamezone_flappy_high") || 0;

    let isPlaying = false;
    let isGameOver = false;

    $("#bestScore").text(bestScore);

    // ======================
    // BIRD
    // ======================

    const bird = {
        x: 60,
        y: 220,
        width: 35,
        height: 25,

        gravity: 0.12,
        jumpPower: 3.8,
        velocity: 0,

        draw() {

            ctx.save();

            ctx.translate(
                this.x + this.width / 2,
                this.y + this.height / 2
            );

            let rotation = Math.min(
                this.velocity * 0.05,
                0.5
            );

            ctx.rotate(rotation);

            ctx.fillStyle = "#f1c40f";

            ctx.fillRect(
                -this.width / 2,
                -this.height / 2,
                this.width,
                this.height
            );

            ctx.fillStyle = "#fff";

            ctx.fillRect(
                8,
                -8,
                8,
                8
            );

            ctx.fillStyle = "#000";

            ctx.fillRect(
                11,
                -6,
                4,
                4
            );

            ctx.restore();
        },

        update() {

            this.velocity += this.gravity;
            this.y += this.velocity;

            if (this.y < 0) {
                this.y = 0;
                this.velocity = 0;
            }

            if (
                this.y + this.height >=
                canvas.height - 50
            ) {
                this.y =
                    canvas.height -
                    50 -
                    this.height;

                gameOver();
            }
        },

        flap() {
            this.velocity = -this.jumpPower;
        }
    };

    // ======================
    // PIPES
    // ======================

    const pipes = {

        list: [],

        width: 60,

        gap: 170,

        speed: 1.5,

        update() {

            if (frameCount % 150 === 0) {

                let minHeight = 60;
                let maxHeight = 220;

                this.list.push({

                    x: canvas.width,

                    topHeight:
                        Math.random() *
                            (maxHeight - minHeight) +
                        minHeight,

                    scored: false
                });
            }

            for (
                let i = 0;
                i < this.list.length;
                i++
            ) {

                let pipe = this.list[i];

                pipe.x -= this.speed;

                let bottomY =
                    pipe.topHeight + this.gap;

                // Collision

                if (
                    bird.x + bird.width >
                        pipe.x &&
                    bird.x <
                        pipe.x + this.width &&
                    (
                        bird.y <
                            pipe.topHeight ||
                        bird.y + bird.height >
                            bottomY
                    )
                ) {
                    gameOver();
                }

                // Score

                if (
                    !pipe.scored &&
                    pipe.x + this.width <
                        bird.x
                ) {

                    pipe.scored = true;

                    score++;

                    if (
                        score > bestScore
                    ) {

                        bestScore = score;

                        localStorage.setItem(
                            "gamezone_flappy_high",
                            bestScore
                        );
                    }

                    $("#score").text(score);
                    $("#bestScore").text(bestScore);
                }

                // Remove off-screen pipes

                if (
                    pipe.x + this.width <
                    0
                ) {

                    this.list.splice(i, 1);
                    i--;
                }
            }
        },

        draw() {

            ctx.fillStyle = "#2ecc71";

            this.list.forEach(pipe => {

                let bottomY =
                    pipe.topHeight +
                    this.gap;

                // Top pipe

                ctx.fillRect(
                    pipe.x,
                    0,
                    this.width,
                    pipe.topHeight
                );

                ctx.fillRect(
                    pipe.x - 3,
                    pipe.topHeight - 10,
                    this.width + 6,
                    10
                );

                // Bottom pipe

                ctx.fillRect(
                    pipe.x,
                    bottomY,
                    this.width,
                    canvas.height -
                        bottomY -
                        50
                );

                ctx.fillRect(
                    pipe.x - 3,
                    bottomY,
                    this.width + 6,
                    10
                );
            });
        },

        reset() {
            this.list = [];
        }
    };

    // ======================
    // GROUND
    // ======================

    const ground = {

        y: canvas.height - 50,

        draw() {

            ctx.fillStyle = "#ded895";

            ctx.fillRect(
                0,
                this.y,
                canvas.width,
                50
            );

            ctx.fillStyle = "#73bf2e";

            ctx.fillRect(
                0,
                this.y,
                canvas.width,
                10
            );
        }
    };

    let frameCount = 0;

    // ======================
    // DRAW
    // ======================

    function draw() {

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        // Sky

        ctx.fillStyle = "#70c5ce";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        pipes.draw();

        ground.draw();

        bird.draw();
    }

    // ======================
    // UPDATE
    // ======================

    function update() {

        bird.update();

        pipes.update();
    }

    // ======================
    // LOOP
    // ======================

    function gameLoop() {

        if (!isPlaying) return;

        update();

        draw();

        frameCount++;

        animationId =
            requestAnimationFrame(
                gameLoop
            );
    }

    // ======================
    // START GAME
    // ======================

    function startGame() {

        bird.y = 220;
        bird.velocity = 0;

        pipes.reset();

        frameCount = 0;

        score = 0;

        $("#score").text(0);

        isPlaying = true;
        isGameOver = false;

        $("#startOverlay")
            .addClass("d-none");

        $("#gameOverOverlay")
            .addClass("d-none");

        cancelAnimationFrame(
            animationId
        );

        gameLoop();
    }

    // ======================
    // GAME OVER
    // ======================

    function gameOver() {

        if (isGameOver) return;

        isPlaying = false;
        isGameOver = true;

        cancelAnimationFrame(
            animationId
        );

        $("#finalScore").text(score);

        $("#gameOverOverlay")
            .removeClass("d-none");
    }

    // ======================
    // INPUT
    // ======================

    function flap(e) {

        if (e) e.preventDefault();

        if (isGameOver) return;

        if (!isPlaying) {

            startGame();
        }

        bird.flap();
    }

    $(document).keydown(function (e) {

        if (
            e.code === "Space" ||
            e.code === "ArrowUp"
        ) {

            flap(e);
        }
    });

    $("#flappyCanvas").on(
        "mousedown touchstart",
        flap
    );

    $("#startBtn").click(
        startGame
    );

    $("#restartBtn").click(
        startGame
    );

    draw();
});