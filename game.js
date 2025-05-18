// Data and state
const treasures = [
  { name: "Gold Coin", image: "gold-coin.png", rarity: "common", value: 10 },
  { name: "Silver Sword", image: "silver-sword.png", rarity: "common", value: 20 },
  { name: "Diamond Ring", image: "diamond-ring.png", rarity: "rare", value: 50 },
  { name: "Magic Potion", image: "magic-potion.png", rarity: "rare", value: 30 },
  { name: "Ancient Artifact", image: "ancient-artifact.png", rarity: "epic", value: 100 }
];

const itemsForSale = [
  { name: "Mystic Map", image: "mystic-map.png", cost: 30 },
  { name: "Golden Key", image: "golden-key.png", cost: 50 },
  { name: "Fire Charm", image: "fire-charm.png", cost: 70 }
];

const locations = [
  { name: "Mystic Forest", image: "forest.png", requiredItem: "Mystic Map", reward: 40 },
  { name: "Volcanic Crater", image: "volcano.png", requiredItem: "Fire Charm", reward: 100 },
  { name: "Ancient Castle", image: "castle.png", requiredItem: "Golden Key", reward: 80 }
];

let collectedTreasures = JSON.parse(localStorage.getItem("collectedTreasures")) || [];
let ownedItems = JSON.parse(localStorage.getItem("ownedItems")) || [];
let coinBalance = parseInt(localStorage.getItem("coinBalance")) || 0;

// Audio
const bgm = document.getElementById("bgm");
const sfx = document.getElementById("sfx");

// Player profile (simplified)
const playerName = prompt("Enter your adventurer name:", "Adventurer") || "Adventurer";
document.getElementById("player-name").innerText = playerName;

// Utility for saving
function saveGame() {
  localStorage.setItem("collectedTreasures", JSON.stringify(collectedTreasures));
  localStorage.setItem("ownedItems", JSON.stringify(ownedItems));
  localStorage.setItem("coinBalance", coinBalance);
}

