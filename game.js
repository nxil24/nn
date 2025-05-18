// ==== Data ====
const locations = [
  {
    id: "forest",
    name: "Enchanted Forest",
    bg: "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1350&q=80')",
    story: "The Enchanted Forest hides many secrets. Solve the riddle to find your path.",
    riddle: {
      question: "I have roots but no branches, I have leaves but I'm not a tree. What am I?",
      answer: "book",
    },
    requiredItem: "Mystic Map",
    miniGame: "maze",
  },
  {
    id: "volcano",
    name: "Volcanic Crater",
    bg: "url('https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1350&q=80')",
    story: "The Volcano is hot and dangerous. Use your memory to survive.",
    riddle: {
      question: "What runs but never walks, has a bed but never sleeps?",
      answer: "river",
    },
    requiredItem: "Fire Charm",
    miniGame: "memory",
  },
  {
    id: "castle",
    name: "Ancient Castle",
    bg: "url('https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1350&q=80')",
    story: "The Castle guards many treasures. Aim well to conquer.",
    riddle: {
      question: "I speak without a mouth and hear without ears. What am I?",
      answer: "echo",
    },
    requiredItem: "Golden Key",
    miniGame: "shooting",
  },
];

const shopItems = [
  {
    name: "Mystic Map",
    desc: "Helps you navigate the Enchanted Forest.",
    price: 15,
    img: "https://img.icons8.com/emoji/96/000000/world-map-emoji.png",
  },
  {
    name: "Fire Charm",
    desc: "Protects you in the Volcanic Crater.",
    price: 25,
    img: "https://img.icons8.com/color/96/000000/fire-element.png",
  },
  {
    name: "Golden Key",
    desc: "Opens the Ancient Castle doors.",
    price: 30,
    img: "https://img.icons8.com/color/96/000000/key.png",
  },
];

// ==== Variables ====
let profiles = JSON.parse(localStorage.getItem("profiles")) || {};
let currentProfile = null;
let currentLocation = null;
let coins = 0;
let mute = false;

// Elements
const welcomeMsg = document.getElementById("welcome-msg");
const coinBalance = document.getElementById("coin-balance");
const shopBtn = document.getElementById("shop-btn");
const muteBtn = document.getElementById("mute-btn");

const profileInput = document.getElementById("profile-input");
const createProfileBtn = document.getElementById("create-profile-btn");
const profileSelect = document.getElementById("profile-select");
const deleteProfileBtn = document.getElementById("delete-profile-btn");

const gameArea = document.getElementById("game-area");
const locationButtonsDiv = document.getElementById("location-buttons");
const locationStorySection = document.getElementById("location-story");
const locationName = document.getElementById("location-name");
const locationStoryText = document.getElementById("location-story-text");

const riddleSection = document.getElementById("riddle-section");
const riddleQuestion = document.getElementById("riddle-question");
const riddleAnswerInput = document.getElementById("riddle-answer");
const submitRiddleBtn = document.getElementById("submit-riddle-btn");
const riddleFeedback = document.getElementById("riddle-feedback");

const miniGameSection = document.getElementById("mini-game");
const miniGameTitle = document.getElementById("mini-game-title");
const gameInstructions = document.getElementById("game-instructions");

const mazeGameDiv = document.getElementById("maze-game");
const mazeControls = document.getElementById("maze-controls");
const mazeUpBtn = document.getElementById("maze-up");
const mazeLeftBtn = document.getElementById("maze-left");
const mazeDownBtn = document.getElementById("maze-down");
const mazeRightBtn = document.getElementById("maze-right");

const memoryGameBoard = document.getElementById("memory-game-board");
const shootingCanvas = document.getElementById("shooting-canvas");
const exitMiniGameBtn = document.getElementById("exit-mini-game");

const shopModal = document.getElementById("shop");
const shopContainer = document.getElementById("shop-container");
const shopItemsDiv = document.getElementById("shop-items");
const closeShopBtn = document.getElementById("close-shop-btn");

// ==== Helper Functions ====

