window.addEventListener("DOMContentLoaded", function(){
    CREATE_DIALOG(document.querySelector("#selectmode").innerHTML);
});

function UPDATE_HUD() {
    const collectedCount = document.querySelectorAll("#tiles-grid ul li button.matched").length;
    const remainingCount = 40 - collectedCount;
    const progressPercent = Math.round((collectedCount / 40) * 100);

    // Update progress bar
    const pBar = document.querySelector("#game-progress-bar");
    if (pBar) pBar.style.width = `${progressPercent}%`;

    // Update stats labels
    const dCollected = document.querySelector("#desktop-collected");
    const dMoves = document.querySelector("#desktop-moves");
    const mCollected = document.querySelector("#mobile-collected");
    const mRemaining = document.querySelector("#mobile-remaining");
    const mMoves = document.querySelector("#mobile-moves");

    if (dCollected) dCollected.textContent = `${collectedCount} / 40`;
    if (dMoves) dMoves.textContent = `${moves}`;
    if (mCollected) mCollected.textContent = `${collectedCount} / 40`;
    if (mRemaining) mRemaining.textContent = `${remainingCount}`;
    if (mMoves) mMoves.textContent = `${moves}`;

    // Compatibility update for any original elements
    INFO.forEach(info => {
        info.innerHTML = `Collected: ${collectedCount}/40<br/>(${remainingCount} remaining)`;
    });

    // Update two-player pills
    if (gameMode === "two players") {
        const p1Pill = document.querySelector("#p1-pill");
        const p2Pill = document.querySelector("#p2-pill");
        const p1Score = document.querySelector("#hud-p1-score");
        const p2Score = document.querySelector("#hud-p2-score");
        const p1Name = document.querySelector("#hud-p1-name");
        const p2Name = document.querySelector("#hud-p2-name");
        const mobileTurnText = document.querySelector("#mobile-turn-text");

        if (p1Name) p1Name.textContent = player1.name || "P1";
        if (p2Name) p2Name.textContent = player2.name || "P2";
        if (p1Score) p1Score.textContent = player1.collected;
        if (p2Score) p2Score.textContent = player2.collected;

        if (p1Pill) p1Pill.classList.toggle("active", Boolean(player1.isPlaying));
        if (p2Pill) p2Pill.classList.toggle("active", Boolean(player2.isPlaying));

        const activeName = player1.isPlaying ? player1.name : player2.name;
        if (mobileTurnText) mobileTurnText.textContent = `${activeName}'s turn`;

        // Update legacy headers if present
        const legacyTwoPlayer = document.querySelector("h4#two-player-mode");
        if (legacyTwoPlayer) {
            legacyTwoPlayer.innerHTML = `
                <p>${player1.name}: ${player1.collected}</p>
                <p>${player2.name}: ${player2.collected}</p>
            `;
        }
    }
}

function SET_GAME_MODE(mode) {
    gameMode = mode;
    moves = 0;

    if (gameMode === "one player") {
        REMOVE_DIALOG();
        document.querySelector("#score-wrap").style.display = "none";
        document.querySelector("#single-player-hud").style.display = "flex";
        document.querySelector("#mobile-turn-indicator").classList.add("pseudo");

        tiles.forEach((tile) => {
            tile.disabled = false;
        });

        UPDATE_HUD();
        return;
    } else {
        CREATE_DIALOG(document.querySelector("#twoplayersdata").innerHTML);
    }
}

function VALIDATE_PLAYER_NAME(el, other, btn){
    const v1 = el.value.trim();
    const v2 = other ? other.value.trim() : "";

    // Update char counter
    const p1Count = document.querySelector("#p1-chars");
    const p2Count = document.querySelector("#p2-chars");
    const p1Input = document.querySelector("#player1");
    const p2Input = document.querySelector("#player2");

    if (p1Count && p1Input) p1Count.textContent = `${p1Input.value.length}/7`;
    if (p2Count && p2Input) p2Count.textContent = `${p2Input.value.length}/7`;

    const isValid1 = v1.length >= 3 && v1.length <= 7;
    const isValid2 = v2.length >= 3 && v2.length <= 7;

    const submitBtn = btn || document.querySelector("#submit-players-btn");
    if (submitBtn) {
        submitBtn.disabled = !(isValid1 && isValid2);
    }
}

function START_TWOPLAYER_MODE(e) {
    e.preventDefault();
    moves = 0;
    
    player1 = {
        name: "Player 1",
        collected: 0,
        isPlaying: true
    };
    
    player2 = {
        name: "Player 2",
        collected: 0,
        isPlaying: false
    };

    const pl1 = document.querySelector("#player1").value.trim();
    const pl2 = document.querySelector("#player2").value.trim();

    if (pl1.toLowerCase() === pl2.toLowerCase()) {
        CREATE_DIALOG(`
            <div class='modal-content message-modal'>
                <div class="modal-icon-badge" style="background: rgba(239, 68, 68, 0.15); border-color: rgba(239, 68, 68, 0.3); color: #f87171;">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                </div>
                <h3>Duplicate Name</h3>
                <p>Player 1 and Player 2 cannot have the same name. Please choose unique handles.</p>
                <button class="primary-btn" onclick='SET_GAME_MODE("two players")'>Got It</button>
            </div>
        `);
        return;
    }

    player1.name = pl1;
    player2.name = pl2;
    player1.isPlaying = true;
    player2.isPlaying = false;

    document.querySelector("#score-wrap").style.display = "flex";
    document.querySelector("#single-player-hud").style.display = "none";
    document.querySelector("#mobile-turn-indicator").classList.remove("pseudo");

    REMOVE_DIALOG();
    tiles.forEach((tile) => {
        tile.disabled = false;
    });

    UPDATE_HUD();
}

