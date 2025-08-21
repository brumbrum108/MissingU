// --- LẤY CÁC ELEMENT ---
const btnYes = document.getElementById('btn-yes');
const btnNo = document.getElementById('btn-no');
const cardInitial = document.querySelector('.card-initial');
const cardFinal = document.querySelector('.card-final');
const btnYesFinal = document.getElementById('btn-yes-final');
const movieCarousel = document.getElementById('movie-carousel-container');

const question = document.getElementById('question');
const buttonContainer = document.getElementById('button-container');

let lastMessage = "";
const messages = [ "Tay hơi giãn rồi đó", ":((", "Stop it!", "Hoi mò", "Vãi ò lì gke", "Haha hụt rùi nhe", "Haha chậm hahahahaha!", "No chance!", "Ráng xíu nữa i", "1212 cố lên em cố lên", "Just press YES!", "Nope nope nope!", "Close this tab còn dễ hơn", "liuliu", "Oopssss" ];

const MOVE_DISTANCE = 150;
const PLAYGROUND_MARGIN = 100;

let arePositionsSet = false;
let yesBtnRelativeRect = null;
let questionRelativeRect = null;

// các hàm
function checkCollision(rectA, rectB) {
  if (!rectA || !rectB) return false;
  return (
    rectA.x < rectB.x + rectB.width &&
    rectA.x + rectA.width > rectB.x &&
    rectA.y < rectB.y + rectB.height &&
    rectA.y + rectA.height > rectB.y
  );
}

function setupAbsolutePositions() {
  if (arePositionsSet) return;

  const cardRect = cardInitial.getBoundingClientRect();
  const initialYesRect = btnYes.getBoundingClientRect();
  const initialNoRect = btnNo.getBoundingClientRect();
  const initialQuestionRect = question.getBoundingClientRect();

  yesBtnRelativeRect = {
    x: initialYesRect.left - cardRect.left,
    y: initialYesRect.top - cardRect.top,
    width: initialYesRect.width,
    height: initialYesRect.height
  };
  questionRelativeRect = {
    x: initialQuestionRect.left - cardRect.left,
    y: initialQuestionRect.top - cardRect.top,
    width: initialQuestionRect.width,
    height: initialQuestionRect.height
  };

  btnYes.style.position = 'absolute';
  btnYes.style.left = `${yesBtnRelativeRect.x}px`;
  btnYes.style.top = `${yesBtnRelativeRect.y}px`;

  btnNo.style.position = 'absolute';
  btnNo.style.left = `${initialNoRect.left - cardRect.left}px`;
  btnNo.style.top = `${initialNoRect.top - cardRect.top}px`;
  
  buttonContainer.style.height = `${initialNoRect.height}px`;
  arePositionsSet = true;
}

function moveNoButton() {
  setupAbsolutePositions();
  const cardRect = cardInitial.getBoundingClientRect();
  const btnWidth = btnNo.offsetWidth;
  const btnHeight = btnNo.offsetHeight;
  const currentX = btnNo.offsetLeft;
  const currentY = btnNo.offsetTop;
  const playground = {
    minY: Math.max(-PLAYGROUND_MARGIN, -cardRect.top),
    minX: Math.max(-PLAYGROUND_MARGIN, -cardRect.left),
    maxY: Math.min(cardRect.height + PLAYGROUND_MARGIN, window.innerHeight - cardRect.top) - btnHeight,
    maxX: Math.min(cardRect.width + PLAYGROUND_MARGIN, window.innerWidth - cardRect.left) - btnWidth
  };

  let foundSafeSpot = false;
  for (let i = 0; i < 50; i++) {
    let randomAngle;
    do {
      randomAngle = Math.random() * 2 * Math.PI;
      const isForbiddenRight = randomAngle <= (15 * (Math.PI / 180)) || randomAngle >= (345 * (Math.PI / 180));
      const isForbiddenLeft = Math.abs(randomAngle - Math.PI) <= (15 * (Math.PI / 180));
      if (!isForbiddenRight && !isForbiddenLeft) break;
    } while (true);

    const newX = currentX + MOVE_DISTANCE * Math.cos(randomAngle);
    const newY = currentY + MOVE_DISTANCE * Math.sin(randomAngle);
    const isInsidePlayground = newX >= playground.minX && newX <= playground.maxX && newY >= playground.minY && newY <= playground.maxY;
    
    if (isInsidePlayground) {
      const newNoRect = { x: newX, y: newY, width: btnWidth, height: btnHeight };
      if (!checkCollision(newNoRect, yesBtnRelativeRect) && !checkCollision(newNoRect, questionRelativeRect)) {
        btnNo.style.left = `${newX}px`;
        btnNo.style.top = `${newY}px`;
        foundSafeSpot = true;
        break;
      }
    }
  }

  if (!foundSafeSpot) {
    const corners = [
      { x: playground.minX, y: playground.minY }, { x: playground.maxX, y: playground.minY },
      { x: playground.minX, y: playground.maxY }, { x: playground.maxX, y: playground.maxY }
    ];
    let bestCorner = null;
    let maxDistSq = -1;
    for (const corner of corners) {
      const distSq = Math.pow(corner.x - currentX, 2) + Math.pow(corner.y - currentY, 2);
      const cornerRect = { ...corner, width: btnWidth, height: btnHeight };
      if (distSq > maxDistSq && !checkCollision(cornerRect, yesBtnRelativeRect) && !checkCollision(cornerRect, questionRelativeRect)) {
        maxDistSq = distSq;
        bestCorner = corner;
      }
    }
    if (bestCorner) {
      btnNo.style.left = `${bestCorner.x}px`;
      btnNo.style.top = `${bestCorner.y}px`;
    }
  }

  let newMessage;
  do {
    newMessage = messages[Math.floor(Math.random() * messages.length)];
  } while (newMessage === lastMessage);
  btnNo.textContent = newMessage;
  lastMessage = newMessage;
}

// --- GẮN CÁC SỰ KIỆN ---
btnNo.addEventListener('mouseenter', moveNoButton);
btnNo.addEventListener('mouseover', moveNoButton);

btnYes.addEventListener('click', () => {
  cardInitial.classList.add('hidden');
  cardFinal.classList.add('active');
});

btnYesFinal.addEventListener('click', () => {
  cardFinal.classList.remove('active');
  cardFinal.classList.add('hidden');
  movieCarousel.classList.remove('hidden');
});