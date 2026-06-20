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

        const difficulty =
            $('#difficultySelect').val();

        const data =
            localStorage.getItem(
                `gamezone_memory_${difficulty}`
            );

        if (!data) {

            $('#bestScore').text('--');
            return;
        }

        try {

            const best = JSON.parse(data);

            if (
                best &&
                best.moves !== undefined &&
                best.time !== undefined
            ) {

                $('#bestScore').text(
                    `${best.moves}M / ${best.time}s`
                );

            } else {

                $('#bestScore').text(data);
            }

        } catch {

            $('#bestScore').text(data);
        }
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

            const j =
                Math.floor(
                    Math.random() * (i + 1)
                );

            [array[i], array[j]] =
            [array[j], array[i]];
        }

        return array;
    }

    function formatTime(sec) {

        const minutes =
            Math.floor(sec / 60);

        const secondsPart =
            sec % 60;

        return (
            String(minutes).padStart(2, '0')
            + ':'
            + String(secondsPart).padStart(2, '0')
        );
    }

    function startTimer() {

        clearInterval(timer);

        timer = setInterval(() => {

            seconds++;

            $('#timeDisplay')
                .text(
                    formatTime(seconds)
                );

        }, 1000);
    }

    function initGame() {

        clearInterval(timer);

        timerStarted = false;
        lockBoard = false;

        moves = 0;
        seconds = 0;
        matchedPairs = 0;

        cards = [];
        flippedCards = [];

        $('#moveCount').text('0');
        $('#timeDisplay').text('00:00');

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

        const gameEmojis =
            emojis.slice(
                0,
                config.pairs
            );

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
            $(this).hasClass('flipped')
        ) return;

        if (
            flippedCards.length >= 2
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

        const isMatch =
            first.data('emoji') ===
            second.data('emoji');

        if (isMatch) {

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

            }, 1200);
        }
    }

    function gameWon() {

        clearInterval(timer);

        $('#finalTime')
            .text(
                formatTime(seconds)
            );

        $('#finalMoves')
            .text(moves);

        const difficulty =
            $('#difficultySelect').val();

        const storageKey =
            `gamezone_memory_${difficulty}`;

        const currentRecord = {
            moves: moves,
            time: seconds
        };

        const bestRecord =
            JSON.parse(
                localStorage.getItem(
                    storageKey
                )
            );

        let shouldSave = false;

        if (!bestRecord) {

            shouldSave = true;

        } else if (
            moves < bestRecord.moves
        ) {

            shouldSave = true;

        } else if (
            moves === bestRecord.moves &&
            seconds < bestRecord.time
        ) {

            shouldSave = true;
        }

        if (shouldSave) {

            localStorage.setItem(
                storageKey,
                JSON.stringify(
                    currentRecord
                )
            );

            loadBestScore();
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