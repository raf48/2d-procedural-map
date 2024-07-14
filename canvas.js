const width = 1100;
const height = 1100;
const fpsCount = 10;

const canvas = document.querySelector('canvas');
canvas.setAttribute("width", width);
canvas.setAttribute("height", height);
const c = canvas.getContext('2d');

const types = 7;
const cellSize = 5;
const worldWidth = Math.floor(width / cellSize);
const worldHeight = Math.floor(height / cellSize);
const map = [];
const shades = [
  '#000000', '#aaaaaa', '#016b01',
  '#00ff00', '#0000ff', '#0000aa', '#ffffff'
]
const notAllowed = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 0],
  [0, 0, 0, 0, 1, 1, 1],
  [0, 1, 0, 0, 0, 1, 1],
  [0, 1, 1, 0, 0, 0, 1],
  [0, 1, 1, 1, 0, 0, 1],
  [0, 0, 1, 1, 1, 1, 0],
]

// Animation Loop
function animate() {
  draw();
  setTimeout(
    () => requestAnimationFrame(animate),
    1000 / fpsCount
  );
}

function setup() {
  for (let i = 0; i < worldHeight; i++) {
    map[i] = [];
    for (let j = 0; j < worldWidth; j++) {
      map[i][j] = 0;
      // Generate an island
      // if (Math.sqrt(
      //         Math.pow(i - worldHeight * 0.5, 2) +
      //         Math.pow(j - worldWidth * 0.5, 2)) > 100) {
      //     map[i][j] = 5;
      // }
      // // Have snow mountains in the middle
      // if (Math.sqrt(
      //         Math.pow(i - worldHeight * 0.5, 2) +
      //         Math.pow(j - worldWidth * 0.5, 2)) < 15) {
      //     map[i][j] = 6;
      // }
      // const range = Math.sqrt(
      //     Math.pow(i - worldHeight * 0.5, 2) +
      //     Math.pow(j - worldWidth * 0.5, 2));
      // if (range < 25 && range > 15) {
      //     map[i][j] = 6 * randomInt(2);
      // }
    }
  }
}

function draw() {
  
  for (let y = 0; y < worldHeight; y++) {
    for (let x = 0; x < worldWidth; x++) {
      c.fillStyle = shades[map[x][y]];
      c.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }
  
  leastConflicts();
}

function leastConflicts() {
  let success = true;
  const tries = 8;
  
  for (let i = 0; i < worldWidth * worldHeight; i++) {
    let x = randomInt(worldWidth);
    let y = randomInt(worldHeight);
    let conflicts = checkConflicts(x, y);
    if (conflicts > 0 || map[x][y] == 0) {
      success = false;
      let leastConflicts = 20;
      let tempT = 0;
      let tempC = 0;
      let bestType = 0;
      
      for (let j = 0; j < tries; j++) {
        tempT = 1 + randomInt(types - 1);
        map[x][y] = tempT;
        tempC = checkConflicts(x, y);
        if (tempC < leastConflicts) {
          bestType = tempT;
          leastConflicts = tempC;
        }
      }
      map[x][y] = bestType;
    }
  }
  
  return success;
}

function checkConflicts(x, y) {
  let conflicts = 0;
  let range = 3;
  for (let dx = -range; dx <= range; dx++) {
    for (let dy = -range; dy <= range; dy++) {
      let tx = (dx + x + worldWidth) % worldWidth;
      let ty = (dy + y + worldHeight) % worldHeight;
      conflicts += notAllowed[map[x][y]][map[tx][ty]];
    }
  }
  
  return conflicts;
}

function start() {
  setup();
  animate();
}