// UI updates
function updateUI() {
  document.getElementById("coin-balance").innerText = coinBalance;

  // Treasure list
  const nftList = document.getElementById("nft-list");
  nftList.innerHTML = '';
  collectedTreasures.forEach(t => {
    const div = document.createElement("div");
    div.className = "nft-item";
    div.innerHTML = `<img src="${t.image}" alt="${t.name}"><p>${t.name}</p>`;
    nftList.appendChild(div);
  });

  // Shop items
  const shopItemsContainer = document.getElementById("shop-items");
  shopItemsContainer.innerHTML = '';
  itemsForSale.forEach(item => {
    const div = document.createElement("div");
    div.className = "shop-item";
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <p>${item.name}</p>
      <p>Cost: ${item.cost} coins</p>
      <button onclick="buyItem('${item.name}')">Buy</button>
    `;
    shopItemsContainer.appendChild(div);
  });

  // Locations
  const locationContainer = document.getElementById("location-buttons");
  locationContainer.innerHTML = '';
  locations.forEach(location => {
    const div = document.createElement("div");
    div.innerHTML = `
      <img src="${location.image}" alt="${location.name}" />
      <button onclick="visitLocation('${location.name}')">Visit ${location.name}</button>
    `;
    locationContainer.appendChild(div);
  });
}

// Explore - get random treasure and coins
function explore() {
  const randomTreasure = treasures[Math.floor(Math.random() * treasures.length)];
  coinBalance += randomTreasure.value;
  collectedTreasures.push(randomTreasure);
  saveGame();
  updateUI();
  playSFX('treasure');
  showMessage(`You found a ${randomTreasure.name} worth ${randomTreasure.value} coins!`);
}

// Show simple message
function showMessage(text) {
  const info = document.getElementById("treasure-info");
  info.innerText = text;
  setTimeout(() => info.innerText = '', 3500);
}

// Buy item
function buyItem(name) {
  const item = itemsForSale.find(i => i.name === name);
  if (!item) return;
  if (coinBalance >= item.cost) {
    coinBalance -= item.cost;
    ownedItems.push(item.name);
    saveGame();
    updateUI();
    playSFX('buy');
    alert(`You bought a ${item.name}!`);
  } else {
    alert("Not enough coins!");
    playSFX('error');
  }
}

// Visit location - checks item then opens mini-game
function visitLocation(name) {
  const location = locations.find(l => l.name === name);
  if (!location) return;
  if (!ownedItems.includes(location.requiredItem)) {
    alert(`You need a ${location.requiredItem} to visit ${location.name}!`);
    playSFX('error');
    return;
  }

  // Set background & BGM for location
  setBackgroundAndMusic(location.name);

  // Show mini game modal
  document.getElementById("mini-game-container").style.display = "flex";

  // Start corresponding mini game
  startMiniGame(location.name);
}

// Set background and music based on location/shop/main
function setBackgroundAndMusic(place) {
  let bgUrl = '// Data and state
const treasures = [
  { name: "Gold Coin", image: "images/gold-coin.png", rarity: "common", value: 10 },
  { name: "Silver Sword", image: "images/silver-sword.png", rarity: "common", value: 20 },
  { name: "Diamond Ring", image: "images/diamond-ring.png", rarity: "rare", value: 50 },
  { name: "Magic Potion", image: "images/magic-potion.png", rarity: "rare", value: 30 },
  { name: "Ancient Artifact", image: "images/ancient-artifact.png", rarity: "epic", value: 100 }
];

const itemsForSale = [
  { name: "Mystic Map", image: "images/mystic-map.png", cost: 30 },
  { name: "Golden Key", image: "images/golden-key.png", cost: 50 },
  { name: "Fire Charm", image: "images/fire-charm.png", cost: 70 }
];

const locations = [
  { name: "Mystic Forest", image: "images/forest.png", requiredItem: "Mystic Map", reward: 40 },
  { name: "Volcanic Crater", image: "images/volcano.png", requiredItem: "Fire Charm", reward: 100 },
  { name: "Ancient Castle", image: "images/castle.png", requiredItem: "Golden Key", reward: 80 }
];

let collectedTreasures = JSON.parse(localStorage.getItem("collectedTreasures")) || [];
let ownedItems = JSON.parse(localStorage.getItem("ownedItems")) || [];
let coinBalance = parseInt(localStorage.getItem("coinBalance")) || 0;

// Audio
const bgm = document.getElementById("bgm");
const sfx = document.getElementById("sfx");

// Player profile (simplified)
const playerName = prompt("Enter your adventurer name:", "Adventurer") || "Adventurer";
document.getElementById("player-name").innerText = playerName;

// Utility for saving
function saveGame() {
  localStorage.setItem("collectedTreasures", JSON.stringify(collectedTreasures));
  localStorage.setItem("ownedItems", JSON.stringify(ownedItems));
  localStorage.setItem("coinBalance", coinBalance);
}

// UI updates
function updateUI() {
  document.getElementById("coin-balance").innerText = coinBalance;

  // Treasure list
  const nftList = document.getElementById("nft-list");
  nftList.innerHTML = '';
  collectedTreasures.forEach(t => {
    const div = document.createElement("div");
    div.className = "nft-item";
    div.innerHTML = `<img src="${t.image}" alt="${t.name}"><p>${t.name}</p>`;
    nftList.appendChild(div);
  });

  // Shop items
  const shopItemsContainer = document.getElementById("shop-items");
  shopItemsContainer.innerHTML = '';
  itemsForSale.forEach(item => {
    const div = document.createElement("div");
    div.className = "shop-item";
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <p>${item.name}</p>
      <p>Cost: ${item.cost} coins</p>
      <button onclick="buyItem('${item.name}')">Buy</button>
    `;
    shopItemsContainer.appendChild(div);
  });

  // Locations
  const locationContainer = document.getElementById("location-buttons");
  locationContainer.innerHTML = '';
  locations.forEach(location => {
    const div = document.createElement("div");
    div.innerHTML = `
      <img src="${location.image}" alt="${location.name}" />
      <button onclick="visitLocation('${location.name}')">Visit ${location.name}</button>
    `;
    locationContainer.appendChild(div);
  });
}

// Explore - get random treasure and coins
function explore() {
  const randomTreasure = treasures[Math.floor(Math.random() * treasures.length)];
  coinBalance += randomTreasure.value;
  collectedTreasures.push(randomTreasure);
  saveGame();
  updateUI();
  playSFX('treasure');
  showMessage(`You found a ${randomTreasure.name} worth ${randomTreasure.value} coins!`);
}

