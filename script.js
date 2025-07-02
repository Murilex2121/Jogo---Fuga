const gameElement = document.getElementById("game");
const statusText = document.getElementById("status");

const width = 10;
const height = 10;

const levels = [
  [
    "##########",
    "#P     E #",
    "#  ##    #",
    "#    ##  #",
    "#  #     #",
    "#   #    #",
    "#    #   #",
    "#   ##  K#",
    "#      ###",
    "######X###"
  ],
  [
    "##########",
    "#P  ##  E#",
    "# ##  ## #",
    "#    #   #",
    "# ##   # #",
    "#   ##   #",
    "# #   ## #",
    "#   #  K #",
    "# ##     #",
    "###X######"
  ],
  [
    "##########",
    "#P#   ##E#",
    "# ## #  ##",
    "#  #  ## #",
    "# ## #   #",
    "#   ## # #",
    "# #    # #",
    "#  ## K  #",
    "# ##  ### ",
    "###X######"
  ]
];

let currentLevel = 0;
let map = levels[currentLevel];

let player = { x: 0, y: 0 };
let enemies = [];
let keyCollected = false;

function findPositions() {
  enemies = [];
  for(let y=0; y < height; y++){
    for(let x=0; x < width; x++){
      const c = map[y][x];
      if(c === "P") player = {x,y};
      if(c === "E") enemies.push({x,y});
    }
  }
}

function renderMap() {
  gameElement.innerHTML = "";
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      let char = map[y][x];

      if (x === player.x && y === player.y) {
        cell.classList.add("player");
        cell.textContent = "🧑";
      } else if (enemies.some(e => e.x === x && e.y === y)) {
        cell.classList.add("enemy");
        cell.textContent = "👁️";
      } else if (char === "#") {
        cell.classList.add("wall");
      } else if (char === "K") {
        cell.classList.add("key");
        cell.textContent = "🔑";
      } else if (char === "X") {
        cell.classList.add("exit");
        cell.textContent = "🚪";
      }
      gameElement.appendChild(cell);
    }
  }
}

function isWall(x, y) {
  if (x < 0 || y < 0 || x >= width || y >= height) return true;
  return map[y][x] === "#";
}

function movePlayer(dx, dy) {
  const newX = player.x + dx;
  const newY = player.y + dy;
  if (isWall(newX, newY)) return;
  player.x = newX;
  player.y = newY;

  if (map[newY][newX] === "K") {
    keyCollected = true;
    map[newY] = map[newY].substring(0, newX) + " " + map[newY].substring(newX + 1);
    statusText.textContent = "🔓 Chave coletada! Vá até a saída.";
  }

  if (map[newY][newX] === "X" && keyCollected) {
    currentLevel++;
    if(currentLevel >= levels.length){
      statusText.textContent = "🎉 Parabéns! Você escapou da Matrix em todas as fases!";
      document.removeEventListener("keydown", handleKey);
      return;
    } else {
      map = levels[currentLevel];
      keyCollected = false;
      statusText.textContent = `⚡️ Fase ${currentLevel + 1} iniciada!`;
      findPositions();
    }
  }

  if(enemies.some(e => e.x === player.x && e.y === player.y)){
    statusText.textContent = "💀 Você foi pego pelo agente!";
    document.removeEventListener("keydown", handleKey);
  }

  renderMap();
}

function moveEnemies() {
  for(let i=0; i < enemies.length; i++){
    const e = enemies[i];
    let dx = 0, dy = 0;
    if(player.x > e.x) dx = 1;
    else if(player.x < e.x) dx = -1;
    else if(player.y > e.y) dy = 1;
    else if(player.y < e.y) dy = -1;

    if(!isWall(e.x + dx, e.y) && !enemies.some(en => en !== e && en.x === e.x + dx && en.y === e.y)){
      enemies[i].x += dx;
    } else if(!isWall(e.x, e.y + dy) && !enemies.some(en => en !== e && en.x === e.x && en.y === e.y + dy)){
      enemies[i].y += dy;
    }

    if(enemies[i].x === player.x && enemies[i].y === player.y){
      statusText.textContent = "💀 Você foi pego pelo agente!";
      document.removeEventListener("keydown", handleKey);
    }
  }
}

function handleKey(e) {
  switch (e.key) {
    case "ArrowUp": movePlayer(0, -1); break;
    case "ArrowDown": movePlayer(0, 1); break;
    case "ArrowLeft": movePlayer(-1, 0); break;
    case "ArrowRight": movePlayer(1, 0); break;
  }
  moveEnemies();
  renderMap();
}

findPositions();
renderMap();
statusText.textContent = `⚡️ Fase 1 iniciada!`;
document.addEventListener("keydown", handleKey);