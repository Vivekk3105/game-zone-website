/**
 * GameZone - Leaderboard JS
 */

$(document).ready(function() {
    
    const games = [
        { id: 'snake', name: 'Retro Snake' },
        { id: '2048', name: '2048' },
        { id: 'flappy', name: 'Flappy Clone' },
        { id: 'space', name: 'Space Invaders' },
        { id: 'memory', name: 'Memory Game' },
        { id: 'quiz', name: 'Quiz Master' }
    ];

    function renderLeaderboard(filter) {
        const container = $('#leaderboardContainer');
        container.empty();

        let foundScores = false;

        games.forEach(game => {
            if (filter !== 'all' && filter !== game.id) return;

            // Fetch from local storage
            let score = localStorage.getItem(`gamezone_${game.id}_high`);
            
            if (score) {
                foundScores = true;
                let formatScore = score;
                // For memory game, lower moves or time is better (assuming we store score differently)
                // We'll keep it simple: just show the raw score/moves string
                
                let cardHtml = `
                    <div class="leaderboard-card">
                        <h4 class="text-gradient mb-3">${game.name}</h4>
                        <div class="leaderboard-row">
                            <span class="rank-1">#1 Personal Best</span>
                            <span class="text-white fw-bold">${formatScore}</span>
                        </div>
                    </div>
                `;
                container.append(cardHtml);
            }
        });

        if (!foundScores) {
            container.append(`
                <div class="alert alert-secondary text-center" role="alert">
                    No high scores found locally yet. Go play some games!
                </div>
            `);
        }
    }

    // Initial render
    renderLeaderboard('all');

    // Handle filter change
    $('#gameSelect').on('change', function() {
        renderLeaderboard($(this).val());
    });

});