// Show simple message
function showMessage(text) {
  const info = document.getElementById("treasure-info");
  info.innerText = text;
  setTimeout(() => info.innerText = '', 3500);
}

// Buy item
function buyItem(name) {
  const item = itemsForSale.find(i => i.name === name);
  if (!item) return;
  if (coinBalance >= item.cost) {
    coinBalance -= item.cost;
    ownedItems.push(item.name);
    saveGame();
    updateUI();
    playSFX('buy');
    alert(`You bought a ${item.name}!`);
  } else {
    alert("Not enough coins!");
    playSFX('error');
  }
}

// Visit location - checks item then opens mini-game
function visitLocation(name) {
  const location = locations.find(l => l.name === name);
  if (!location) return;
  if (!ownedItems.includes(location.requiredItem)) {
    alert(`You need a ${location.requiredItem} to visit ${location.name}!`);
    playSFX('error');
    return;
  }

  // Set background & BGM for location
  setBackgroundAndMusic(location.name);

  // Show mini game modal
  document.getElementById("mini-game-container").style.display = "flex";

  // Start corresponding mini game
  startMiniGame(location.name);
}

// Set background and music based on location/shop/main
function setBackgroundAndMusic(place) {
  let bgUrl = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80';
  let musicUrl = 'audio/main.mp3';

  switch (place) {
    case 'Mystic Forest':
      bgUrl = 'backgrounds/forest.jpg';
      musicUrl = 'audio/forest.mp3';
      break;
    case 'Volcanic Crater':
      bgUrl = 'backgrounds/volcano.jpg';
      musicUrl = 'audio/volcano.mp3';
      break;
    case 'Ancient Castle':
      bgUrl = 'backgrounds/castle.jpg';
      musicUrl = 'audio/castle.mp3';
      break;
    case 'Shop':
      bgUrl = 'backgrounds/shop.jpg';
      musicUrl = 'audio/shop.mp3';
      break;
  }

  // Background with fade
  fadeBackground(bgUrl);

  // Play BGM
  playBGM(musicUrl);
}

function fadeBackground(newUrl) {
  // Using CSS opacity fade by toggling overlay to black, then switching background
  const body = document.body;
  body.style.transition = 'background-image 1s ease-in-out';
  body.style.backgroundImage = `url('${newUrl}')`;
}

// Play background music
function playBGM(src) {
  bgm.src = src;
  bgm.volume = 0.4;
  bgm.play();
}

// Play sound effects
function playSFX(type) {
  switch(type) {
    case 'treasure':
      sfx.src = 'audio/treasure.mp3';
      break;
    case 'buy':
      sfx.src = 'audio/buy.mp3';
      break;
    case 'error':
      sfx.src = 'audio/error.mp3';
      break;
    case 'shoot':
      sfx.src = 'audio/shoot.mp3';
      break;
    default:
      sfx.src = '';
  }
  if (sfx.src) {
    sfx.volume = 0.6;
    sfx.play();
  }
}

// Exit mini-game
function exitMiniGame() {
  document.getElementById("mini-game-container").style.display = "none";
  setBackgroundAndMusic('main');
  updateUI();
}

// Shop open/close handlers
document.getElementById("shop-btn").addEventListener("click", () => {
  document.getElementById("shop").style.display = "flex";
  setBackgroundAndMusic('Shop');
});

document.getElementById("close-shop-btn").addEventListener("click", () => {
  document.getElementById("shop").style.display = "none";
  setBackgroundAndMusic('main');
});

// Exit mini-game button
document.getElementById("exit-mini-btn").addEventListener("click", exitMiniGame);

// Explore button
document.getElementById("explore-btn").addEventListener("click", explore);

// Initial UI load
updateUI();

// Mini games implementation
function startMiniGame(name) {
  const container = document.getElementById("mini-game-content");
  container.innerHTML = '';

  if (name === "Mystic Forest") {
    startMazeGame(container);
  } else if (name === "Volcanic Crater") {
    startMemoryGame(container);
  } else if (name === "Ancient Castle") {
    startShootingGame(container);
  }
}

