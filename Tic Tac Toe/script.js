// ===== State variables =====
let board = Array(9).fill(null);
let currentPlayer = "X";
let gameActive = true;

let playerNames = { X: "X", O: "O" };
let scores = { X: 0, O: 0 };      // is series mein kitne matches jeete
let matchesToWin = 2;             // series jeetne ke liye kitni wins chahiye
let matchNumber = 1;              // abhi konsa match chal raha hai

// ===== Elements =====
const setupEl = document.getElementById("setup");
const quickSetupEl = document.getElementById("quickSetup");
const quickSetupHeading = document.getElementById("quickSetupHeading");
const gameEl = document.getElementById("game");

const player1Input = document.getElementById("player1");
const player2Input = document.getElementById("player2");
const matchCountSelect = document.getElementById("matchCount");
const startButton = document.getElementById("startBtn");

const matchCountSelect2 = document.getElementById("matchCount2");
const startAgainBtn = document.getElementById("startAgainBtn");

const closeBtn1 = document.getElementById("closeBtn1");
const closeBtn2 = document.getElementById("closeBtn2");
const closeBtn3 = document.getElementById("closeBtn3");
const closedScreenEl = document.getElementById("closedScreen");
const closedScreenText = document.getElementById("closedScreenText");
const reopenBtn = document.getElementById("reopenBtn");

const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const scoreboardEl = document.getElementById("scoreboard");
const matchInfoEl = document.getElementById("matchInfo");
const nextMatchBtn = document.getElementById("nextMatchBtn");

const seriesModal = document.getElementById("seriesModal");
const seriesResultText = document.getElementById("seriesResultText");
const playAgainBtn = document.getElementById("playAgainBtn");
const newPlayersBtn = document.getElementById("newPlayersBtn");

// Har winning line (Rows, Columns, Diagonals)
const winPattern = [
    [0,1,2], [3,4,5], [6,7,8], // Rows
    [0,3,6], [1,4,7], [2,5,8], // Columns
    [0,4,8], [2,4,6]           // Diagonals
];

// ===== SHURU: Naye players, naam + match count (FULL SETUP) =====
startButton.addEventListener("click", () => {
    const name1 = player1Input.value.trim();
    const name2 = player2Input.value.trim();

    playerNames.X = name1 !== "" ? name1 : "X";
    playerNames.O = name2 !== "" ? name2 : "O";

    const totalMatches = parseInt(matchCountSelect.value, 10);
    beginSeries(totalMatches);
});

// ===== "Same Players - New Series" ke baad: sirf match count (QUICK SETUP) =====
startAgainBtn.addEventListener("click", () => {
    const totalMatches = parseInt(matchCountSelect2.value, 10);
    beginSeries(totalMatches);
});

// ===== Series shuru karna (naam pehle se set hone chahiye) =====
function beginSeries(totalMatches) {
    matchesToWin = Math.ceil(totalMatches / 2); // e.g. best of 5 -> 3 wins chahiye

    scores = { X: 0, O: 0 };
    matchNumber = 1;

    setupEl.classList.add("hidden");
    quickSetupEl.classList.add("hidden");
    gameEl.classList.remove("hidden");

    startNewMatch();
}

// ===== Ek naya match shuru karna (series ke andar) =====
function startNewMatch() {
    board = Array(9).fill(null);
    currentPlayer = "X";
    gameActive = true;
    nextMatchBtn.classList.add("hidden");

    updateScoreboard();
    matchInfoEl.textContent = `Match ${matchNumber} - Series mein jeetne ke liye ${matchesToWin} wins chahiye`;
    statusEl.textContent = `Turn: ${playerNames[currentPlayer]}`;
    renderBoard();
}

// ===== Scoreboard update =====
function updateScoreboard() {
    scoreboardEl.textContent =
        `${playerNames.X} ne ${scores.X} jeete   |   ${playerNames.O} ne ${scores.O} jeete`;
}

