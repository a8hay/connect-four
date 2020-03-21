let GRID_H;
let GRID_V;
let OWNER;
let scale = 100;
let player1 = "#FFA500";
let player2 = "#9ff2e8";
let p1Turn = true;
let p1score = 0;
let p2score = 0;

function setup() {
  createCanvas(620, 680);
  GRID_H = createArray(7, 6);
  GRID_V = createArray(6, 7);
  OWNER = createArray(6, 6);
}

function draw() {
  background(51);
  translate(10, 10);
  ////////////////////////////////////// hover highlight /////////////////////////////////////
  // 2
  let xpos = floor(mouseX / scale);
  let ypos = floor(mouseY / scale);
  // 3
  let is_horizontal = abs(mouseY - ypos * scale) < abs(mouseX - xpos * scale);
  // 4
  if (mouseY - ypos * scale < 0 && !is_horizontal) {
    ypos = ypos - 1;
  } else {
    ypos = ypos;
  }
  if (mouseX - xpos * scale < 0 && is_horizontal) {
    xpos = xpos - 1;
  } else {
    xpos = xpos;
  }
  // 5
  let GRID;
  if (is_horizontal) {
    GRID = GRID_H;
  } else {
    GRID = GRID_V;
  }
  let isoutofbounds = false;
  // 6
  let linetype;
  let posx;
  let posy;
  try {
    if (!GRID[ypos][xpos]) {
      posx = xpos * scale;
      posy = ypos * scale;
      stroke(0, 255, 255);
      if (is_horizontal) {
        line(posx, posy, posx + scale, posy);
      } else {
        line(posx, posy, posx, posy + scale);
      }
    }
  } catch (error) {
    isoutofbounds = true;
  }
  let alreadyplaced = false;
  if (!isoutofbounds) {
    alreadyplaced = GRID[ypos][xpos];
  } else {
    alreadyplaced = false;
  }
  ////////////////////////////////////// hover highlight///////////////////////////////////////
  ////////////////////////////////////// mouse pressed behaviour /////////////////////////////
  if (mouseIsPressed && !alreadyplaced && !isoutofbounds) {
    if (is_horizontal) {
      GRID_H[ypos][xpos] = true;
    } else {
      GRID_V[ypos][xpos] = true;
    }
  }
  ///////////////////////////////// mouse pressed behaviour ///////////////////////////////////
  drawBoard();
  drawSquares();
  drawHud();
  determineOwner();
  updateScore();
}

function createArray(m, n) {
  // m rows and n cols
  res = [];
  for (let row = 0; row < m; row += 1) {
    temp = [];
    for (let col = 0; col < n; col += 1) {
      temp.push(false);
    }
    res.push(temp);
  }
  return res;
}

function drawBoard() {
  // draw the board //
  // horizontal lines
  for (let x = 0; x < GRID_H[0].length; x++) {
    for (let y = 0; y < GRID_H.length; y++) {
      let a = { X: x * scale, Y: y * scale };
      let b = { X: x * scale + scale, Y: y * scale };
      if (!GRID_H[y][x]) {
        // draw normal line
        stroke(0, 255, 255, 40);
        line(a.X, a.Y, b.X, b.Y);
      } else {
        // draw bright line(done line)
        stroke(0, 255, 255);
        line(a.X, a.Y, b.X, b.Y);
      }
    }
  }
  // vertical lines
  for (let x = 0; x < GRID_V[0].length; x++) {
    for (let y = 0; y < GRID_V.length; y++) {
      let a = { X: x * scale, Y: y * scale };
      let b = { X: x * scale, Y: y * scale + scale };
      if (!GRID_V[y][x]) {
        // draw normal line
        stroke(0, 255, 255, 40);
        line(a.X, a.Y, b.X, b.Y);
      } else {
        // draw bright line(done line)
        stroke(0, 255, 255);
        line(a.X, a.Y, b.X, b.Y);
      }
    }
  }
  // draw the board //
}

function drawSquares() {
  for (let x = 0; x < OWNER.length; x++) {
    for (let y = 0; y < OWNER[0].length; y++) {
      if (OWNER[x][y]) {
        if (OWNER[x][y] == "p1") {
          // draw the marker at x*scale, y*scale
          stroke(51);
          fill(player1);
          rect(x * scale, y * scale, scale, scale);
        }
        if (OWNER[x][y] == "p2") {
          // draw the other marker x*scale, y*scale
          stroke(51);
          fill(player2);
          rect(x * scale, y * scale, scale, scale);
        }
      }
    }
  }
}

function drawHud() {
  textSize(20);
  noStroke();
  // player 1
  fill(player1);
  text("Meri Baari", 0, 620);
  textSize(15);
  text("You", 0, 642);
  textSize(20);
  text(p1score, 0, 664);
  // player 2
  fill(player2);
  text("Teri Baari", 500, 620);
  textSize(15);
  text("Other player", 500, 642);
  textSize(20);
  text(p2score, 500, 664);
  // indicator
  if (p1Turn) {
    stroke(0);
    fill(0, 255, 50, 150);
    ellipse(110, 620, 28);
  } else {
    stroke(0);
    fill(0, 255, 50, 150);
    ellipse(480, 620, 28);
  }
  // instruction
  noStroke();
  text("press space to change turn", 170, 650);
}

function keyPressed() {
  // 32 is for space
  if (keyCode == 32) {
    p1Turn = !p1Turn;
  }
}

function determineOwner() {
  for (let x = 0; x < OWNER[0].length; x += 1) {
    for (let y = 0; y < OWNER.length; y += 1) {
      if (
        GRID_H[y][x] &&
        GRID_V[y][x] &&
        GRID_H[y + 1][x] &&
        GRID_V[y][x + 1]
      ) {
        if (p1Turn && !OWNER[x][y]) {
          OWNER[x][y] = "p1";
        } else if (!p1Turn && !OWNER[x][y]) {
          OWNER[x][y] = "p2";
        }
      }
    }
  }
}

function updateScore() {
  let p1count = 0;
  let p2count = 0;
  for (let x = 0; x < OWNER[0].length; x += 1) {
    for (let y = 0; y < OWNER.length; y += 1) {
      if (OWNER[y][x] == "p1") {
        p1count += 1;
      } else if (OWNER[y][x] == "p2") {
        p2count += 1;
      }
    }
  }
  p1score = p1count;
  p2score = p2count;
}
