/**
 * Quiz Game Logic with 50 Questions
 */

$(document).ready(function() {
    
    // Database of 50 questions
    const questionDB = [
        // Category: Gaming
        { q: "What year was the original Super Mario Bros released?", options: ["1983", "1985", "1987", "1990"], ans: 1, cat: "gaming" },
        { q: "Which company created the Xbox?", options: ["Sony", "Nintendo", "Microsoft", "Sega"], ans: 2, cat: "gaming" },
        { q: "What is the highest-selling video game console of all time?", options: ["PlayStation 2", "Nintendo DS", "Game Boy", "PlayStation 4"], ans: 0, cat: "gaming" },
        { q: "Who is the main protagonist of the Legend of Zelda series?", options: ["Zelda", "Link", "Ganon", "Mario"], ans: 1, cat: "gaming" },
        { q: "In Minecraft, what material is needed to make a Nether Portal?", options: ["Diamond", "Obsidian", "Bedrock", "Gold"], ans: 1, cat: "gaming" },
        { q: "What is the best-selling video game of all time?", options: ["Tetris", "Minecraft", "GTA V", "Wii Sports"], ans: 1, cat: "gaming" },
        { q: "Which game features a battle royale mode called Warzone?", options: ["Battlefield", "Call of Duty", "Halo", "Overwatch"], ans: 1, cat: "gaming" },
        { q: "What color is Pac-Man?", options: ["Yellow", "Orange", "Red", "Blue"], ans: 0, cat: "gaming" },
        { q: "In which game do you fight against the Covenant?", options: ["Mass Effect", "Destiny", "Halo", "Gears of War"], ans: 2, cat: "gaming" },
        { q: "What is the name of the protagonist in Tomb Raider?", options: ["Lara Croft", "Samus Aran", "Aloy", "Jill Valentine"], ans: 0, cat: "gaming" },
        { q: "Which Pokémon is #001 in the Pokédex?", options: ["Pikachu", "Charmander", "Bulbasaur", "Squirtle"], ans: 2, cat: "gaming" },
        { q: "What is the name of Sonic the Hedgehog's sidekick?", options: ["Knuckles", "Tails", "Shadow", "Amy"], ans: 1, cat: "gaming" },
        { q: "In what game do players drop from a 'Battle Bus'?", options: ["PUBG", "Apex Legends", "Fortnite", "Free Fire"], ans: 2, cat: "gaming" },
        { q: "What company developed the Grand Theft Auto series?", options: ["Ubisoft", "EA", "Rockstar Games", "Activision"], ans: 2, cat: "gaming" },
        { q: "What is the fictional city where Batman: Arkham City takes place?", options: ["Metropolis", "Gotham", "Star City", "Central City"], ans: 1, cat: "gaming" },
        { q: "Which fighting game features the character 'Sub-Zero'?", options: ["Street Fighter", "Tekken", "Mortal Kombat", "Super Smash Bros"], ans: 2, cat: "gaming" },
        { q: "What is the highest rarity tier in World of Warcraft?", options: ["Epic", "Legendary", "Rare", "Mythic"], ans: 1, cat: "gaming" },
        { q: "Which game is known for the phrase 'The cake is a lie'?", options: ["Half-Life 2", "Portal", "Team Fortress 2", "Left 4 Dead"], ans: 1, cat: "gaming" },
        { q: "In League of Legends, how many players are on a team?", options: ["3", "4", "5", "6"], ans: 2, cat: "gaming" },
        { q: "Who created the game 'Stardew Valley'?", options: ["ConcernedApe", "Notch", "Toby Fox", "Zachtronics"], ans: 0, cat: "gaming" },
        { q: "What year did the PS4 come out?", options: ["2012", "2013", "2014", "2015"], ans: 1, cat: "gaming" },
        { q: "What is the max level in original World of Warcraft?", options: ["50", "60", "70", "80"], ans: 1, cat: "gaming" },
        { q: "Which console introduced the analog stick?", options: ["Nintendo 64", "PlayStation", "Sega Saturn", "Atari Jaguar"], ans: 0, cat: "gaming" },
        { q: "In Dark Souls, what are the safe havens called?", options: ["Taverns", "Bonfires", "Shrines", "Camps"], ans: 1, cat: "gaming" },
        { q: "Who is Mario's brother?", options: ["Wario", "Toad", "Luigi", "Bowser"], ans: 2, cat: "gaming" },

        // Category: Technology
        { q: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Tech Machine Learning", "Home Tool Markup Language", "Hyperlinks and Text Markup Language"], ans: 0, cat: "tech" },
        { q: "Who is known as the father of the computer?", options: ["Alan Turing", "Charles Babbage", "Bill Gates", "Steve Jobs"], ans: 1, cat: "tech" },
        { q: "What does CPU stand for?", options: ["Central Process Unit", "Computer Personal Unit", "Central Processing Unit", "Central Processor Unit"], ans: 2, cat: "tech" },
        { q: "Which company developed the Java programming language?", options: ["Microsoft", "Apple", "Sun Microsystems", "IBM"], ans: 2, cat: "tech" },
        { q: "What does RAM stand for?", options: ["Random Access Memory", "Read Access Memory", "Run All Memory", "Random Allocate Memory"], ans: 0, cat: "tech" },
        { q: "In what year was the first iPhone released?", options: ["2005", "2006", "2007", "2008"], ans: 2, cat: "tech" },
        { q: "What is the primary function of a router?", options: ["Store data", "Connect networks", "Cool PC", "Display images"], ans: 1, cat: "tech" },
        { q: "Which of these is not an operating system?", options: ["Linux", "Windows", "Oracle", "macOS"], ans: 2, cat: "tech" },
        { q: "What does HTTP stand for?", options: ["Hypertext Transfer Protocol", "Hyper Transfer Text Protocol", "High Tech Transfer Protocol", "Hyperlink Transfer Technology Protocol"], ans: 0, cat: "tech" },
        { q: "Who founded Microsoft?", options: ["Steve Jobs", "Bill Gates & Paul Allen", "Elon Musk", "Mark Zuckerberg"], ans: 1, cat: "tech" },
        { q: "Which of the following is a NoSQL database?", options: ["MySQL", "PostgreSQL", "MongoDB", "Oracle DB"], ans: 2, cat: "tech" },
        { q: "What does GUI stand for?", options: ["General User Interface", "Graphical User Interface", "Graphic Unit Interface", "Global User Index"], ans: 1, cat: "tech" },
        { q: "Which programming language is known for its use in Machine Learning?", options: ["PHP", "Ruby", "Python", "C"], ans: 2, cat: "tech" },
        { q: "What does SSD stand for?", options: ["Solid State Drive", "Super Speed Disk", "Solid Speed Drive", "Static State Disk"], ans: 0, cat: "tech" },
        { q: "What is the binary representation of the decimal number 5?", options: ["100", "101", "110", "111"], ans: 1, cat: "tech" },
        { q: "Who created Git?", options: ["Linus Torvalds", "Richard Stallman", "Ken Thompson", "Dennis Ritchie"], ans: 0, cat: "tech" },
        { q: "What does CSS stand for?", options: ["Cascading Style Sheets", "Computer Style Sheets", "Creative Style System", "Cascading System Styles"], ans: 0, cat: "tech" },
        { q: "What was the first mechanical computer called?", options: ["ENIAC", "Analytical Engine", "Turing Machine", "Colossus"], ans: 1, cat: "tech" },
        { q: "Which port is commonly used for HTTPS?", options: ["80", "21", "443", "22"], ans: 2, cat: "tech" },
        { q: "What does VPN stand for?", options: ["Virtual Private Network", "Visual Processing Node", "Virtual Public Network", "Variable Power Node"], ans: 0, cat: "tech" },
        { q: "What is the main component of a computer motherboard?", options: ["CPU Socket", "RAM slots", "Chipset", "All of the above"], ans: 3, cat: "tech" },
        { q: "Which company bought GitHub in 2018?", options: ["Google", "Amazon", "Microsoft", "Facebook"], ans: 2, cat: "tech" },
        { q: "What is the name of the first web browser?", options: ["Internet Explorer", "Netscape Navigator", "WorldWideWeb", "Mosaic"], ans: 2, cat: "tech" },
        { q: "What is Linux?", options: ["A browser", "An Operating System", "A programming language", "A brand of computer"], ans: 1, cat: "tech" },
        { q: "What does IP stand for?", options: ["Internal Protocol", "Internet Protocol", "Intranet Protocol", "Information Provider"], ans: 1, cat: "tech" }
    ];

    let currentQuestions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let timer;
    let timeLeft = 15;
    const maxQuestions = 10;
    let bestScore = localStorage.getItem('gamezone_quiz_high') || 0;

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function initQuiz() {
        const category = $('#categorySelect').val();
        
        // Filter questions
        if (category === 'all') {
            currentQuestions = [...questionDB];
        } else {
            currentQuestions = questionDB.filter(q => q.cat === category);
        }
        
        shuffleArray(currentQuestions);
        currentQuestions = currentQuestions.slice(0, maxQuestions);
        
        currentQuestionIndex = 0;
        score = 0;
        
        $('#startScreen, #resultScreen').addClass('d-none');
        $('#quizScreen').removeClass('d-none');
        
        loadQuestion();
    }

    function loadQuestion() {
        if (currentQuestionIndex >= currentQuestions.length) {
            endQuiz();
            return;
        }

        const q = currentQuestions[currentQuestionIndex];
        
        // Update UI
        $('#questionCounter').text(`Question ${currentQuestionIndex + 1}/${currentQuestions.length}`);
        $('#scoreDisplay').text(`Score: ${score}`);
        $('#questionText').text(q.q);
        
        // Update progress bar
        const progress = ((currentQuestionIndex + 1) / currentQuestions.length) * 100;
        $('#progressBar').css('width', `${progress}%`);
        
        // Populate options
        $('.option-btn').each(function(index) {
            $(this).text(q.options[index])
                   .removeClass('correct wrong')
                   .prop('disabled', false);
        });

        startTimer();
    }

    function startTimer() {
        timeLeft = 15;
        $('#timeRemaining').text(timeLeft);
        clearInterval(timer);
        
        timer = setInterval(function() {
            timeLeft--;
            $('#timeRemaining').text(timeLeft);
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                handleTimeout();
            }
        }, 1000);
    }

    function handleTimeout() {
        const correctIndex = currentQuestions[currentQuestionIndex].ans;
        $('.option-btn').prop('disabled', true);
        $(`.option-btn[data-index="${correctIndex}"]`).addClass('correct');
        
        setTimeout(nextQuestion, 1500);
    }

    function handleAnswer(selectedIndex) {
        clearInterval(timer);
        $('.option-btn').prop('disabled', true);
        
        const correctIndex = currentQuestions[currentQuestionIndex].ans;
        
        if (selectedIndex === correctIndex) {
            // Correct
            $(`.option-btn[data-index="${selectedIndex}"]`).addClass('correct');
            // Calculate points based on time left (max 10 points per question)
            let points = 5 + Math.floor((timeLeft / 15) * 5); // 5 base + up to 5 time bonus
            score += points;
            $('#scoreDisplay').text(`Score: ${score}`);
        } else {
            // Wrong
            $(`.option-btn[data-index="${selectedIndex}"]`).addClass('wrong');
            $(`.option-btn[data-index="${correctIndex}"]`).addClass('correct');
        }
        
        setTimeout(nextQuestion, 1500);
    }

    function nextQuestion() {
        currentQuestionIndex++;
        loadQuestion();
    }

    function endQuiz() {
        $('#quizScreen').addClass('d-none');
        $('#resultScreen').removeClass('d-none');
        
        $('#finalScore').text(score);
        
        if (score > bestScore) {
            bestScore = score;
            localStorage.setItem('gamezone_quiz_high', bestScore);
        }
    }

    // Event Listeners
    $('#startQuizBtn').click(initQuiz);
    $('#restartBtn').click(function() {
        $('#resultScreen').addClass('d-none');
        $('#startScreen').removeClass('d-none');
    });
    
    $('.option-btn').click(function() {
        const selectedIndex = parseInt($(this).attr('data-index'));
        handleAnswer(selectedIndex);
    });
});