// ===== Board render karna =====
function renderBoard() {
    boardEl.innerHTML = "";
    board.forEach((value, index) => {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        if (value === "X") cell.classList.add("x");
        if (value === "O") cell.classList.add("o");
        cell.textContent = value ? value : "";
        cell.addEventListener("click", () => handleCellClick(index));
        boardEl.appendChild(cell);
    });
}

// ===== Cell click handle karna =====
function handleCellClick(index) {
    if (!gameActive || board[index] !== null) return;
    board[index] = currentPlayer;
    renderBoard();
    checkResult();
}

// ===== Match ka result check karna =====
function checkResult() {
    let won = false;
    for (const pattern of winPattern) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            won = true;
            break;
        }
    }

    if (won) {
        gameActive = false;
        scores[currentPlayer]++;
        updateScoreboard();

        // Check karo ke series khatam ho gayi ya nahi
        if (scores[currentPlayer] >= matchesToWin) {
            endSeries(currentPlayer);
        } else {
            statusEl.textContent = `${playerNames[currentPlayer]} match jeet gaya! 🎉`;
            matchNumber++;
            nextMatchBtn.classList.remove("hidden");
        }
        return;
    }

    if (!board.includes(null)) {
        gameActive = false;
        statusEl.textContent = "Ye match Draw raha!";
        matchNumber++;
        nextMatchBtn.classList.remove("hidden");
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusEl.textContent = `Turn: ${playerNames[currentPlayer]}`;
}

// ===== Next Match button =====
nextMatchBtn.addEventListener("click", () => {
    startNewMatch();
});

// ===== Series khatam hone par dialog dikhana =====
function endSeries(winnerSymbol) {
    const winnerName = playerNames[winnerSymbol];
    seriesResultText.textContent =
        `${winnerName} ne series jeet li! Final Score: ${playerNames.X} ${scores.X} - ${scores.O} ${playerNames.O}`;
    gameEl.classList.add("hidden");
    seriesModal.classList.remove("hidden");
}

// ===== "Same Players - New Series" =====
// Naam wahi rakho, sirf naya match count pucho
playAgainBtn.addEventListener("click", () => {
    seriesModal.classList.add("hidden");
    quickSetupHeading.textContent =
        `${playerNames.X} vs ${playerNames.O} - nayi series shuru karein`;
    quickSetupEl.classList.remove("hidden");
});

// ===== "New Players" =====
// Naam clear karo, poora setup form dobara dikhao
newPlayersBtn.addEventListener("click", () => {
    seriesModal.classList.add("hidden");
    player1Input.value = "";
    player2Input.value = "";
    setupEl.classList.remove("hidden");
});

// ===== Close (×) button - poora tab band karne ki koshish =====
function closeGame() {
    // Pehle sab kuch hide karo aur "band ho raha hai" message dikhao
    setupEl.classList.add("hidden");
    quickSetupEl.classList.add("hidden");
    gameEl.classList.add("hidden");
    seriesModal.classList.add("hidden");
    closedScreenEl.classList.remove("hidden");
    closedScreenText.textContent = "Tab band ho raha hai...";

    // Tab band karne ki koshish karo
    window.close();

    // Agar upar wali line kaam na kare (browser ne block kar diya),
    // to thori dair baad ye message dikha do
    setTimeout(() => {
        closedScreenText.textContent =
            "Browser ne is tab ko khud-ba-khud band karne se rok diya hai (security ki wajah se). Barah-e-karam is tab ko manually band kar dein (Ctrl+W ya tab ka X button).";
    }, 300);
}

closeBtn1.addEventListener("click", closeGame);
closeBtn2.addEventListener("click", closeGame);
closeBtn3.addEventListener("click", closeGame);

// ===== Reopen button - dobara shuru se setup dikhana =====
reopenBtn.addEventListener("click", () => {
    closedScreenEl.classList.add("hidden");
    player1Input.value = "";
    player2Input.value = "";
    setupEl.classList.remove("hidden");
});