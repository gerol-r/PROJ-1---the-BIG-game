
//game starts on first card click

//timer starts on first card click

//game ends on all matches -or- when time is up

// click event needed to flip cards

//first card clicked remains face up, until:
// a- second card matches first card. both remain flipped
// b- no match. both cards unflip

//when all cards match, game over. stop clock. display win (modal).

//if timer runs out, game over. display lose (modal).

const stringsArray = ['😂', '😂', '🫠', '🫠', '🤠', '🤠', '🥳', '🥳', '🤬', '🤬', '💩', '💩', '🙈', '🙈', '🤖', '🤖'];

let firstCard = null;
let secondCard = null;
let lockBoard = false; // Prevents flipping cards during checks
let matchedPairs = 0;
const totalPairs = stringsArray.length / 2;
let timeRemaining = 45;
let timerInterval;

// Shuffle an array using Fisher-Yates algorith
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Assigning "random" values to card-backs
function assignValuesToCards() {
    const shuffledArray = shuffleArray(stringsArray);
    const cards = document.querySelectorAll('.card-back');
    cards.forEach((card, index) => {
        card.textContent = shuffledArray[index];
    });
}

// Handle card flip
function handleCardFlip(event) {
    if (lockBoard) return; // Prevent flipping during a check
    const clickedCard = event.currentTarget;

    // Prevent clicking the same card or a matched card
    if (clickedCard === firstCard || clickedCard.classList.contains('matched')) return;

    clickedCard.classList.add('flipped');

    if (!firstCard) {
        firstCard = clickedCard;
    } else {
        secondCard = clickedCard;
        lockBoard = true;
        checkForMatch();
    }
}

// Check for a match
function checkForMatch() {
    const isMatch = firstCard.querySelector('.card-back').textContent === secondCard.querySelector('.card-back').textContent;
    if (isMatch) {
        disableCards();
    } else {
        unflipCards();
    }
}

// Disable matched cards
function disableCards() {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    resetBoard();
    matchedPairs++;
    if (matchedPairs === totalPairs) {
        endGame('win');
    }
}

// Unflip unmatched cards
function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1000);
}

// Reset game board
function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

// Timer 
function startTimer() {
    const gameClock = document.getElementById('game-clock');
    gameClock.textContent = timeRemaining;
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const gameClock = document.getElementById('game-clock'); timeRemaining--;
    gameClock.textContent = timeRemaining;
    if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        endGame('lose');
    }
}

function endGame(result) {
    clearInterval(timerInterval);
    if (result === 'win') {
        showModal('win-modal');
    } else {
        showModal('lose-modal');
    }
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'block';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
}

// Restart the game 
function restartGame() {
    clearInterval(timerInterval);
    timeRemaining = 45;
    const gameClock = document.getElementById('game-clock');
    gameClock.textContent = timeRemaining;
    matchedPairs = 0;
    document.querySelectorAll('.card').forEach(card => {
        card.classList.remove('flipped', 'matched');
    });
    assignValuesToCards();
    resetBoard();
    closeModal('win-modal');
    closeModal('lose-modal');
    startTimer();
}

// Initialize the game
document.addEventListener('DOMContentLoaded', () => {
    assignValuesToCards();
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', handleCardFlip);
    });
    document.getElementById('restart').addEventListener('click', restartGame);
    document.querySelectorAll('.close').forEach(button => {
        button.addEventListener('click', event => {
            closeModal(event.target.closest('.modal').id);
        });
    });
    document.querySelectorAll('#modalRestartWin, #modalRestartLose').forEach(button => {
        button.addEventListener('click', restartGame);
    });
    startTimer();
});
