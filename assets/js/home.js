// Variable Definition 
let userNameInput, userLevelInput, userName, userLevel, logins, groups, groupBtn, gameBoard, imgBar, board, imgBarItem, tile, tileImg, imgBarItems, tiles, startGameBtn, topBarControl, welcome, errorCount, downCounter, selectedBoardImg, selectedBarImg, data9x9, board4x4, solution4x4s, message, confirmMessage, playAginBtn, goHomeBtn, countInterval;


let errors = 0;

window.addEventListener('load', function (e) {
  // ^ Select Elements
  // 1) Sections
  logins = this.document.querySelector(".home");
  groups = this.document.querySelector(".groups");
  gameBoard = this.document.querySelector(".gameBoard");
  message = this.document.querySelector(".message");

  // 2) Login form
  userNameInput = this.document.querySelector("#username");
  userLevelInput = document.querySelector("#level");
  let loginSubmitBtn = document.querySelector("#loginSubmitBtn");

  // 3) groupBtns
  groupBtn = document.querySelectorAll(".groupBtn");

  // 4) Board & imgBar
  topBarControl = document.querySelector(".topBarControl");
  welcome = document.querySelector(".welcome");
  errorCount = document.querySelector(".errorCount");
  downCounter = document.querySelector(".downCounter");
  startGameBtn = document.querySelector(".startGameBtn");
  board = document.querySelector(".board");
  imgBar = document.querySelector(".imgBar");

  // 5) Message Section
  confirmMessage = this.document.querySelector(".confirmMessage");
  playAginBtn = this.document.querySelector(".playAginBtn");
  goHomeBtn = this.document.querySelector(".goHomeBtn");


  loginSubmitBtn.addEventListener('click', getLogin);// click
  groupBtn.forEach(btn => {
    btn.addEventListener('click', initializeGame); //click
  });

  goHomeBtn.addEventListener('click', goHome);// click
  playAginBtn.addEventListener('click', playAgin);// click

}); // load



// let boardNumber = [ // dash refer to the empty spaces in the sudoku board array
//   "..74916-5",
//   "2...6.3.9",
//   ".....7.1.",
//   ".586....4",
//   "..3....9.",
//   "..62..187",
//   "9.4.7...2",
//   "67.83....",
//   "81..45..."
// ]

// let solution = [
//   "387491625",
//   "241568379",
//   "569327418",
//   "758619234",
//   "123784596",
//   "496253187",
//   "934176852",
//   "675832941",
//   "812945763"
// ]


async function getData() {
  try {

    // 9x9 API  https://rapidapi.com/andrewarochukwu/api/sudoku-board/
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Host': 'sudoku-board.p.rapidapi.com',
        'X-RapidAPI-Key': '01fa00f280msh6ec49e679484b29p1420cbjsne636cc7e4f00'
      }
    };

    let response = await fetch('https://sudoku-board.p.rapidapi.com/new-board?diff=2&stype=list&solu=true', options);

    data9x9 = await response.json();

    // 4x4 API https://sudoku-api.deta.dev/?type=4
    response = await fetch('https://sudoku-api.deta.dev/?type=4');
    let data4x4 = await response.json();

    // Send the fetched data to the CreatArrayOfArray() method to convert it the the suitable form
    let feedBoard = data4x4.board;
    let feedSolution = data4x4.solution;

    board4x4 = createArrayOfArrays(feedBoard);
    solution4x4 = createArrayOfArrays(feedSolution);

    console.log(board4x4);
    console.log(solution4x4);

  } catch (error) {
    throw new Error(error);
  }
};
getData();

/*********************
 *  * Function Declaration
 * **************************** */

function getLogin(e) {
  e.preventDefault();
  userName = userNameInput.value;
  userLevel = userLevelInput.value;

  // Validation
  if (userName == '') {
    document.querySelector(".invalid").classList.remove("hide");
    return;
  }
  // Save Login Data in localStorage
  localStorage.setItem('UserName', userName);
  localStorage.setItem("UserLevel", userLevel);

  // Hide the Login section & show Groups section
  logins.classList.add("hide");
  groups.classList.remove("hide");

  // Select the Board type 4x4 or 9x9
  if (userLevelInput.value == "levelTwo") {
    // 9X9 Board
    boardNumber = data9x9.response["unsolved-sudoku"];
    solution = data9x9.response.solution;
  } else if (userLevelInput.value == "levelOne") {
    // 4X4 Board
    boardNumber = board4x4;
    solution = solution4x4;
  }
}

