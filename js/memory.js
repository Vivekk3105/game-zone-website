$(document).ready(function () {

    const emojis = [
        '🎮','🕹️','🎲','🎯',
        '🎰','🎳','👾','🚀',
        '🛸','🚁'
    ];

    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let moves = 0;
    let seconds = 0;

    let timer = null;
    let timerStarted = false;
    let lockBoard = false;

    loadBestScore();

    function loadBestScore() {
        const difficulty = $('#difficultySelect').val();
        const best = localStorage.getItem(
            `gamezone_memory_${difficulty}`
        );

        $('#bestScore').text(best || '--');
    }

    function getGridSize() {

        const diff =
            $('#difficultySelect').val();

        if (diff === 'easy')
            return { pairs: 6 };

        if (diff === 'medium')
            return { pairs: 8 };

        return { pairs: 10 };
    }

    function shuffle(array) {

        for (
            let i = array.length - 1;
            i > 0;
            i--
        ) {

            let j =
                Math.floor(
                    Math.random() * (i + 1)
                );

            [array[i], array[j]] =
            [array[j], array[i]];
        }

        return array;
    }

    function formatTime(sec) {

        let min =
            Math.floor(sec / 60);

        let s = sec % 60;

        return (
            String(min).padStart(2,'0')
            + ':' +
            String(s).padStart(2,'0')
        );
    }

    function startTimer() {

        if (timer) clearInterval(timer);

        timer = setInterval(() => {

            seconds++;

            $('#timeDisplay')
                .text(formatTime(seconds));

        }, 1500);
    }

    function initGame() {

        clearInterval(timer);

        timerStarted = false;
        seconds = 0;

        $('#timeDisplay').text('00:00');

        moves = 0;
        matchedPairs = 0;

        flippedCards = [];

        lockBoard = false;

        $('#moveCount').text(0);

        $('#winOverlay')
            .addClass('d-none');

        const board =
            $('#memoryBoard');

        board.empty();

        const config =
            getGridSize();

        board.removeClass(
            'board-easy board-medium board-hard'
        );

        board.addClass(
            'board-' +
            $('#difficultySelect').val()
        );

        let gameEmojis =
            emojis.slice(0, config.pairs);

        cards = [
            ...gameEmojis,
            ...gameEmojis
        ];

        shuffle(cards);

        cards.forEach((emoji) => {

            board.append(`
                <div class="memory-card" data-emoji="${emoji}">
                    <div class="card-back"></div>
                    <div class="card-front">${emoji}</div>
                </div>
            `);

        });

        $('.memory-card')
            .on('click', flipCard);

        loadBestScore();
    }

    function flipCard() {

        if (lockBoard) return;

        if (
            flippedCards.length >= 2
        ) return;

        if (
            $(this).hasClass('flipped')
        ) return;

        if (!timerStarted) {

            timerStarted = true;

            startTimer();
        }

        $(this).addClass('flipped');

        flippedCards.push($(this));

        if (
            flippedCards.length === 2
        ) {

            moves++;

            $('#moveCount')
                .text(moves);

            checkForMatch();
        }
    }

    function checkForMatch() {

        const first =
            flippedCards[0];

        const second =
            flippedCards[1];

        const match =
            first.data('emoji') ===
            second.data('emoji');

        if (match) {

            first
                .find('.card-front')
                .addClass('matched');

            second
                .find('.card-front')
                .addClass('matched');

            flippedCards = [];

            matchedPairs++;

            const config =
                getGridSize();

            if (
                matchedPairs ===
                config.pairs
            ) {
                gameWon();
            }

        } else {

            lockBoard = true;

            setTimeout(() => {

                first.removeClass(
                    'flipped'
                );

                second.removeClass(
                    'flipped'
                );

                flippedCards = [];

                lockBoard = false;

            }, 900);
        }
    }

    function gameWon() {

        clearInterval(timer);

        $('#finalTime')
            .text(formatTime(seconds));

        $('#finalMoves')
            .text(moves);

        const difficulty =
            $('#difficultySelect').val();

        const storageKey =
            `gamezone_memory_${difficulty}`;

        const best =
            localStorage.getItem(storageKey);

        if (
            !best ||
            moves < parseInt(best)
        ) {

            localStorage.setItem(
                storageKey,
                moves
            );

            $('#bestScore')
                .text(moves);
        }

        setTimeout(() => {

            $('#winOverlay')
                .removeClass('d-none');

        }, 500);
    }

    $('#restartBtn')
        .on('click', initGame);

    $('#playAgainBtn')
        .on('click', initGame);

    $('#difficultySelect')
        .on('change', initGame);

    initGame();

});