const Player = (name, userItem) =>{
    return {name, userItem};
}

const GameBoard = (() => {
    let gameBoardArr = Array(9);
    const newRound = (idx,item) => gameBoardArr[idx] = item;
    const resetGameBoard = () => gameBoardArr = Array(9);
    return {gameBoardArr,newRound,resetGameBoard};
})();

// Tests
let player1 = Player("Player 1","X");
let player2 = Player("Player 2","O");

const Game = ((GameBoard, player1, player2) => {
    let currentPlayer = player1;
    let roundNumber = 0;

    const newRound = (idx) => {
        GameBoard.newRound(idx,currentPlayer.userItem);
        if (roundNumber >= 3){
            let [arr, isWin] = checkWinner();
            if (isWin) {
                return [arr, isWin];
            }
            if (roundNumber === 8){
                alert("Draw");
                GameBoard.gameBoardArr = GameBoard.resetGameBoard();
                currentPlayer = player1;
                roundNumber = 0;
                return [undefined, false];
            }
        } 
        changeCurrentPlayer();
        roundNumber++;
        return [undefined, undefined];
    };
    
    const changeCurrentPlayer = () => {
        if(currentPlayer === player1) {
            currentPlayer = player2; 
        }else {
            currentPlayer = player1;
        }
    };

    const getCurrentPlayer = () => currentPlayer;

    const checkWinner = function (arr = GameBoard.gameBoardArr) {

        // Check if rows are same
        for(let i = 0; i < arr.length; i += 3){
            let row = arr.slice(i,i+3);         
            
            if (isWin(row)){
                return [[i,i+1,i+2], true];
            };
        }

        // Check if columns are same
        for(let i = 0; i < 3; i++){
            let col = [arr[i],arr[i+3],arr[i+6]];
            
            if (isWin(col)){
                return [[i,i+3,i+6], true];
            };
        }

        // Check if diagonals are same
        let diagonal1 = [arr[0],arr[4],arr[8]];
        if (isWin(diagonal1)){
            return [[0,4,8], true];
        };

        let diagonal2 = [arr[2],arr[4],arr[6]];
        if (isWin(diagonal2)){
            return [[2,4,6], true];
        };

        return [undefined, false];
    }

    const isWin = (arr) => {
        let result = false;
        if (!arr.includes(undefined)){
            result = arr.every((element) => element === arr[0]);
        }
        return result;
    }

    const endGame = () => {
        GameBoard.gameBoardArr = GameBoard.resetGameBoard();
        currentPlayer = player1;
        roundNumber = 0;
    }

    const resetGame = () => {
        GameBoard.gameBoardArr = GameBoard.resetGameBoard();
        currentPlayer = player1;
        roundNumber = 0;
    }

    return {newRound, checkWinner, endGame, getCurrentPlayer, resetGame};
})(GameBoard, player1, player2);


const displayController = ((doc) => {
    const mainCont = doc.querySelector(".main");
    const gridLayout = doc.querySelector(".grid-layout");
    const playAreas = doc.querySelectorAll(".field");
    const resetBtn = doc.querySelector("#resetBtn");

    resetBtn.addEventListener("click",resetDisplay);

    function displayRound(e){
        const index = e.target.getAttribute("data-number");
        const currentPlayer = Game.getCurrentPlayer();
        e.target.textContent = currentPlayer.userItem;
        let [arr, result] = Game.newRound(index);
        if (result === true) {
            diableClick();
            displayWinnerFields(arr);
            showWinner(currentPlayer);
            Game.endGame();
        }else if (result === false){
            diableClick();
        }
        e.target.removeEventListener("click",displayRound);
        e.target.style.cssText = "cursor:not-allowed";
    }

    function enableClick(){
        for (const playArea of playAreas){
            playArea.style.cursor = "pointer";
            playArea.addEventListener("click",displayRound);
        }
    }

    function diableClick(){
        for (const playArea of playAreas){
            playArea.removeEventListener("click",displayRound);
            playArea.style.cssText = "cursor:not-allowed";
        }
    }

    // Cannot change the background color of last index
    function displayWinnerFields(arr){
        for (let idx of arr){
            const playAreaToShow = playAreas[idx];
            playAreaToShow.style.cssText = "background-color: rgba(98, 98, 98, 0.4);";
        }
    }

    function resetDisplay (){
        for(const playArea of playAreas){     
            playArea.textContent = "";
            playArea.style.backgroundColor = "";
            enableClick();
        }
        Game.resetGame();
        removeWinnerCon();
    }

    function showWinner(winner){
        const div = doc.createElement("div");
        div.classList.add("result-con");
        const text = doc.createElement("p");
        text.textContent = `Player ${winner.userItem} has won!`;
        div.appendChild(text);

        gridLayout.parentNode.insertBefore(div, gridLayout);
    }

    function removeWinnerCon(){
        try {
            const resultCon = doc.querySelector(".result-con");
            mainCont.removeChild(resultCon);
        } catch (error) {}
    }

    return {enableClick}

})(document,Game);

displayController.enableClick();