function initializeGame(e) {
  // Selected Group
  let selectedGroup = this.id;
  console.log(selectedGroup);

  // Hide the Groups Section & Show The Game Board
  groups.classList.add("hide");
  gameBoard.classList.remove("hide");

  // Initialize the Game 
  // a ) Create topBarControl
  welcome.innerHTML = `Welcome: ${userName}`;


  // b ) Create Game Board & Game Image Bar
  // startGameBtn.addEventListener('click',);
  if (userLevel == 'levelOne') {
    board.classList.add("board4");
    createImgBar(4, selectedGroup);

    startGameBtn.addEventListener('click', function (e) {
      console.log(selectedGroup);
      e.preventDefault();
      createBoard(4, 4, selectedGroup);
      countDownTimer(60);
      startSelecting();
    }, { once: true });

  } else if (userLevel == 'levelTwo') {
    board.classList.add("board9");
    createImgBar(9, selectedGroup);

    startGameBtn.addEventListener('click', function (e) {
      e.preventDefault();
      createBoard(9, 9, selectedGroup);
      countDownTimer(120);
      startSelecting();
    }, { once: true });
  }

  // c ) selectTileImg & selectBarImg
  function startSelecting() {
    imgBarItems = document.querySelectorAll(".imgBarItem");
    tiles = document.querySelectorAll(".tile");
    imgBarItems.forEach(itm => {
      itm.addEventListener('click', selectBarImg);// click events
    });
    tiles.forEach(itm => {
      itm.addEventListener('click', selectTileImg);// click events
    });
  }

};

function createImgBar(num, selectedGroup) {
  for (let i = 1; i <= num; i++) {
    imgBarItem = document.createElement("img");
    imgBarItem.src = `./assets/imgs/groups/${selectedGroup}/${i}.jpg`;
    imgBarItem.classList.add("imgBarItem");
    imgBar.append(imgBarItem);
  }
}

function createBoard(rows, columns, selectedGroup) {
  console.log(selectedGroup + 'inside CreateBoard');

  for (let r = 0; r < rows; r++) { // rows
    for (let c = 0; c < columns; c++) { // columns
      tile = document.createElement("div");
      tile.id = r.toString() + '-' + c.toString();
      tileImg = document.createElement("img");
      tileImg.classList.add("tileImg");
      tile.append(tileImg);

      if (boardNumber[r][c] != '0' && boardNumber[r][c] != '.') {
        // tile.innerText = boardNumber[r][c];
        tileImg.src = `./assets/imgs/groups/${selectedGroup}/${boardNumber[r][c]}.jpg`;
      }

      if (rows == 4) {
        tile.classList.add("tile");
        tile.classList.add("tile4");
      } else if (rows == 9) {
        tile.classList.add("tile");
        tile.classList.add("tile9");
      }
      board.appendChild(tile);
    };
  };
};

function selectBarImg(e) {
  selectedBarImg = this;
  // Remove selectedImg class from all items
  imgBarItems.forEach(itm => {
    itm.classList.remove("selectedImg");
  });
  // and add it to the current selected img
  this.classList.add("selectedImg");
};

function selectTileImg(e) {
  selectedBoardImg = this.firstChild;
  let selectedBoardTileId = this.id;

  // if (selectedBoardImg.src != "") { // ensure that the tile has no value
  //   return;
  // }

  // & Check The Solution
  // Check the selected item and compar it with the solution
  let coords = selectedBoardTileId.split('-'); // [r,c]
  let r = parseInt(coords[0]);
  let c = parseInt(coords[1]);

  let startFormat = selectedBarImg.src.indexOf(".jpg") //157
  let currentSelectedBarImgNumber = selectedBarImg.src.substring(startFormat - 1, startFormat);

  // console.log("solutionNumber", solution[r][c]);
  // console.log("currentSelectedImgNumber", currentSelectedBarImgNumber);

  if (solution[r][c] == currentSelectedBarImgNumber) {
    // console.log(selectedBoardImg.src);
    // console.log(selectedBarImg.src);
    selectedBoardImg.src = selectedBarImg.src;
  } else {
    errors++;
    errorCount.innerText = errors;
    // If Number of Errors Exceed specific number based on level ==> GameOver
    if (userLevel == 'levelOne') {
      if (errors == 10) {
        finishGame("GameOver");
      };
    } else if (userLevel == 'levelTwo') {
      if (errors == 20) {
        finishGame("GameOver");
      };
    }
  };

  //d ) Check the selectedBoardImg if completed or not and compar it with the board solution 
  checkTheSolution();
};