function saveProfiles() {
  localStorage.setItem("profiles", JSON.stringify(profiles));
}

function updateWelcome() {
  if(currentProfile){
    welcomeMsg.textContent = `Welcome, ${currentProfile}!`;
  } else {
    welcomeMsg.textContent = "";
  }
}

function updateCoins() {
  coinBalance.textContent = coins;
}

function changeBackground(imageUrl) {
  document.body.style.backgroundImage = imageUrl;
}

function resetGameSections() {
  locationStorySection.classList.add("hidden");
  miniGameSection.classList.add("hidden");
  mazeGameDiv.classList.add("hidden");
  mazeControls.classList.add("hidden");
  memoryGameBoard.classList.add("hidden");
  shootingCanvas.classList.add("hidden");
  exitMiniGameBtn.classList.add("hidden");
  riddleFeedback.textContent = "";
  riddleAnswerInput.value = "";
}

function loadProfileNames(){
  if(Object.keys(profiles).length === 0){
    profileSelect.classList.add("hidden");
    deleteProfileBtn.classList.add("hidden");
    return;
  }
  profileSelect.innerHTML = "";
  Object.keys(profiles).forEach(name => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    profileSelect.appendChild(option);
  });
  profileSelect.classList.remove("hidden");
  deleteProfileBtn.classList.remove("hidden");
}

function showShop() {
  shopModal.classList.remove("hidden");
}

function hideShop() {
  shopModal.classList.add("hidden");
}

function addCoins(amount){
  coins += amount;
  updateCoins();
  if(currentProfile){
    profiles[currentProfile].coins = coins;
    saveProfiles();
  }
}

// ==== Profile management ====

createProfileBtn.addEventListener("click", () => {
  const name = profileInput.value.trim();
  if(!name){
    alert("Please enter a name.");
    return;
  }
  if(profiles[name]){
    alert("Profile with this name already exists.");
    return;
  }
  profiles[name] = { coins: 50, items: [] };
  currentProfile = name;
  coins = 50;
  saveProfiles();
  updateWelcome();
  updateCoins();
  loadProfileNames();
  profileInput.value = "";
  profileSelect.value = currentProfile;
  gameArea.classList.remove("hidden");
});

profileSelect.addEventListener("change", () => {
  const selected = profileSelect.value;
  if(selected && profiles[selected]){
    currentProfile = selected;
    coins = profiles[selected].coins || 0;
    updateWelcome();
    updateCoins();
    gameArea.classList.remove("hidden");
  }
});

deleteProfileBtn.addEventListener("click", () => {
  if(currentProfile && confirm(`Delete profile "${currentProfile}"?`)){
    delete profiles[currentProfile];
    currentProfile = null;
    coins = 0;
    saveProfiles();
    updateWelcome();
    updateCoins();
    loadProfileNames();
    gameArea.classList.add("hidden");
  }
});

// ==== Location buttons ====

