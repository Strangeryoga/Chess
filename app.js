const gameboard = document.querySelector("#gameboard");
const playerDisplay = document.querySelector("#player");
const infoDisplay = document.querySelector("#info-display");
const width = 8;
let playerGo = "black";
playerDisplay.textContent = "black";


const startPieces = [
  rook,
  knight,
  bishop,
  queen,
  king,
  bishop,
  knight,
  rook,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  rook,
  knight,
  bishop,
  queen,
  king,
  bishop,
  knight,
  rook,
];


/**
 * Creates a game board with start pieces.
 */
function createBoard() {
  // Loop through startPieces array
  startPieces.forEach((startPiece, i) => {
    // Create a new div element
    const square = document.createElement("div");
    square.classList.add("square");
    square.innerHTML = startPiece;

    // Set draggable attribute to true
    square.firstChild?.setAttribute("draggable", true);

    // Set square-id attribute to i
    square.setAttribute("square-id", i);

    // Calculate row number
    const row = Math.floor((63 - i) / 8) + 1;

    // Add appropriate class based on row and column
    if (row % 2 === 0) {
      square.classList.add(i % 2 === 0 ? "beige" : "brown");
    } else {
      square.classList.add(i % 2 === 0 ? "brown" : "beige");
    }

    // Add color class based on index range
    if (i <= 15) {
      square.firstChild.firstChild.classList.add("black");
    } else if (i >= 48) {
      square.firstChild.firstChild.classList.add("white");
    }

    // Append square to gameboard
    gameboard.append(square);
  });
}

createBoard();


const allSquares = document.querySelectorAll(".square");


allSquares.forEach((square) => {
  square.addEventListener("dragstart", dragStart);
  square.addEventListener("dragover", dragOver);
  square.addEventListener("drop", dragDrop);
});


let startPositionId;
let draggedElement;


/**
 * Handle the drag start event.
 * @param {Event} e - The drag start event.
 */
function dragStart(e) {
  // Get the square id of the parent element of the dragged element
  startPositionId = e.target.parentElement.getAttribute("square-id");
  // Set the dragged element
  draggedElement = e.target;
}


/**
 * Prevents the default behavior of an event.
 * 
 * @param {Event} e - The event object.
 */
function dragOver(e) {
  e.preventDefault();
}


/**
 * Handles the drag and drop functionality for the game pieces.
 * @param {Event} e - The drag and drop event.
 */
function dragDrop(e) {
  e.stopPropagation();

  // Check if the dragged element has the correct player's piece
  const correctGo = draggedElement.firstChild.classList.contains(playerGo);

  // Check if the target element already has a piece
  const taken = e.target.classList.contains("piece");

  // Check if the move is valid
  const valid = checkIfValid(e.target);

  // Determine the opponent's player type
  const opponentGo = playerGo === "white" ? "black" : "white";

  // Check if the target element is taken by the opponent
  const takenByOpponent = e.target.firstChild?.classList.contains(opponentGo);

  if (correctGo) {
    if (takenByOpponent && valid) {
      // Move the dragged element to the target element and remove the target element
      e.target.parentNode.append(draggedElement);
      e.target.remove();

      // Check for win condition and change player
      checkForWin();
      changePlayer();
      return;
    }

    if (taken && !takenByOpponent) {
      // Display error message if the player tries to take their own piece
      infoDisplay.textContent = "cant take own piece";
      setTimeout(() => (infoDisplay.textContent = ""), 2000);
      return;
    }

    if (valid) {
      // Move the dragged element to the target element
      e.target.append(draggedElement);

      // Check for win condition and change player
      checkForWin();
      changePlayer();
      return;
    }
  }
  // e.target.append(draggedElement)
}