// --- Mini Game: Maze (Mystic Forest) ---
function startMazeGame(container) {
  container.innerHTML = `
    <h3>Maze Challenge - Find your way out!</h3>
    <canvas id="maze-canvas" width="600" height="400" style="background:#111; border-radius:10px;"></canvas>
    <p>Use arrow keys or WASD to move the green square.</p>
  `;

  const canvas = document.getElementById("maze-canvas");
  const ctx = canvas.getContext("2d");

  const maze = [
    "1111111111111111111111",
    "1S00000000100000000001",
    "1011110111010111110101",
    "1000010100010000010001",
    "1111010101110111010111",
    "1000000001000001000001",
    "1011111111011101111101",
    "10000000000100000000E1",
    "1111111111111111111111"
  ];

  const cellSize = 25;
  let player = { x: 1, y: 1 };
  let end = { x: 20, y: 7 };

  function drawMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let y=0; y<maze.length; y++){
      for(let x=0; x<maze[y].length; x++){
        if(maze[y][x] === "1") {
          ctx.fillStyle = "#444";
          ctx.fillRect(x*cellSize, y*cellSize, cellSize, cellSize);
        }
      }
    }
    // End point
    ctx.fillStyle = "#f39c12";
    ctx.fillRect(end.x*cellSize, end.y*cellSize, cellSize, cellSize);

    // Player
    ctx.fillStyle = "#2ecc71";
    ctx.fillRect(player.x*cellSize, player.y*cellSize, cellSize, cellSize);
  }

  function canMove(x, y){
    return maze[y] && maze[y][x] && maze[y][x] !== "1";
  }

  function handleKey(e){
    let nx = player.x;
    let ny = player.y;
    switch(e.key){
      case "ArrowUp": case "w": case "W": ny--; break;
      case "ArrowDown": case "s": case "S": ny++; break;
      case "ArrowLeft": case "a": case "A": nx--; break;
      case "ArrowRight": case "d": case "D": nx++; break;
      default: return;
    }
    if(canMove(nx, ny)){
      player.x = nx;
      player.y = ny;
      drawMaze();
      if(player.x === end.x && player.y === end.y){
        alert("You escaped the Mystic Forest Maze! +40 coins");
        coinBalance += 40;
        saveGame();
        playSFX('treasure');
        exitMiniGame();
      }
    }
  }

  window.addEventListener("keydown", handleKey);

  drawMaze();

  // Cleanup listener on exit
  const exitBtn = document.getElementById("exit-mini-btn");
  function cleanup() {
    window.removeEventListener("keydown", handleKey);
    exitBtn.removeEventListener("click", cleanup);
  }
  exitBtn.addEventListener("click", cleanup);
}

// --- Mini Game: Memory (Volcanic Crater) ---
function startMemoryGame(container) {
  container.innerHTML = `
    <h3>Memory Match - Find all pairs!</h3>
    <div id="memory-grid" style="display:grid; grid-template-columns: repeat(4, 100px); gap: 15px; justify-content:center;"></div>
    <p>Click cards to flip and find matching pairs.</p>
  `;

  const cards = [
    '🔥', '🔥', '🌋', '🌋',
    '⛏️', '⛏️', '💎', '💎',
    '🗝️', '🗝️', '⚡', '⚡'
  ];

  let shuffled = cards.slice().sort(() => 0.5 - Math.random());
  let flipped = [];
  let matched = new Set();

  const grid = document.getElementById("memory-grid");

  shuffled.forEach((emoji, i) => {
    const card = document.createElement("div");
    card.style.width = "100px";
    card.style.height = "100px";
    card.style.background = "#222";
    card.style.color = "#222";
    card.style.fontSize = "50px";
    card.style.display = "flex";
    card.style.alignItems = "center";
    card.style.justifyContent = "center";
    card.style.borderRadius = "12px";
    card.style.cursor = "pointer";
    card.dataset.index = i;
    card.dataset.emoji = emoji;
    card.textContent = emoji;
    card.style.userSelect = "none";

    card.addEventListener("click", () => {
      if(flipped.length === 2 || flipped.includes(i) || matched.has(i)) return;

      card.style.color = "#fff";
      flipped.push(i);

      if(flipped.length === 2) {
        const [a, b] = flipped;
        if(shuffled[a] === shuffled[b]) {
          matched.add(a);
          matched.add(b);
          playSFX('treasure');
          if(matched.size === shuffled.length) {
            alert("You matched all pairs! +100 coins");
            coinBalance += 100;
            saveGame();
            exitMiniGame();
          }
          flipped = [];
        } else {
          setTimeout(() => {
            grid.children[a].style.color = "#222";
            grid.children[b].style.color = "#222";
            flipped = [];
          }, 1000);
        }
      }
    });

    grid.appendChild(card);
  });
}

