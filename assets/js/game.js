window.addEventListener("DOMContentLoaded", function(){
    CREATE_DIALOG(this.document.querySelector("#selectmode").innerHTML);
});

function SET_GAME_MODE(mode) {
    gameMode = mode;
    GAME_MODE.innerHTML = `Mode:<br/>${gameMode}`;

    if (gameMode === "one player") {
        REMOVE_DIALOG();
        NOW_PLAYING.innerHTML = "";
        NOW_PLAYING.setAttribute("class", "pseudo");
        tiles.map((tile) => {
            tile.disabled = false;
        });
        return;
    } else {
        CREATE_DIALOG(document.querySelector("#twoplayersdata").innerHTML);
    }
}

function VALIDATE_PLAYER_NAME(el, other, btn){
    if ((el.value.trim() && other.value.trim()) && ((el.value.trim().length <= 7) && (other.value.trim().length <= 7))) {
        btn.disabled = false;
    } else {
        btn.disabled = true;
    }
}

function START_TWOPLAYER_MODE(e) {
    e.preventDefault();
    var pl1 = document.querySelector("#player1").value.trim();
    var pl2 = document.querySelector("#player2").value.trim();

    if (pl1 === pl2) {
        CREATE_DIALOG(`
            <div class='message'>
                <h3>OOPS!</h3>
                <p>Player should not be the same.</p>
                <button onclick='SET_GAME_MODE("two players")'>Got It</button>
            </div>
        `);
        return;
    }

    player1.name = pl1;
    player2.name = pl2;
    player1.isPlaying = true;
    document.querySelector("#score-wrap").style.display = "block";
    document.querySelector("header h4").innerHTML = `
        <p>${player1.name}: ${player1.collected}</p>
        <p>${player2.name}: ${player2.collected}</p>
    `;
    document.querySelector("header h4").setAttribute("id", "two-player-mode");

    REMOVE_DIALOG();
    tiles.map((tile) => {
        tile.disabled = false;
    });
    NOW_PLAYING.setAttribute("class", "");
    NOW_PLAYING.innerHTML += `<p>Now playing:<br/>${player1.isPlaying ? player1.name : player2.name}</p>`;
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
    array.map((asset) => {
        TILE.innerHTML += `
            <li>
                <button disabled>${asset}</button>
            </li>
        `
    });
    tiles = [...document.querySelectorAll("#tiles-grid ul li button")];
}

function NEW_GAME(){
    assets = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,17,18];
    TILE.innerHTML = ""
    NOW_PLAYING.innerHTML = "";
    GAME_MODE.innerHTML = "";
    document.querySelector("#score-wrap h4").innerHTML = "";
    document.querySelector("#score-wrap").style.display = "none";
    CREATE_ASSETS();
    RENDER_ASSETS(assets);
    CREATE_DIALOG(document.querySelector("#selectmode").innerHTML);
    tiles.map(tile => {
        tile.onclick = function(){
            if (tile1 && tile2) {
                return
            } else {
                if (!tile1) {
                    tile1 = tile;
                    tile1.inert = true;
                }else{
                    tile2 = tile;
                    tile2.inert = true;
                    COMPARE_TILES(tile1, tile2);
                }
                tile.style = "transform: rotateY(0deg); color: #fff";
            }
        }
    });
}

function CHECK_IS_COMPLETE() {
    if (collected.length === 36) {
        if (gameMode === "two players") {
            if (player1.collected > player2.collected) {
                CREATE_DIALOG(`
                    <div class='complete'>
                        <h1 class='fa-solid fa-check-circle'></h1>
                        <h2>${player1.name} wins!</h2>
                        <h3>Way to go!</h3>
                        <button onclick='NEW_GAME()'>New Game</button>
                    </div>
                `);
            } else if (player2.collected > player1.collected) {
                CREATE_DIALOG(`
                    <div class='complete'>
                        <h1 class='fa-solid fa-check-circle'></h1>
                        <h2>${player2.name} wins!</h2>
                        <h3>Way to go!</h3>
                        <button onclick='NEW_GAME()'>New Game</button>
                    </div>
                `);
            }else{
                CREATE_DIALOG(`
                    <div class='complete'>
                        <h1 class='fa-solid fa-handshake-simple'></h1>
                        <h2>It is a tie!</h2>
                        <button onclick='NEW_GAME()'>New Game</button>
                    </div>
                `);
            }
        } else {
            CREATE_DIALOG(`
                <div class='complete'>
                    <h1 class='fa-solid fa-check-circle'></h1>
                    <h2>Way to go!</h2>
                    <p>You have collected all card pairs.</p>
                    <button onclick='NEW_GAME()'>New Game</button>
                </div>
            `);
        }
    }
}

function COUNT_COLLECTED(){
    if (gameMode === "two players") {
        if (player1.isPlaying) {
            player1.collected += 1;
        } else {
            player2.collected += 1;
        }
        document.querySelector("header h4").innerHTML = `
            <p>${player1.name}: ${player1.collected}</p>
            <p>${player2.name}: ${player2.collected}</p>
        `;
        // setTimeout(() => {
        //     NOW_PLAYING.innerHTML = `<p>Now playing:<br/>${player1.isPlaying ? player1.name : player2.name}</p>`;
        // }, 1600);
    }
    collected = [...document.querySelectorAll("#tiles-grid ul li button:disabled")];
    INFO.innerHTML = `Collected: ${collected.length}/${tiles.length}<br/>(${tiles.length - collected.length} remaining.)`
}

function COMPARE_TILES(first, second){
    if (first.innerHTML === second.innerHTML) {
        setTimeout(() => {
            [first, second].map(tile => {
                tile.inert = false;
                tile.disabled = true;
                COUNT_COLLECTED();
                CHECK_IS_COMPLETE();
            });
            tile1 = undefined;
            tile2 = undefined;
        }, 1500);
    } else {
        setTimeout(() => {
            [first, second].map(tile => {
                tile.inert = false;
                tile.style = "transform: rotateY(180deg); color: transparent";
            });
            tile1 = undefined;
            tile2 = undefined;
        }, 1500);
    }

    if (gameMode === "two players") {
        setTimeout(() => {
            player1.isPlaying = player2.isPlaying;
            player2.isPlaying = !player1.isPlaying;
            NOW_PLAYING.innerHTML = `<p>Now playing:<br/>${player1.isPlaying ? player1.name : player2.name}</p>`;
        }, 1600);
    }
}

// CREATE_ASSETS();
// RENDER_ASSETS(assets);

NEW_GAME();