function checkIfValid(target) {
  const targetId =
    Number(target.getAttribute("square-id")) ||
    Number(target.parentNode.getAttribute("square-id"));
  const startId = Number(startPositionId);
  const piece = draggedElement.id;
  console.log(targetId);

  switch (piece) {
    case "pawn":
      const starterRow = [8, 9, 10, 11, 12, 13, 14, 15];
      if (
        (starterRow.includes(startId) && startId + width * 2 === targetId) ||
        startId + width === targetId ||
        (startId + width - 1 === targetId &&
          document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild) ||
        (startId + width + 1 === targetId &&
          document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild)
      ) {
        return true;
      }
      break;
    case "knight":
      if (
        startId + width * 2 + 1 === targetId ||
        startId + width * 2 - 1 === targetId ||
        startId + width - 2 === targetId ||
        startId + width + 2 === targetId ||
        startId - width * 2 + 1 === targetId ||
        startId - width * 2 - 1 === targetId ||
        startId - width - 2 === targetId ||
        startId - width + 2 === targetId
      ) {
        return true;
      }
      break;
    case "bishop":
      if (
        startId + width + 1 === targetId ||
        (startId + width * 2 + 2 === targetId &&
          !document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild) ||
        (startId + width * 3 + 3 === targetId &&
          !document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 2 + 2}"]`)
            .firstChild) ||
        (startId + width * 4 + 4 === targetId &&
          !document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 2 + 2}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 3 + 3}"]`)
            .firstChild) ||
        (startId + width * 5 + 5 === targetId &&
          !document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 2 + 2}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 3 + 3}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 4 + 4}"]`)
            .firstChild) ||
        (startId + width * 6 + 6 === targetId &&
          !document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 2 + 2}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 3 + 3}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 4 + 4}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 5 + 5}"]`)
            .firstChild) ||
        (startId + width * 7 + 7 === targetId &&
          !document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 2 + 2}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 3 + 3}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 4 + 4}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 5 + 5}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 6 + 6}"]`)
            .firstChild) ||
        startId - width - 1 === targetId ||
        (startId - width * 2 - 2 === targetId &&
          !document.querySelector(`[square-id="${startId - width - 1}"]`)
            .firstChild) ||
        (startId - width * 3 - 3 === targetId &&
          !document.querySelector(`[square-id="${startId - width - 1}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 2 - 2}"]`)
            .firstChild) ||
        (startId - width * 4 - 4 === targetId &&
          !document.querySelector(`[square-id="${startId - width - 1}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 2 - 2}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 3 - 3}"]`)
            .firstChild) ||
        (startId - width * 5 - 5 === targetId &&
          !document.querySelector(`[square-id="${startId - width - 1}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 2 - 2}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 3 - 3}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 4 - 4}"]`)
            .firstChild) ||
        (startId - width * 6 - 6 === targetId &&
          !document.querySelector(`[square-id="${startId - width - 1}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 2 - 2}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 3 - 3}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 4 - 4}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 5 - 5}"]`)
            .firstChild) ||
        (startId - width * 7 - 7 === targetId &&
          !document.querySelector(`[square-id="${startId - width - 1}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 2 - 2}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 3 - 3}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 4 - 4}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 5 - 5}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 6 - 6}"]`)
            .firstChild) ||
        startId - width + 1 === targetId ||
        (startId - width * 2 + 2 === targetId &&
          !document.querySelector(`[square-id="${startId - width + 1}"]`)
            .firstChild) ||
        (startId - width * 3 + 3 === targetId &&
          !document.querySelector(`[square-id="${startId - width + 1}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 2 + 2}"]`)
            .firstChild) ||
        (startId - width * 4 + 4 === targetId &&
          !document.querySelector(`[square-id="${startId - width + 1}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 2 + 2}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 3 + 3}"]`)
            .firstChild) ||
        (startId - width * 5 + 5 === targetId &&
          !document.querySelector(`[square-id="${startId - width + 1}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 2 + 2}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 3 + 3}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 4 + 4}"]`)
            .firstChild) ||
        (startId - width * 6 + 6 === targetId &&
          !document.querySelector(`[square-id="${startId - width + 1}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 2 + 2}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 3 + 3}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 4 + 4}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 5 + 5}"]`)
            .firstChild) ||
        (startId - width * 7 + 7 === targetId &&
          !document.querySelector(`[square-id="${startId - width + 1}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 2 + 2}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 3 + 3}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 4 + 4}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 5 + 5}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 6 + 6}"]`)
            .firstChild) ||
        startId + width - 1 === targetId ||
        (startId + width * 2 - 2 === targetId &&
          !document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild) ||
        (startId + width * 3 - 3 === targetId &&
          !document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 2 - 2}"]`)
            .firstChild) ||
        (startId + width * 4 - 4 === targetId &&
          !document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 2 - 2}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 3 - 3}"]`)
            .firstChild) ||
        (startId + width * 5 - 5 === targetId &&
          !document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 2 - 2}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 3 - 3}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 4 - 4}"]`)
            .firstChild) ||
        (startId + width * 6 - 6 === targetId &&
          !document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 2 - 2}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 3 - 3}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 4 - 4}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 5 - 5}"]`)
            .firstChild) ||
        (startId + width * 7 - 7 === targetId &&
          !document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 2 - 2}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 3 - 3}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 4 - 4}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 5 - 5}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 6 - 6}"]`)
            .firstChild)
      ) {
        return true;
      }
      break;
    case "rook":
      if (
        startId + width === targetId ||
        (startId + width * 2 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild) ||
        (startId + width * 3 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`)
            .firstChild) ||
        (startId + width * 4 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3}"]`)
            .firstChild) ||
        (startId + width * 5 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4}"]`)
            .firstChild) ||
        (startId + width * 6 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 5}"]`)
            .firstChild) ||
        (startId + width * 7 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 6}"]`)
            .firstChild) ||
        startId - width === targetId ||
        (startId - width * 2 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild) ||
        (startId - width * 3 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`)
            .firstChild) ||
        (startId - width * 4 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3}"]`)
            .firstChild) ||
        (startId - width * 5 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4}"]`)
            .firstChild) ||
        (startId - width * 6 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 5}"]`)
            .firstChild) ||
        (startId - width * 7 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 6}"]`)
            .firstChild) ||
        startId + 1 === targetId ||
        (startId + 2 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild) ||
        (startId + 3 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 2}"]`).firstChild) ||
        (startId + 4 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 3}"]`).firstChild) ||
        (startId + 5 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 3}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 4}"]`).firstChild) ||
        (startId + 6 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 3}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 4}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 5}"]`).firstChild) ||
        (startId + 7 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 3}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 4}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 5}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 6}"]`).firstChild) ||
        startId - 1 === targetId ||
        (startId - 2 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild) ||
        (startId - 3 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 2}"]`).firstChild) ||
        (startId - 4 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 3}"]`).firstChild) ||
        (startId - 5 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 3}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 4}"]`).firstChild) ||
        (startId - 6 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 3}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 4}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 5}"]`).firstChild) ||
        (startId - 7 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 3}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 4}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 5}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 6}"]`).firstChild)
      ) {
        return true;
      }
      break;
    case "queen":
      if (
        startId + width === targetId ||
        (startId + width * 2 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild) ||
        (startId + width * 3 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`)
            .firstChild) ||
        (startId + width * 4 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3}"]`)
            .firstChild) ||
        (startId + width * 5 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4}"]`)
            .firstChild) ||
        (startId + width * 6 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 5}"]`)
            .firstChild) ||
        (startId + width * 7 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 6}"]`)
            .firstChild) ||
        startId - width === targetId ||
        (startId - width * 2 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild) ||
        (startId - width * 3 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`)
            .firstChild) ||
        (startId - width * 4 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3}"]`)
            .firstChild) ||
        (startId - width * 5 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4}"]`)
            .firstChild) ||
        (startId - width * 6 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 5}"]`)
            .firstChild) ||
        (startId - width * 7 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 6}"]`)
            .firstChild) ||
        startId + 1 === targetId ||
        (startId + 2 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild) ||
        (startId + 3 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 2}"]`).firstChild) ||
        (startId + 4 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 3}"]`).firstChild) ||
        (startId + 5 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 3}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 4}"]`).firstChild) ||
        (startId + 6 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 3}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 4}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 5}"]`).firstChild) ||
        (startId + 7 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 3}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 4}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 5}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 6}"]`).firstChild) ||
        startId - 1 === targetId ||
        (startId - 2 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild) ||
        (startId - 3 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 2}"]`).firstChild) ||
        (startId - 4 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 3}"]`).firstChild) ||
        (startId - 5 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 3}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 4}"]`).firstChild) ||
        (startId - 6 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 3}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 4}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 5}"]`).firstChild) ||
        (startId - 7 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 3}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 4}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 5}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 6}"]`).firstChild) ||
        startId + width + 1 === targetId ||
        (startId + width * 2 + 2 === targetId &&
          !document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild) ||
        (startId + width * 3 + 3 === targetId &&
          !document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 2 + 2}"]`)
            .firstChild) ||
        (startId + width * 4 + 4 === targetId &&
          !document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 2 + 2}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 3 + 3}"]`)
            .firstChild) ||
        (startId + width * 5 + 5 === targetId &&
          !document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 2 + 2}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 3 + 3}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 4 + 4}"]`)
            .firstChild) ||
        (startId + width * 6 + 6 === targetId &&
          !document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 2 + 2}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 3 + 3}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 4 + 4}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 5 + 5}"]`)
            .firstChild) ||
        (startId + width * 7 + 7 === targetId &&
          !document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 2 + 2}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 3 + 3}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 4 + 4}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 5 + 5}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 6 + 6}"]`)
            .firstChild) ||
        startId - width - 1 === targetId ||
        (startId - width * 2 - 2 === targetId &&
          !document.querySelector(`[square-id="${startId - width - 1}"]`)
            .firstChild) ||
        (startId - width * 3 - 3 === targetId &&
          !document.querySelector(`[square-id="${startId - width - 1}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 2 - 2}"]`)
            .firstChild) ||
        (startId - width * 4 - 4 === targetId &&
          !document.querySelector(`[square-id="${startId - width - 1}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 2 - 2}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 3 - 3}"]`)
            .firstChild) ||
        (startId - width * 5 - 5 === targetId &&
          !document.querySelector(`[square-id="${startId - width - 1}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 2 - 2}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 3 - 3}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 4 - 4}"]`)
            .firstChild) ||
        (startId - width * 6 - 6 === targetId &&
          !document.querySelector(`[square-id="${startId - width - 1}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 2 - 2}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 3 - 3}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 4 - 4}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 5 - 5}"]`)
            .firstChild) ||
        (startId - width * 7 - 7 === targetId &&
          !document.querySelector(`[square-id="${startId - width - 1}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 2 - 2}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 3 - 3}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 4 - 4}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 5 - 5}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 6 - 6}"]`)
            .firstChild) ||
        startId - width + 1 === targetId ||
        (startId - width * 2 + 2 === targetId &&
          !document.querySelector(`[square-id="${startId - width + 1}"]`)
            .firstChild) ||
        (startId - width * 3 + 3 === targetId &&
          !document.querySelector(`[square-id="${startId - width + 1}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 2 + 2}"]`)
            .firstChild) ||
        (startId - width * 4 + 4 === targetId &&
          !document.querySelector(`[square-id="${startId - width + 1}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 2 + 2}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 3 + 3}"]`)
            .firstChild) ||
        (startId - width * 5 + 5 === targetId &&
          !document.querySelector(`[square-id="${startId - width + 1}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 2 + 2}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 3 + 3}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 4 + 4}"]`)
            .firstChild) ||
        (startId - width * 6 + 6 === targetId &&
          !document.querySelector(`[square-id="${startId - width + 1}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 2 + 2}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 3 + 3}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 4 + 4}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 5 + 5}"]`)
            .firstChild) ||
        (startId - width * 7 + 7 === targetId &&
          !document.querySelector(`[square-id="${startId - width + 1}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 2 + 2}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 3 + 3}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 4 + 4}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 5 + 5}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId - width * 6 + 6}"]`)
            .firstChild) ||
        startId + width - 1 === targetId ||
        (startId + width * 2 - 2 === targetId &&
          !document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild) ||
        (startId + width * 3 - 3 === targetId &&
          !document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 2 - 2}"]`)
            .firstChild) ||
        (startId + width * 4 - 4 === targetId &&
          !document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 2 - 2}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 3 - 3}"]`)
            .firstChild) ||
        (startId + width * 5 - 5 === targetId &&
          !document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 2 - 2}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 3 - 3}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 4 - 4}"]`)
            .firstChild) ||
        (startId + width * 6 - 6 === targetId &&
          !document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 2 - 2}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 3 - 3}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 4 - 4}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 5 - 5}"]`)
            .firstChild) ||
        (startId + width * 7 - 7 === targetId &&
          !document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 2 - 2}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 3 - 3}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 4 - 4}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 5 - 5}"]`)
            .firstChild &&
          document.querySelector(`[square-id="${startId + width * 6 - 6}"]`)
            .firstChild)
      ) {
        return true;
      }
      break;
    case "king":
      if (
        startId + 1 === targetId ||
        startId - 1 === targetId ||
        startId + width === targetId ||
        startId - width === targetId ||
        startId + width - 1 === targetId ||
        startId + width + 1 === targetId ||
        startId - width - 1 === targetId ||
        startId - width + 1 === targetId
      ) {
        return true;
      }
  }
}


