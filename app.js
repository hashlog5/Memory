import { foodImages } from './food-images.js';

const gameDuration = 45000;
const numberOfCards = foodImages.length;

const gameGrid = document.querySelector('.game-grid');

function createGameGrid() {
  for (let i = 0; i < numberOfCards; i++) {
    gameGrid.innerHTML += `<div class="slot">
			<div class="card">
				<div class="front-face"></div>
				<div class="back-face"></div>
			</div>
		</div>`;
  }

  gameGrid.classList.add('disabled');
}
createGameGrid();

const timerCounter = document.getElementById('timer-counter');
const movesCounter = document.getElementById('moves-counter');
const cards = document.querySelectorAll('.card');
const backFaces = document.querySelectorAll('.back-face');
const renderGameBtn = document.getElementById('render-game-btn');

renderGameBtn.addEventListener('click', renderGame);
cards.forEach((card) => card.addEventListener('click', flipCard));

let timeLeft = gameDuration / 1000;
let gameBtn = '';
let cardsFlipped = [];
let moves = 0;
let cardsFound = 0;

let gameDurationId;
let timeLeftId;
let matchedId;
let matchedAnimationId;
let mismatchedId;
let mismatchedAnimationId;

function renderGame() {
  gameBtn = renderGameBtn.textContent;

  if (gameBtn === 'Play') {
    newGame();
  } else if (gameBtn === 'Stop') {
    endGame();
  } else if (gameBtn === 'Reset') {
    resetGame();
  }
}

function newGame() {
  gameGrid.classList.remove('disabled');

  timeLeftId = setInterval(timerCountdown, 1000);
  timerCounter.textContent = timeLeft;
  movesCounter.textContent = moves;
  renderGameBtn.style.backgroundColor = 'tomato';
  renderGameBtn.textContent = 'Stop';

  shuffleCards();

  gameDurationId = setTimeout(() => {
    timerCountdown();

    setTimeout(() => {
      if (cardsFound !== numberOfCards) {
        endGame();
        gameOver();
      }
    }, 50);
  }, gameDuration);
}

function endGame() {
  gameGrid.classList.add('disabled');

  clearInterval(timeLeftId);
  clearTimeout(gameDurationId);
  clearTimeout(matchedId);
  clearTimeout(mismatchedId);

  renderGameBtn.style.backgroundColor = 'orange';
  renderGameBtn.textContent = 'Reset';
}

function resetGame() {
  timerCounter.textContent = 0;
  movesCounter.textContent = 0;
  timeLeft = gameDuration / 1000;
  cardsFlipped = [];
  moves = 0;
  cardsFound = 0;

  clearTimeout(matchedAnimationId);
  clearTimeout(mismatchedAnimationId);

  renderGameBtn.style.backgroundColor = 'lightgreen';
  renderGameBtn.textContent = 'Play';

  for (let i = 0; i < foodImages.length; i++) {
    cards[i].classList.remove('flipped');
    cards[i].parentNode.classList.remove('match-found');
  }
}

function timerCountdown() {
  timeLeft--;

  if (timeLeft >= 0) {
    timerCounter.textContent = `${timeLeft}s`;
  }
}

function countMoves() {
  moves++;
  movesCounter.textContent = moves;
}

function shuffleCards() {
  foodImages.sort(() => 0.5 - Math.random());

  for (let i = 0; i < foodImages.length; i++) {
    cards[i].setAttribute('data-name', `${foodImages[i].name}`);
    backFaces[i].style.background = `url(${foodImages[i].img})`;
  }
}

function flipCard() {
  if (!this.classList.contains('flipped')) {
    this.classList.add('flipped');
    cardsFlipped.push(this);

    if (cardsFlipped.length === 2) {
      countMoves();
      const firstChoice = cardsFlipped[0].getAttribute('data-name');
      const secondChoice = cardsFlipped[1].getAttribute('data-name');

      if (firstChoice === secondChoice) {
        matched();
      } else {
        mismatched();
      }
    }
  }
}

function matched() {
  gameGrid.classList.add('disabled');
  matchedAnimation();
  cardsFound += 2;

  if (cardsFound === numberOfCards) {
    endGame();
    youWin();
  } else {
    matchedId = setTimeout(() => {
      gameGrid.classList.remove('disabled');
      cardsFlipped = [];
    }, 1000);
  }
}

function matchedAnimation() {
  matchedAnimationId = setTimeout(() => {
    cardsFlipped[0].parentNode.classList.add('match-found');
    cardsFlipped[1].parentNode.classList.add('match-found');
  }, 500);
}

function mismatched() {
  gameGrid.classList.add('disabled');
  mismatchedAnimation();

  mismatchedId = setTimeout(() => {
    gameGrid.classList.remove('disabled');
    cardsFlipped = [];
  }, 1500);
}

function mismatchedAnimation() {
  mismatchedAnimationId = setTimeout(() => {
    cardsFlipped[0].classList.remove('flipped');
    cardsFlipped[1].classList.remove('flipped');
  }, 1000);
}

function youWin() {
  setTimeout(() => {
    alert('You Win!');
  }, 1250);
}

function gameOver() {
  setTimeout(() => {
    alert('Game Over!');
  }, 1250);
}