function checkTheSolution() {
  let tileImgs = document.querySelectorAll(".tileImg");
  let solvedTileCount = 0;
  tileImgs.forEach(elm => {
    // console.log(elm.src);
    if (elm.src != '') {
      solvedTileCount++;
    }
  });
  console.log(solvedTileCount);

  // Check if the grid is filled to finish the Game or not
  // console.log(userLevel);

  if (userLevel == 'levelOne') {
    if (solvedTileCount == 16) {
      finishGame("SolvedWithinTime");
    }
  } else if (userLevel == 'levelTwo') {
    if (solvedTileCount == 16) {
      finishGame("SolvedWithinTime");
    }
  }
}

// Function to Finish the Game and Show the GameOverMessage or the WinningMessage
function finishGame(status) {
  // Show the Message Section & hide the gameBoard Section
  message.classList.remove("hide");
  gameBoard.classList.add("hide");

  if (status == 'SolvedWithinTime') {
    // Change the Background of the Message Section to winingBg
    message.style.backgroundImage = `url(./assets/imgs/messages/congratulations/3.png)`;
    message.style.backgroundSize = "cover";
    showWingingMessage();
  }
  if (status == 'GameOver') {

    showGameOverMessage();
  }
}

// Messages
function showWingingMessage() {
  console.log("Congratulating, You are Winner 💪 🥰");
  confirmMessage.innerHTML = `<p>Congratulating, You are Winner 💪🥰. Do you want to play again?</p>`;
};

function showGameOverMessage() {
  console.log("GameOver" + "حظ سعيد المرة القادمة 😂");
  confirmMessage.innerHTML = `<p>Game Over.. 😢🤷‍♀️ Do you want to play again?</p>`;
};

// Function to convert the API fetched json data form string ===> to array of arrays.. Each inner array represent a row of the 4x4 grid board.. 
function createArrayOfArrays(feed) {
  // To Crate Array of Arrays.. spread the array String to array of arrays
  let outerArray = [];
  for (let r = 0; r < 4; r++) { // loop over rows
    let innerArray = []
    for (let c = 0; c < 4; c++) {
      innerArray.push(feed[4 * r + c]);
      // console.log(4 * r + c)
    }
    // console.log("*".repeat(15));
    outerArray.push(innerArray)
  }
  return outerArray;
};

// Timer Block
function countDownTimer(timeLimit) {
  let initialSeconds = timeLimit; // Number of Seconds
  let counterDiv = document.querySelector(".downCounter");
  let minutes = Math.floor(initialSeconds / 60);
  let seconds = Math.floor(initialSeconds % 60);

  countInterval = setInterval(() => {
    secondPass();
  }, 1000);

  let secondPass = function () {
    counterDiv.innerHTML = `${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`;
    // console.log(seconds);
    if (seconds > 0) {
      seconds--;
      if (seconds == 0) {
        if (minutes > 0) {
          minutes--;
          seconds = 60;
        } else if (minutes == 0) {
          clearInterval(countInterval);
          counterDiv.innerHTML = 'Game over';
          finishGame("GameOver");
        }
      }
    } else if (seconds == 0 && minutes >= 1) {
      if (seconds == 0) {
        minutes--;
      }
      seconds = 60;
      seconds--;
      if (seconds == 0) {
        clearInterval(countInterval);
        counterDiv.innerHTML = 'Game over';
        finishGame("GameOver");
      }
    }
  }
};
// countDownTimer();

// let counter = 0;
function changeBackground() {
  let intervalID = setInterval(() => {
    // counter++;
    let bgImgNumber = Math.round(Math.random() * 20);
    gameBoard.style.backgroundImage = `url(./assets/imgs/bg/${bgImgNumber}.jpg)`;
    gameBoard.style.backgroundSize = "cover";
    // if (counter == 2) {
    //   clearInterval(intervalID);
    // };
  }, 5000);
}
changeBackground();

function goHome() {
  window.location.reload();
}

function playAgin(e) {
  board.innerHTML = ''; // reset The Game Gride board
  imgBar.innerHTML = ''; // reset The imgBar
  message.classList.add("hide"); // hide The message Section
  // reset Errors Counter
  errors = 0;
  errorCount.innerText = errors;
  // Reset Timer & clearInterval
  clearInterval(countInterval);

  // getData(); // fetch data again
  // getLogin(e); // call get login again to update the board grid array and its solution


  groups.classList.remove("hide"); // Show Group Message
  // groupBtn.forEach(btn => {
  //   btn.addEventListener('click', initializeGame); //click
  // });
}