// --- Mini Game: Shooting (Ancient Castle) ---
function startShootingGame(container) {
  container.innerHTML = `
    <h3>Shooting Challenge - Hit the targets!</h3>
    <canvas id="shooting-canvas" width="600" height="400" style="background:#222; border-radius:10px;"></canvas>
    <p>Click on targets to shoot. Hit 5 targets to win!</p>
  `;

  const canvas = document.getElementById("shooting-canvas");
  const ctx = canvas.getContext("2d");

  const targetRadius = 20;
  let score = 0;
  let targets = [];

  function createTarget() {
    return {
      x: Math.random() * (canvas.width - 2*targetRadius) + targetRadius,
      y: Math.random() * (canvas.height - 2*targetRadius) + targetRadius,
      radius: targetRadius,
      color: '#e74c3c',
      hit: false
    };
  }

  function spawnTargets(n=3) {
    targets = [];
    for(let i=0; i<n; i++) {
      targets.push(createTarget());
    }
  }

  function drawTargets() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    targets.forEach(t => {
      if(!t.hit){
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.radius, 0, 2*Math.PI);
        ctx.fillStyle = t.color;
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
    // Draw score
    ctx.fillStyle = "#fff";
    ctx.font = "20px Arial";
    ctx.fillText(`Hits: ${score}`, 10, 30);
  }

  function handleClick(e) {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    targets.forEach(t => {
      if(!t.hit){
        const dx = mx - t.x;
        const dy = my - t.y;
        if(dx*dx + dy*dy <= t.radius*t.radius) {
          t.hit = true;
          score++;
          playSFX('shoot');
          if(score >= 5){
            alert("You won the shooting challenge! +80 coins");
            coinBalance += 80;
            saveGame();
            exitMiniGame();
          }
          drawTargets();
        }
      }
    });
  }

  canvas.addEventListener("click", handleClick);

  spawnTargets();
  drawTargets();

  // Cleanup on exit
  const exitBtn = document.getElementById("exit-mini-btn");
  function cleanup() {
    canvas.removeEventListener("click", handleClick);
    exitBtn.removeEventListener("click", cleanup);
  }
  exitBtn.addEventListener("click", cleanup);
}

</script>
</body>
</html>
';
  let musicUrl = 'audio/main.mp3';

  switch (place) {
    case 'Mystic Forest':
      bgUrl = 'backgrounds/forest.jpg';
      musicUrl = 'audio/forest.mp3';
      break;
    case 'Volcanic Crater':
      bgUrl = 'backgrounds/volcano.jpg';
      musicUrl = 'audio/volcano.mp3';
      break;
    case 'Ancient Castle':
      bgUrl = 'backgrounds/castle.jpg';
      musicUrl = 'audio/castle.mp3';
      break;
    case 'Shop':
      bgUrl = 'backgrounds/shop.jpg';
      musicUrl = 'audio/shop.mp3';
      break;
  }

  // Background with fade
  fadeBackground(bgUrl);

  // Play BGM
  playBGM(musicUrl);
}

function fadeBackground(newUrl) {
  // Using CSS opacity fade by toggling overlay to black, then switching background
  const body = document.body;
  body.style.transition = 'background-image 1s ease-in-out';
  body.style.backgroundImage = `url('${newUrl}')`;
}

// Play background music
function playBGM(src) {
  bgm.src = src;
  bgm.volume = 0.4;
  bgm.play();
}