function createLocationButtons() {
  locationButtonsDiv.innerHTML = "";
  locations.forEach(loc => {
    const container = document.createElement("div");
    container.className = "location-btn-container";

    const img = document.createElement("img");
    img.src = loc.bg.replace(/url\(['"]?(.*?)['"]?\)/, "$1");
    img.alt = loc.name;

    const h3 = document.createElement("h3");
    h3.textContent = loc.name;

    const btn = document.createElement("button");
    btn.textContent = `Explore ${loc.name}`;
    btn.addEventListener("click", () => {
      enterLocation(loc.id);
    });

    container.appendChild(img);
    container.appendChild(h3);
    container.appendChild(btn);

    locationButtonsDiv.appendChild(container);
  });
}

// ==== Enter location ====

function enterLocation(id){
  const loc = locations.find(l => l.id === id);
  if(!loc) return;

  if(!currentProfile) {
    alert("Select or create a profile first!");
    return;
  }

  currentLocation = loc;

  // Check if player has required item
  const playerItems = profiles[currentProfile].items || [];
  if(!playerItems.includes(loc.requiredItem)){
    alert(`You need the item "${loc.requiredItem}" to explore this location. Buy it in the shop!`);
    return;
  }

  resetGameSections();

  changeBackground(loc.bg);

  locationName.textContent = loc.name;
  locationStoryText.textContent = loc.story;
  locationStorySection.classList.remove("hidden");

  riddleQuestion.textContent = loc.riddle.question;
  riddleAnswerInput.value = "";
  riddleFeedback.textContent = "";
  riddleSection.classList.remove("hidden");

  miniGameSection.classList.add("hidden");
}

// ==== Riddle ====

submitRiddleBtn.addEventListener("click", () => {
  const answer = riddleAnswerInput.value.trim().toLowerCase();
  const correctAnswer = currentLocation.riddle.answer.toLowerCase();
  if(answer === correctAnswer){
    riddleFeedback.style.color = "green";
    riddleFeedback.textContent = "Correct! Starting mini-game...";
    startMiniGame(currentLocation.miniGame);
  } else {
    riddleFeedback.style.color = "red";
    riddleFeedback.textContent = "Wrong answer. Try again!";
  }
});

// ==== Mini Games ====

exitMiniGameBtn.addEventListener("click", () => {
  resetGameSections();
  locationStorySection.classList.remove("hidden");
  changeBackground(currentLocation.bg);
});

// ------------- Maze Game -------------

const mazeSize = 10;
const maze = [];
let playerPos = { x: 0, y: mazeSize - 1 };
let mazeExit = { x: mazeSize - 1, y: 0 };

function generateMaze(){
  maze.length = 0;
  for(let y=0; y<mazeSize; y++){
    maze[y] = [];
    for(let x=0; x<mazeSize; x++){
      // create walls on borders and some random inner walls
      if(x === 0 || y === 0 || x === mazeSize-1 || y === mazeSize-1){
        maze[y][x] = 1; // wall
      } else if(Math.random() < 0.23){
        maze[y][x] = 1; // wall
      } else {
        maze[y][x] = 0; // path
      }
    }
  }
  // Ensure player start and exit clear
  maze[playerPos.y][playerPos.x] = 0;
  maze[mazeExit.y][mazeExit.x] = 0;
}

function renderMaze(){
  mazeGameDiv.innerHTML = "";
  for(let y=0; y<mazeSize; y++){
    for(let x=0; x<mazeSize; x++){
      const cell = document.createElement("div");
      cell.className = "maze-cell";
      if(maze[y][x] === 1){
        cell.classList.add("maze-wall");
      }
      if(x === playerPos.x && y === playerPos.y){
        cell.classList.add("player");
      }
      if(x === mazeExit.x && y === mazeExit.y){
        cell.style.backgroundColor = "#ffeb3b";
        cell.style.borderRadius = "8px";
      }
      mazeGameDiv.appendChild(cell);
    }
  }
}

function movePlayer(dx, dy){
  const nx = playerPos.x + dx;
  const ny = playerPos.y + dy;
  if(nx < 0 || nx >= mazeSize || ny < 0 || ny >= mazeSize) return;
  if(maze[ny][nx] === 1) return; // wall
  playerPos.x = nx;
  playerPos.y = ny;
  renderMaze();
  if(nx === mazeExit.x && ny === mazeExit.y){
    setTimeout(() => {
      alert("You escaped the maze! +10 coins");
      addCoins(10);
      exitMiniGameBtn.click();
    }, 200);
  }
}

function setupMazeGame(){
  mazeGameDiv.classList.remove("hidden");
  mazeControls.classList.remove("hidden");
  playerPos = { x: 0, y: mazeSize - 1 };
  generateMaze();
  renderMaze();
}

// Maze controls buttons
mazeUpBtn.onclick = () => movePlayer(0, -1);
mazeDownBtn.onclick = () => movePlayer(0, 1);
mazeLeftBtn.onclick = () => movePlayer(-1, 0);
mazeRightBtn.onclick = () => movePlayer(1, 0);

// Keyboard arrow keys control for maze
function mazeKeyHandler(e){
  if(miniGameSection.classList.contains("hidden")) return;
  if(currentLocation.miniGame !== "maze") return;

  switch(e.key){
    case "ArrowUp": movePlayer(0, -1); break;
    case "ArrowDown": movePlayer(0, 1); break;
    case "ArrowLeft": movePlayer(-1, 0); break;
    case "ArrowRight": movePlayer(1, 0); break;
  }
}

// Touch support for maze swipe detection
let touchStartX = null;
let touchStartY = null;
mazeGameDiv.addEventListener("touchstart", e => {
  const t = e.touches[0];
  touchStartX = t.clientX;
  touchStartY = t.clientY;
});
mazeGameDiv.addEventListener("touchend", e => {
  if(touchStartX === null || touchStartY === null) return;
  const t = e.changedTouches[0];
  const dx = t.clientX - touchStartX;
  const dy = t.clientY - touchStartY;
  if(Math.abs(dx) > Math.abs(dy)){
    // horizontal swipe
    if(dx > 20) movePlayer(1, 0);
    else if(dx < -20) movePlayer(-1, 0);
  } else {
    // vertical swipe
    if(dy > 20) movePlayer(0, 1);
    else if(dy < -20) movePlayer(0, -1);
  }
  touchStartX = null;
  touchStartY = null;
});

// ------------- Memory Game -------------

const symbols = ['🍎', '🍌', '🍒', '🍇', '🍉', '🥝', '🍍', '🥥'];

let memoryCards = [];
let flippedCards = [];
let matchedPairs = 0;

function shuffleArray(arr) {
  for(let i = arr.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i+1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function setupMemoryGame() {
  memoryGameBoard.classList.remove("hidden");
  memoryGameBoard.innerHTML = "";
  flippedCards = [];
  matchedPairs = 0;

  const pairs = symbols.slice(0, 8);
  memoryCards = pairs.concat(pairs);
  shuffleArray(memoryCards);

  memoryCards.forEach((sym, idx) => {
    const card = document.createElement("div");
    card.className = "memory-card";
    card.dataset.symbol = sym;

    const front = document.createElement("div");
    front.className = "front";
    front.textContent = sym;

    const back = document.createElement("div");
    back.className = "back";
    back.textContent = "?";

    card.appendChild(front);
    card.appendChild(back);

    card.addEventListener("click", () => {
      if(card.classList.contains("flipped") || flippedCards.length === 2) return;
      card.classList.add("flipped");
      flippedCards.push(card);
      if(flippedCards.length === 2){
        checkMemoryMatch();
      }
    });

    memoryGameBoard.appendChild(card);
  });
}

function checkMemoryMatch(){
  const [card1, card2] = flippedCards;
  if(card1.dataset.symbol === card2.dataset.symbol){
    matchedPairs++;
    flippedCards = [];
    if(matchedPairs === symbols.length){
      setTimeout(() => {
        alert("You matched all pairs! +15 coins");
        addCoins(15);
        exitMiniGameBtn.click();
      }, 400);
    }
  } else {
    setTimeout(() => {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
      flippedCards = [];
    }, 1000);
  }
}

// ------------- Shooting Game -------------

const ctx = shootingCanvas.getContext("2d");
let shootingWidth = 480;
let shootingHeight = 320;
let target = null;
let shotsFired = 0;
let hits = 0;
let shootingActive = false;

function resizeCanvas(){
  const ratio = shootingWidth / shootingHeight;
  let w = Math.min(window.innerWidth * 0.8, shootingWidth);
  let h = w / ratio;
  shootingCanvas.width = w;
  shootingCanvas.height = h;
}

function startShootingGame(){
  shootingCanvas.classList.remove("hidden");
  exitMiniGameBtn.classList.remove("hidden");
  shotsFired = 0;
  hits = 0;
  shootingActive = true;
  spawnTarget();
  drawShootingGame();
}

function spawnTarget(){
  const padding = 40;
  target = {
    x: Math.random() * (shootingCanvas.width - 2*padding) + padding,
    y: Math.random() * (shootingCanvas.height - 2*padding) + padding,
    radius: 25,
    hit: false,
  };
}

function drawShootingGame(){
  if(!shootingActive) return;
  ctx.clearRect(0, 0, shootingCanvas.width, shootingCanvas.height);
  // Draw target
  if(target && !target.hit){
    ctx.beginPath();
    ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#e53935";
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#b71c1c";
    ctx.stroke();

    // Inner circle
    ctx.beginPath();
    ctx.arc(target.x, target.y, target.radius/2, 0, Math.PI * 2);
    ctx.fillStyle = "#ff7961";
    ctx.fill();
  }
  // Draw info
  ctx.fillStyle = "#000";
  ctx.font = "16px Arial";
  ctx.fillText(`Hits: ${hits} / 5`, 10, 20);
  ctx.fillText(`Shots Fired: ${shotsFired}`, 10, 40);

  requestAnimationFrame(drawShootingGame);
}

shootingCanvas.addEventListener("click", (e) => {
  if(!shootingActive || !target || target.hit) return;

  const rect = shootingCanvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  const dist = Math.hypot(mx - target.x, my - target.y);
  shotsFired++;

  if(dist <= target.radius){
    hits++;
    target.hit = true;
    if(hits >= 5){
      shootingActive = false;
      setTimeout(() => {
        alert(`Victory! You scored 5 hits with ${shotsFired} shots. +20 coins`);
        addCoins(20);
        exitMiniGameBtn.click();
      }, 300);
    } else {
      setTimeout(() => {
        spawnTarget();
      }, 800);
    }
  }
});

// ==== Start MiniGame ====

function startMiniGame(name){
  resetGameSections();
  miniGameTitle.textContent = `Mini Game: ${name.charAt(0).toUpperCase() + name.slice(1)}`;
  miniGameSection.classList.remove("hidden");
  exitMiniGameBtn.classList.remove("hidden");

  if(name === "maze"){
    setupMazeGame();
  } else if(name === "memory"){
    setupMemoryGame();
  } else if(name === "shooting"){
    startShootingGame();
  }
}

// ==== Shop ====

function renderShop(){
  shopItemsDiv.innerHTML = "";
  shopItems.forEach(item => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "shop-item";

    const img = document.createElement("img");
    img.src = item.img;
    img.alt = item.name;

    const detailsDiv = document.createElement("div");
    detailsDiv.className = "shop-item-details";

    const title = document.createElement("h4");
    title.textContent = item.name;

    const desc = document.createElement("p");
    desc.textContent = item.desc;

    const price = document.createElement("p");
    price.textContent = `Price: ${item.price} coins`;

    const buyBtn = document.createElement("button");
    buyBtn.textContent = "Buy";
    buyBtn.addEventListener("click", () => {
      if(coins >= item.price){
        coins -= item.price;
        profiles[currentProfile].coins = coins;
        if(!profiles[currentProfile].items) profiles[currentProfile].items = [];
        if(!profiles[currentProfile].items.includes(item.name)){
          profiles[currentProfile].items.push(item.name);
        }
        saveProfiles();
        updateCoins();
        alert(`You bought ${item.name}!`);
        renderShop();
      } else {
        alert("Not enough coins.");
      }
    });

    detailsDiv.appendChild(title);
    detailsDiv.appendChild(desc);
    detailsDiv.appendChild(price);
    detailsDiv.appendChild(buyBtn);

    itemDiv.appendChild(img);
    itemDiv.appendChild(detailsDiv);
    shopItemsDiv.appendChild(itemDiv);
  });
}

// ==== Event Listeners ====

shopBtn.addEventListener("click", () => {
  if(!currentProfile){
    alert("Please select or create a profile first!");
    return;
  }
  renderShop();
  showShop();
});

closeShopBtn.addEventListener("click", () => {
  hideShop();
});

// ==== Initialize ====

window.addEventListener("keydown", mazeKeyHandler);

loadProfileNames();
updateWelcome();
updateCoins();
createLocationButtons();

gameArea.classList.add("hidden");
riddleSection.classList.add("hidden");
locationStorySection.classList.add("hidden");
miniGameSection.classList.add("hidden");
shopModal.classList.add("hidden");