function SHUFFLE_ARRAY(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function CREATE_ASSETS() {
    newArray = [...assets, ...assets];
    assets = SHUFFLE_ARRAY(newArray);
}

function RENDER_ASSETS(array){
    TILE.innerHTML = "";
    array.forEach((asset) => {
        TILE.innerHTML += `
            <li>
                <button class="card-btn" disabled data-val="${asset}">
                    <div class="card-inner">
                        <div class="card-face card-back">
                            <div class="card-pattern">
                                <i class="fa-solid fa-gem"></i>
                            </div>
                        </div>
                        <div class="card-face card-front">
                            <span class="card-val">${asset}</span>
                        </div>
                    </div>
                </button>
            </li>
        `;
    });
    tiles = [...document.querySelectorAll("#tiles-grid ul li button")];
}

function NEW_GAME(){
    assets = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,17,18,19,20];
    TILE.innerHTML = "";
    moves = 0;
    tile1 = undefined;
    tile2 = undefined;
    collected = [];

    const scoreWrap = document.querySelector("#score-wrap");
    if (scoreWrap) scoreWrap.style.display = "none";

    const singleHud = document.querySelector("#single-player-hud");
    if (singleHud) singleHud.style.display = "flex";

    const mobileTurn = document.querySelector("#mobile-turn-indicator");
    if (mobileTurn) mobileTurn.classList.add("pseudo");

    CREATE_ASSETS();
    RENDER_ASSETS(assets);
    UPDATE_HUD();
    CREATE_DIALOG(document.querySelector("#selectmode").innerHTML);

    tiles.forEach(tile => {
        tile.onclick = function(){
            if (tile1 && tile2) {
                return;
            } else {
                if (tile.classList.contains("flipped") || tile.classList.contains("matched")) {
                    return;
                }

                SoundEffects.playFlip();

                if (!tile1) {
                    tile1 = tile;
                    tile1.classList.add("flipped");
                } else {
                    tile2 = tile;
                    tile2.classList.add("flipped");
                    COMPARE_TILES(tile1, tile2);
                }
            }
        };
    });
}

function CHECK_IS_COMPLETE() {
    const matchedCount = document.querySelectorAll("#tiles-grid ul li button.matched").length;
    if (matchedCount === 40) {
        SoundEffects.playWin();
        Confetti.launch();

        setTimeout(() => {
            if (gameMode === "two players") {
                if (player1.collected > player2.collected) {
                    CREATE_DIALOG(`
                        <div class='modal-content complete-modal'>
                            <i class='fa-solid fa-trophy complete-icon'></i>
                            <h2>${player1.name} Wins!</h2>
                            <p>Outstanding memory! Crowned the champion.</p>
                            <div class="complete-stats-box">
                                <div class="complete-stat-item">
                                    <span class="cs-label">${player1.name}</span>
                                    <span class="cs-val" style="color: #34d399;">${player1.collected}</span>
                                </div>
                                <div class="complete-stat-item">
                                    <span class="cs-label">${player2.name}</span>
                                    <span class="cs-val">${player2.collected}</span>
                                </div>
                                <div class="complete-stat-item">
                                    <span class="cs-label">Total Moves</span>
                                    <span class="cs-val">${moves}</span>
                                </div>
                            </div>
                            <button class="primary-btn" onclick='NEW_GAME()'>Play Again</button>
                        </div>
                    `);
                } else if (player2.collected > player1.collected) {
                    CREATE_DIALOG(`
                        <div class='modal-content complete-modal'>
                            <i class='fa-solid fa-trophy complete-icon'></i>
                            <h2>${player2.name} Wins!</h2>
                            <p>Outstanding memory! Crowned the champion.</p>
                            <div class="complete-stats-box">
                                <div class="complete-stat-item">
                                    <span class="cs-label">${player2.name}</span>
                                    <span class="cs-val" style="color: #34d399;">${player2.collected}</span>
                                </div>
                                <div class="complete-stat-item">
                                    <span class="cs-label">${player1.name}</span>
                                    <span class="cs-val">${player1.collected}</span>
                                </div>
                                <div class="complete-stat-item">
                                    <span class="cs-label">Total Moves</span>
                                    <span class="cs-val">${moves}</span>
                                </div>
                            </div>
                            <button class="primary-btn" onclick='NEW_GAME()'>Play Again</button>
                        </div>
                    `);
                } else {
                    CREATE_DIALOG(`
                        <div class='modal-content complete-modal'>
                            <i class='fa-solid fa-handshake-simple complete-icon tie-icon'></i>
                            <h2>It's a Tie!</h2>
                            <p>Both players showed equal mastery.</p>
                            <div class="complete-stats-box">
                                <div class="complete-stat-item">
                                    <span class="cs-label">Final Score</span>
                                    <span class="cs-val">${player1.collected} - ${player2.collected}</span>
                                </div>
                                <div class="complete-stat-item">
                                    <span class="cs-label">Total Moves</span>
                                    <span class="cs-val">${moves}</span>
                                </div>
                            </div>
                            <button class="primary-btn" onclick='NEW_GAME()'>Play Again</button>
                        </div>
                    `);
                }
            } else {
                CREATE_DIALOG(`
                    <div class='modal-content complete-modal'>
                        <i class='fa-solid fa-crown complete-icon'></i>
                        <h2>Board Cleared!</h2>
                        <p>You matched all 20 pairs with incredible precision.</p>
                        <div class="complete-stats-box">
                            <div class="complete-stat-item">
                                <span class="cs-label">Cards</span>
                                <span class="cs-val" style="color: #34d399;">40 / 40</span>
                            </div>
                            <div class="complete-stat-item">
                                <span class="cs-label">Moves Taken</span>
                                <span class="cs-val">${moves}</span>
                            </div>
                        </div>
                        <button class="primary-btn" onclick='NEW_GAME()'>Play Again</button>
                    </div>
                `);
            }
        }, 500);
    }
}

