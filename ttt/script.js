var origBoard;
const huPlayer = 'O';
const aiPlayer = 'X';
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6],
];

const cells = document.querySelectorAll('.cell');
startGame();

function startGame() {
	document.querySelector(".endgame").style.display = "none";
	origBoard = Array.from(Array(9).keys());
	for(var i = 0; i < cells.length; i++){
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
	}
}

function turnClick(square) {
	if(typeof origBoard[square.target.id] == 'number'){
		turn(square.target.id, huPlayer);
		if (!checkTie()) turn(bestSpot(), aiPlayer);
	}
}

function turn(squareID, player) {
	origBoard[squareID] = player;
	document.getElementById(squareID).innerText = player;
	let won = checkWin(origBoard, player);
	if (won) gameOver(won)
}

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) =>
		(e === player) ? a.concat(i) : a, [])
	let won = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			won = {index: index, player: player};
			break;
		}
	}
	return won;
}

function gameOver(won) {
	for (let index of winCombos[won.index]) {
		document.getElementById(index).style.backgroundColor =
			won.player == huPlayer ? "blue" : "red";
	}
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
	declareWinner(won.player == huPlayer ? "You win!" : "You lose!");
}

function declareWinner(who) {
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
	return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
	return minimax(origBoard, aiPlayer).index;
}

function checkTie() {
	if(emptySquares().length == 0) {
		for(var i = 0; i < cells.length; i++){
			cells[i].style.backgroundColor = "green";
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Tie Game!")
		return true;
	}
	return false;
}

function minimax(newBoard, player) {
	var availSpots = emptySquares(newBoard);
	
	if(checkWin(newBoard, player)) {
		return {score: -10};
	}
	else if (checkWin(newBoard, aiPlayer)) {
		return {score: 20};
	}
	else if(availSpots.length === 0) {
		return {score: 0};
	}
	
	var moves = [];
	for(var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;
		
		if (player == aiPlayer) {
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
		}
		else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}
		
		newBoard[availSpots[i]] = move.index;
		moves.push(move);
	}
	
	var bestMove;
	if(player === aiPlayer) {
		var bestScore = -10000;
		for( var i = 0; i < moves.length; i++) {
			if(moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}
	else {
		var bestScore = 10000;
		for(var i =0; i < moves.length; i++){
			if(moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}
		
	return moves[bestMove];
}