// Play sound effects
function playSFX(type) {
  switch(type) {
    case 'treasure':
      sfx.src = 'audio/treasure.mp3';
      break;
    case 'buy':
      sfx.src = 'audio/buy.mp3';
      break;
    case 'error':
      sfx.src = 'audio/error.mp3';
      break;
    case 'shoot':
      sfx.src = 'audio/shoot.mp3';
      break;
    default:
      sfx.src = '';
  }
  if (sfx.src) {
    sfx.volume = 0.6;
    sfx.play();
  }
}

// Exit mini-game
function exitMiniGame() {
  document.getElementById("mini-game-container").style.display = "none";
  setBackgroundAndMusic('main');
  updateUI();
}

// Shop open/close handlers
document.getElementById("shop-btn").addEventListener("click", () => {
  document.getElementById("shop").style.display = "flex";
  setBackgroundAndMusic('Shop');
});

document.getElementById("close-shop-btn").addEventListener("click", () => {
  document.getElementById("shop").style.display = "none";
  setBackgroundAndMusic('main');
});

// Exit mini-game button
document.getElementById("exit-mini-btn").addEventListener("click", exitMiniGame);

// Explore button
document.getElementById("explore-btn").addEventListener("click", explore);

// Initial UI load
updateUI();

// Mini games implementation
function startMiniGame(name) {
  const container = document.getElementById("mini-game-content");
  container.innerHTML = '';

  if (name === "Mystic Forest") {
    startMazeGame(container);
  } else if (name === "Volcanic Crater") {
    startMemoryGame(container);
  } else if (name === "Ancient Castle") {
    startShootingGame(container);
  }
}

// --- Mini Game: Maze (Mystic Forest) ---
function startMazeGame(container) {
  container.innerHTML = `
    <h3>Maze Challenge - Find your way out!</h3>
    <canvas id="maze-canvas" width="600" height="400" style="background:#111; border-radius:10px;"></canvas>
    <p>Use arrow keys or WASD to move the green square.</p>
  `;

  const canvas = document.getElementById("maze-canvas");
  const ctx = canvas.getContext("2d");

  const maze = [
    "1111111111111111111111",
    "1S00000000100000000001",
    "1011110111010111110101",
    "1000010100010000010001",
    "1111010101110111010111",
    "1000000001000001000001",
    "1011111111011101111101",
    "10000000000100000000E1",
    "1111111111111111111111"
  ];

  const cellSize = 25;
  let player = { x: 1, y: 1 };
  let end = { x: 20, y: 7 };

  function drawMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let y=0; y<maze.length; y++){
      for(let x=0; x<maze[y].length; x++){
        if(maze[y][x] === "1") {
          ctx.fillStyle = "#444";
          ctx.fillRect(x*cellSize, y*cellSize, cellSize, cellSize);
        }
      }
    }
    // End point
    ctx.fillStyle = "#f39c12";
    ctx.fillRect(end.x*cellSize, end.y*cellSize, cellSize, cellSize);

    // Player
    ctx.fillStyle = "#2ecc71";
    ctx.fillRect(player.x*cellSize, player.y*cellSize, cellSize, cellSize);
  }

  function canMove(x, y){
    return maze[y] && maze[y][x] && maze[y][x] !== "1";
  }

  function handleKey(e){
    let nx = player.x;
    let ny = player.y;
    switch(e.key){
      case "ArrowUp": case "w": case "W": ny--; break;
      case "ArrowDown": case "s": case "S": ny++; break;
      case "ArrowLeft": case "a": case "A": nx--; break;
      case "ArrowRight": case "d": case "D": nx++; break;
      default: return;
    }
    if(canMove(nx, ny)){
      player.x = nx;
      player.y = ny;
      drawMaze();
      if(player.x === end.x && player.y === end.y){
        alert("You escaped the Mystic Forest Maze! +40 coins");
        coinBalance += 40;
        saveGame();
        playSFX('treasure');
        exitMiniGame();
      }
    }
  }

  window.addEventListener("keydown", handleKey);

  drawMaze();

  // Cleanup listener on exit
  const exitBtn = document.getElementById("exit-mini-btn");
  function cleanup() {
    window.removeEventListener("keydown", handleKey);
    exitBtn.removeEventListener("click", cleanup);
  }
  exitBtn.addEventListener("click", cleanup);
}

