// ------------------Methods & variables------------------



let id = 0;
let selectedId = -1;
let localValue = localStorage.getItem("array");
if(localValue) localValue = JSON.parse(localValue);
let array = localValue || [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
];
// console.log();
// localStorage.setItem("array", JSON.stringify(array));

const idToIndex = (id) => {
  let row = 0,
    col = 0;
  let a = Math.floor(id / 9);
  row += Math.floor(a / 3) * 3;
  col += (a % 3) * 3;
  let b = id % 9;
  row += Math.floor(b / 3);
  col += b % 3;
  return { row, col };
};

const validChecker = (row, col, num) => {
  let a = Math.floor(row / 3) * 3;
  let b = Math.floor(col / 3) * 3;
  for (let i = 0; i < 9; i++) {
    let c = i % 3;
    let d = Math.floor(i / 3);
    if (
      array[i][col] == num ||
      array[row][i] == num ||
      array[a + c][b + d] == num
    ) {
      return false;
    }
  }
  return true;
};

const sudokuSolver = () => {
  let flag = false;
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (array[i][j] === 0) {
        for (let k = 1; k <= 9; k++) {
          if (validChecker(i, j, k)) {
            array[i][j] = k;
            if (sudokuSolver()) {
              flag = true;
              break;
            }
          }
        }
        if (!flag) {
          array[i][j] = 0;
          return false;
        }
      }
    }
  }
  return true;
};

const checkErrorsAfterSolve = () => {
  for(let i=0; i<9; i++) {
    for(let j=0; j<9; j++) {
      let k = array[i][j];
      array[i][j] = -1;
      if(!validChecker(i, j, k) || !validChecker(i,j,0)) return false;
      array[i][j] = k;
    }
  }
  return true;
}

const hanldeSolveButtonClick = () => {
  blockPopup.classList.add("active");
  const preLoadedArray = array;
  if (sudokuSolver(0, 0) && checkErrorsAfterSolve()) {
    console.log("Solved");
    localStorage.setItem("array", JSON.stringify(array));
    // console.log(array);
    const sudokuButtons = document.querySelectorAll(".button");

    sudokuButtons.forEach((button, i) => {
      const { row, col } = idToIndex(i);
      button.innerText = array[row][col];
    });
  } else {
    popupMssg.innerText = "Can't solved!";
    popup.classList.add("active");
    // console.log(array);
  }
  array = preLoadedArray;
  blockPopup.classList.remove("active");
};



const sudoku = document.getElementById("sudoku");
const allChilds = sudoku.children;
const navber = document.querySelector("#navbar");
const footer = document.querySelector("#footer");
const blockPopup = document.querySelector("#blockPopup");
const popup = document.querySelector("#popup");
const popupMssg = document.querySelector("#popupMssg");
const popupBackButton = document.querySelector("#popupBackButton");
// ------------------Methods & variables------------------

// ------------------Navbar------------------
const headerTag = document.createElement("h1");
headerTag.setAttribute("id", "navText");
headerTag.innerText = "Sudoku Solver";
navber.appendChild(headerTag);
// ------------------Navbar------------------

// ------------------Sudoku------------------
popupBackButton.addEventListener("click", () => {
  popup.classList.remove("active");
});

for (let idt = 1; idt < 10; idt++) {
  sudoku.innerHTML += `
  <div class="innerDiv"></div>
  `;
}
//! innerDiv created above
const innerDivList = document.querySelectorAll(".innerDiv");

for (let i = 0; i < 9; i++) {
  const temp = innerDivList[i];
  for (let j = 0; j < 9; j++) {
    const { row, col } = idToIndex(id);
    temp.innerHTML += `
      <button id="${String(id)}" class="button">${array[row][col]?array[row][col]:''}</button>
    `;
    id++;
  }
}
//! button created above
const buttons = document.querySelectorAll(".button");

buttons.forEach((button, i) => {
  button.addEventListener("click", () => {
    const prevSpc = document.querySelector(".spcButton");
    if (prevSpc) prevSpc.setAttribute("class", "button");

    const prevClass = button.getAttribute("class");
    button.setAttribute("class", prevClass + " spcButton");
    selectedId = i;
  });
});

const numbers = document.querySelector("#numbers");
for (let idt = 1; idt < 10; idt++) {
  numbers.innerHTML += `
    <button class="numButton">${idt}</button>
  `;
}
//! numButton created above
const numButton = document.querySelectorAll(".numButton");
numButton.forEach((button, i) => {
  button.addEventListener("keypress", () => {
    const spcButton = document.querySelector(".spcButton");
    if (spcButton) {
      const { row, col } = idToIndex(selectedId);
      if (validChecker(row, col, i + 1)) {
        spcButton.innerText = i + 1;
        array[row][col] = i + 1;
        // console.log(true);
        localStorage.setItem("array", JSON.stringify(array));
      } else {
        popupMssg.innerText = "Not a valid Input";
        popup.classList.add("active");
      }
    }
  });
});

addEventListener("keypress", (e) => {
  if (e.code == "Enter") {
    hanldeSolveButtonClick();
    return;
  }
  if (e.key <= "1" && e.key >= "9") {
    popupMssg.innerText = "Not a valid Input";
    popup.classList.add("active");
    return;
  }
  const i = Number(e.key);
  const spcButton = document.querySelector(".spcButton");
  if (spcButton) {
    const { row, col } = idToIndex(selectedId);
    if (validChecker(row, col, i)) {
      spcButton.innerText = i;
      array[row][col] = i;

      localStorage.setItem("array", JSON.stringify(array));
      // console.log(true, i);
    } else {
      popupMssg.innerText = "Not a valid Input";
      popup.classList.add("active");
    }
  }
});

const resetButton = document.querySelector("#resetButton");
const solveButton = document.querySelector("#solveButton");

resetButton.innerText = "Reset Now";
solveButton.innerText = "Solve Now";

solveButton.addEventListener("click", (e) => {
  hanldeSolveButtonClick();
});
resetButton.addEventListener("click", () => {
  array = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  localStorage.setItem("array", JSON.stringify(array));

  const sudokuButtons = document.querySelectorAll(".button");
  sudokuButtons.forEach((button, i) => {
    const { row, col } = idToIndex(i);
    button.innerText = "";
  });
});

// ------------------Sudoku------------------

// ------------------Footer------------------

const footerTag = document.createElement("p");
footerTag.setAttribute("id", "footText");
footerTag.innerHTML = `Created by <a target="blank" href="https://github.com/Mahfuz2411/">Mahfuz Ibne Syful</a>`;
footer.appendChild(footerTag);

// ------------------Footer------------------