/**
 * Toggles the current player and updates the player display.
 * If the current player is black, it changes to white and vice versa.
 */
function changePlayer() {
  if (playerGo === "black") {
    reverseIds();
    playerGo = "white";
    playerDisplay.textContent = "white";
  } else {
    revertIds();
    playerGo = "black";
    playerDisplay.textContent = "black";
  }
}


/**
 * Reverses the square IDs.
 */
function reverseIds() {
  // Get all the square elements
  const allSquares = document.querySelectorAll(".square");

  // Iterate over each square element
  allSquares.forEach((square, i) => {
    // Calculate the new square ID
    const newSquareId = width * width - 1 - i;

    // Set the new square ID as a data attribute
    square.setAttribute("square-id", newSquareId);
  });
}


/**
 * Reverts the ids of all squares in the document.
 */
function revertIds() {
  // Get all squares in the document
  const allSquares = document.querySelectorAll(".square");

  // Loop through each square and set the square-id attribute to its index
  allSquares.forEach((square, i) => {
    square.setAttribute("square-id", i);
  });
}


/**
 * Check for a win condition in the game.
 * If there are no white kings, black wins.
 * If there are no black kings, white wins.
 */
function checkForWin() {
  const kings = Array.from(document.querySelectorAll("#king"));

  // Check for black win condition
  if (!kings.some((king) => king.firstChild.classList.contains("white"))) {
    infoDisplay.innerHTML = "Black Wins";

    // Disable dragging on all squares
    const allSquares = document.querySelectorAll(".square");
    allSquares.forEach((square) =>
      square.firstChild?.setAttribute("draggable", "false")
    );
  }

  // Check for white win condition
  if (!kings.some((king) => king.firstChild.classList.contains("black"))) {
    infoDisplay.innerHTML = "White Wins";

    // Disable dragging on all squares
    const allSquares = document.querySelectorAll(".square");
    allSquares.forEach((square) =>
      square.firstChild?.setAttribute("draggable", "false")
    );
  }
}