// --- Mini Game: Memory (Volcanic Crater) ---
function startMemoryGame(container) {
  container.innerHTML = `
    <h3>Memory Match - Find all pairs!</h3>
    <div id="memory-grid" style="display:grid; grid-template-columns: repeat(4, 100px); gap: 15px; justify-content:center;"></div>
    <p>Click cards to flip and find matching pairs.</p>
  `;

  const cards = [
    '🔥', '🔥', '🌋', '🌋',
    '⛏️', '⛏️', '💎', '💎',
    '🗝️', '🗝️', '⚡', '⚡'
  ];

  let shuffled = cards.slice().sort(() => 0.5 - Math.random());
  let flipped = [];
  let matched = new Set();

  const grid = document.getElementById("memory-grid");

  shuffled.forEach((emoji, i) => {
    const card = document.createElement("div");
    card.style.width = "100px";
    card.style.height = "100px";
    card.style.background = "#222";
    card.style.color = "#222";
    card.style.fontSize = "50px";
    card.style.display = "flex";
    card.style.alignItems = "center";
    card.style.justifyContent = "center";
    card.style.borderRadius = "12px";
    card.style.cursor = "pointer";
    card.dataset.index = i;
    card.dataset.emoji = emoji;
    card.textContent = emoji;
    card.style.userSelect = "none";

    card.addEventListener("click", () => {
      if(flipped.length === 2 || flipped.includes(i) || matched.has(i)) return;

      card.style.color = "#fff";
      flipped.push(i);

      if(flipped.length === 2) {
        const [a, b] = flipped;
        if(shuffled[a] === shuffled[b]) {
          matched.add(a);
          matched.add(b);
          playSFX('treasure');
          if(matched.size === shuffled.length) {
            alert("You matched all pairs! +100 coins");
            coinBalance += 100;
            saveGame();
            exitMiniGame();
          }
          flipped = [];
        } else {
          setTimeout(() => {
            grid.children[a].style.color = "#222";
            grid.children[b].style.color = "#222";
            flipped = [];
          }, 1000);
        }
      }
    });

    grid.appendChild(card);
  });
}

// --- Mini Game: Shooting (Ancient Castle) ---
function startShootingGame(container) {
  container.innerHTML = `
    <h3>Shooting Challenge - Hit the targets!</h3>
    <canvas id="shooting-canvas" width="600" height="400" style="background:#222; border-radius:10px;"></canvas>
    <p>Click on targets to shoot. Hit 5 targets to win!</p>
  `;

  const canvas = document.getElementById("shooting-canvas");
  const ctx = canvas.getContext("2d");

  const targetRadius = 20;
  let score = 0;
  let targets = [];

  function createTarget() {
    return {
      x: Math.random() * (canvas.width - 2*targetRadius) + targetRadius,
      y: Math.random() * (canvas.height - 2*targetRadius) + targetRadius,
      radius: targetRadius,
      color: '#e74c3c',
      hit: false
    };
  }

  function spawnTargets(n=3) {
    targets = [];
    for(let i=0; i<n; i++) {
      targets.push(createTarget());
    }
  }

  function drawTargets() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    targets.forEach(t => {
      if(!t.hit){
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.radius, 0, 2*Math.PI);
        ctx.fillStyle = t.color;
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
    // Draw score
    ctx.fillStyle = "#fff";
    ctx.font = "20px Arial";
    ctx.fillText(`Hits: ${score}`, 10, 30);
  }

  function handleClick(e) {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    targets.forEach(t => {
      if(!t.hit){
        const dx = mx - t.x;
        const dy = my - t.y;
        if(dx*dx + dy*dy <= t.radius*t.radius) {
          t.hit = true;
          score++;
          playSFX('shoot');
          if(score >= 5){
            alert("You won the shooting challenge! +80 coins");
            coinBalance += 80;
            saveGame();
            exitMiniGame();
          }
          drawTargets();
        }
      }
    });
  }

  canvas.addEventListener("click", handleClick);

  spawnTargets();
  drawTargets();

  // Cleanup on exit
  const exitBtn = document.getElementById("exit-mini-btn");
  function cleanup() {
    canvas.removeEventListener("click", handleClick);
    exitBtn.removeEventListener("click", cleanup);
  }
  exitBtn.addEventListener("click", cleanup);
}

</script>
</body>
</html>