function COUNT_COLLECTED(){
    if (gameMode === "two players") {
        if (player1.isPlaying) {
            player1.collected += 2;
        } else {
            player2.collected += 2;
        }
    }
    UPDATE_HUD();
}

function COMPARE_TILES(first, second){
    moves += 1;
    const val1 = first.getAttribute("data-val");
    const val2 = second.getAttribute("data-val");

    if (val1 === val2) {
        SoundEffects.playMatch();
        setTimeout(() => {
            [first, second].forEach(tile => {
                tile.classList.remove("flipped");
                tile.classList.add("matched");
                tile.disabled = true;
            });
            COUNT_COLLECTED();
            CHECK_IS_COMPLETE();
            tile1 = undefined;
            tile2 = undefined;
        }, 850);
    } else {
        SoundEffects.playMismatch();
        setTimeout(() => {
            [first, second].forEach(tile => {
                tile.classList.remove("flipped");
            });
            tile1 = undefined;
            tile2 = undefined;
        }, 1100);
    }

    if (gameMode === "two players") {
        setTimeout(() => {
            const temp = player1.isPlaying;
            player1.isPlaying = player2.isPlaying;
            player2.isPlaying = temp;
            UPDATE_HUD();
        }, 1150);
    } else {
        UPDATE_HUD();
    }
}

function GET_ABOUT(file){
    try {
        var request = new XMLHttpRequest();
        request.open("GET", file);
        request.onload = function (e) {
            var text = e.target.status === 200 ? e.target.responseText : "";
            RENDER_ABOUT_DIALOG(text);
        };
        request.onerror = function() {
            RENDER_ABOUT_DIALOG("");
        };
        request.send();
    } catch (error) {
        RENDER_ABOUT_DIALOG("");
    }
}

function RENDER_ABOUT_DIALOG(markdownText) {
    const dialogHTML = `
        <div class="modal-content about-modal">
            <button class="back-btn icon-btn" title="Back" onclick='CREATE_DIALOG(document.querySelector("#pause-menu").innerHTML)'>
                <i class="fa-solid fa-arrow-left"></i>
            </button>
            <div class="modal-header">
                <div class="modal-icon-badge">
                    <i class="fa-solid fa-brain"></i>
                </div>
                <h2>About MemRush</h2>
                <p class="modal-subtitle">Fast-paced memory training & duel game</p>
            </div>
            <div class="about-body">
                <p>MemRush tests and expands your working memory. Flip tiles to reveal hidden numbers, memorize their positions, and pair them up before you lose track!</p>
                <p>Challenge a friend in <strong>Head to Head</strong> mode — take turns matching pairs, claim points, and crown the undisputed memory champion.</p>
                <div class="about-footer">
                    <span>All rights reserved. &copy; 2025 MemRush</span>
                </div>
            </div>
        </div>
    `;
    CREATE_DIALOG(dialogHTML);
}

// Global window exposure
window.SET_GAME_MODE = SET_GAME_MODE;
window.VALIDATE_PLAYER_NAME = VALIDATE_PLAYER_NAME;
window.START_TWOPLAYER_MODE = START_TWOPLAYER_MODE;
window.NEW_GAME = NEW_GAME;
window.GET_ABOUT = GET_ABOUT;
window.CREATE_DIALOG = CREATE_DIALOG;
window.REMOVE_DIALOG = REMOVE_DIALOG;

NEW_GAME();
