// Data
const profilesKey = "treasureHuntProfiles";
let profiles = JSON.parse(localStorage.getItem(profilesKey)) || {};
let currentProfile = null;

const treasures = [
  { name: "Gold Coin", image: "gold-coin.png", value: 10 },
  { name: "Silver Sword", image: "silver-sword.png", value: 20 },
  { name: "Diamond Ring", image: "diamond-ring.png", value: 50 },
  { name: "Magic Potion", image: "magic-potion.png", value: 30 },
  { name: "Ancient Artifact", image: "ancient-artifact.png", value: 100 }
];

const shopItems = [
  { name: "Mystic Map", img: "mystic-map.png", price: 30, desc: "Required for Mystic Forest" },
  { name: "Golden Key", img: "golden-key.png", price: 50, desc: "Required for Ancient Castle" },
  { name: "Fire Charm", img: "fire-charm.png", price: 70, desc: "Required for Volcanic Crater" }
];

const locations = [
  {
    name: "Mystic Forest",
    background: "forest-bg.jpg",
    requiredItem: "Mystic Map",
    riddle: "I have leaves but I'm not a book, what am I?",
    riddleAnswer: "tree",
    miniGame: "maze",
    description: "Navigate the maze to find your treasure."
  },
  {
    name: "Ancient Castle",
    background: "castle-bg.jpg",
    requiredItem: "Golden Key",
    riddle: "What has keys but can't open locks?",
    riddleAnswer: "piano",
    miniGame: "shooting",
    description: "Shoot the targets to prove your skill."
  },
  {
    name: "Volcanic Crater",
    background: "volcano-bg.jpg",
    requiredItem: "Fire Charm",
    riddle: "I can be cracked, made, told, and played. What am I?",
    riddleAnswer: "joke",
    miniGame: "memory",
    description: "Match pairs in the memory game."
  }
];

// DOM Elements
const profileSelect = document.getElementById("profile-select");
const createProfileBtn = document.getElementById("create-profile-btn");
const welcomeMsg = document.getElementById("welcome-msg");
const coinBalanceSpan = document.getElementById("coin-balance");
const locationButtonsDiv = document.getElementById("location-buttons");
const locationStorySection = document.getElementById("location-story");
const locationNameH2 = document.getElementById("location-name");
const locationDescP = document.getElementById("location-desc");
const riddleTextP = document.getElementById("riddle-text");
const startQuestBtn = document.getElementById("start-quest-btn");
const backToLocationsBtn = document.getElementById("back-to-locations-btn");
const miniGameSection = document.getElementById("mini-game");
const miniGameTitle = document.getElementById("mini-game-title");
const miniGameContainer = document.getElementById("mini-game-container");
const exitMiniGameBtn = document.getElementById("exit-mini-game-btn");
const shopSection = document.getElementById("shop-section");
const shopItemsDiv = document.getElementById("shop-items");
const openShopBtn = document.getElementById("open-shop-btn");
const closeShopBtn = document.getElementById("close-shop-btn");
const nftListDiv = document.getElementById("nft-list");
const gameArea = document.getElementById("game-area");

// Utility Functions

function saveProfiles() {
  localStorage.setItem(profilesKey, JSON.stringify(profiles));
}

function updateProfileSelect() {
  profileSelect.innerHTML = "";
  Object.keys(profiles).forEach(profileName => {
    const option = document.createElement("option");
    option.value = profileName;
    option.textContent = profileName;
    profileSelect.appendChild(option);
  });
  if (currentProfile && profiles[currentProfile]) {
    profileSelect.value = currentProfile;
  }
}

function updateWelcome() {
  if (currentProfile) {
    welcomeMsg.textContent = `Welcome, ${currentProfile}!`;
    updateCoins();
    renderCollectedTreasures();
    createLocationButtons();
  } else {
    welcomeMsg.textContent = "Please create or select a profile.";
  }
}

function updateCoins() {
  if (currentProfile) {
    coinBalanceSpan.textContent = profiles[currentProfile].coins || 0;
  }
}

function renderCollectedTreasures() {
  nftListDiv.innerHTML = "";
  if (!currentProfile) return;

  const treasures = profiles[currentProfile].collectedTreasures || [];
  if (treasures.length === 0) {
    nftListDiv.textContent = "No treasures collected yet.";
    return;
  }
  treasures.forEach(t => {
    const div = document.createElement("div");
    div.className = "nft-item";
    div.innerHTML = `<img src="${t.image}" alt="${t.name}"><p>${t.name}</p>`;
    nftListDiv.appendChild(div);
  });
}

function createLocationButtons() {
  locationButtonsDiv.innerHTML = "";
  locations.forEach(loc => {
    const btn = document.createElement("button");
    btn.textContent = loc.name;
    btn.onclick = () => openLocation(loc);
    locationButtonsDiv.appendChild(btn);
  });
}

function openLocation(location) {
  if (!currentProfile) {
    alert("Select or create a profile first.");
    return;
  }
  // Check required item
  const hasItem = profiles[currentProfile].items.includes(location.requiredItem);
  if (!hasItem) {
    alert(`You need the "${location.requiredItem}" to enter ${location.name}. Visit the shop to get it!`);
    return;
  }

  // Hide main areas
  gameArea.style.display = "none";
  shopSection.classList.add("hidden");

  // Show location story
  locationStorySection.classList.remove("hidden");
  locationNameH2.textContent = location.name;
  locationDescP.textContent = location.description;
  riddleTextP.textContent = `Riddle: ${location.riddle}`;
  startQuestBtn.onclick = () => {
    const answer = prompt("Solve the riddle to start the quest:");
    if (answer && answer.toLowerCase().trim() === location.riddleAnswer.toLowerCase()) {
      startMiniGame(location);
    } else {
      alert("Wrong answer! Try again.");
    }
  };
  backToLocationsBtn.onclick = () => {
    locationStorySection.classList.add("hidden");
    gameArea.style.display = "block";
    setBackground('background-home.jpg');
  };

  setBackground(location.background);
}

function startMiniGame(location) {
  locationStorySection.classList.add("hidden");
  miniGameSection.classList.remove("hidden");
  miniGameTitle.textContent = `${location.miniGame.toUpperCase()} Mini-Game: ${location.name}`;
  miniGameContainer.innerHTML = "";

  if (location.miniGame === "maze") {
    startMazeMiniGame();
  } else if (location.miniGame === "memory") {
    startMemoryGame();
  } else if (location.miniGame === "shooting") {
    startShootingGame();
  }

  exitMiniGameBtn.onclick = () => {
    miniGameSection.classList.add("hidden");
    gameArea.style.display = "block";
    setBackground('background-home.jpg');
  };
}

function setBackground(image) {
  document.body.style.background = `url('${image}') no-repeat center center fixed`;
  document.body.style.backgroundSize = "cover";
}

// Shop

openShopBtn.onclick = () => {
  if (!currentProfile) {
    alert("Please select or create a profile first.");
    return;
  }
  gameArea.style.display = "none";
  shopSection.classList.remove("hidden");
  renderShopItems();
};

closeShopBtn.onclick = () => {
  shopSection.classList.add("hidden");
  gameArea.style.display = "block";
  setBackground('background-home.jpg');
};

function renderShopItems() {
  shopItemsDiv.innerHTML = "";
  shopItems.forEach(item => {
    const div = document.createElement("div");
    div.className = "shop-item";
    div.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <h3>${item.name}</h3>
      <p>${item.desc}</p>
      <p>Price: ${item.price} coins</p>
      <button>Buy</button>
    `;
    const buyBtn = div.querySelector("button");
    buyBtn.onclick = () => buyItem(item);
    shopItemsDiv.appendChild(div);
  });
}

function buyItem(item) {
  if (profiles[currentProfile].coins >= item.price) {
    if (profiles[currentProfile].items.includes(item.name)) {
      alert("You already own this item.");
      return;
    }
    profiles[currentProfile].coins -= item.price;
    profiles[currentProfile].items.push(item.name);
    alert(`You bought: ${item.name}`);
    saveProfiles();
    updateCoins();
    renderShopItems();
  } else {
    alert("Not enough coins.");
  }
}

// Profile Management

createProfileBtn.onclick = () => {
  const name = prompt("Enter new profile name:");
  if (name && !profiles[name]) {
    profiles[name] = {
      coins: 50,
      items: [],
      collectedTreasures: []
    };
    currentProfile = name;
    saveProfiles();
    updateProfileSelect();
    updateWelcome();
  } else {
    alert("Invalid or existing profile name.");
  }
};

profileSelect.onchange = () => {
  currentProfile = profileSelect.value;
  updateWelcome();
};

// Mini-games implementation (simplified for brevity)

// Maze mini-game (Forest)
function startMazeMiniGame() {
  miniGameContainer.innerHTML = "";
  const mazeDesc = document.createElement("p");
  mazeDesc.textContent = "Use arrow keys or swipe to navigate the maze and find the treasure!";
  miniGameContainer.appendChild(mazeDesc);

  // Simple maze grid and player
  const mazeGrid = [
    [1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1],
    [1,0,1,0,1,0,1],
    [1,0,1,0,0,0,1],
    [1,0,0,0,1,0,1],
    [1,1,1,1,1,1,1],
  ];
  const rows = mazeGrid.length;
  const cols = mazeGrid[0].length;

  const gridDiv = document.createElement("div");
  gridDiv.style.display = "inline-grid";
  gridDiv.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
  gridDiv.style.gridTemplateRows = `repeat(${rows}, 30px)`;
  gridDiv.style.gap = "2px";
  miniGameContainer.appendChild(gridDiv);

  // Player start position
  let playerPos = { row: 1, col: 1 };
  // Treasure position
  const treasurePos = { row: 5, col: 5 };

  function renderMaze() {
    gridDiv.innerHTML = "";
    for(let r=0; r<rows; r++) {
      for(let c=0; c<cols; c++) {
        const cell = document.createElement("div");
        cell.style.width = "30px";
        cell.style.height = "30px";
        cell.style.border = "1px solid #333";
        cell.style.boxSizing = "border-box";
        if (mazeGrid[r][c] === 1) {
          cell.style.backgroundColor = "#654321"; // wall brown
        } else {
          cell.style.backgroundColor = "#a3d977"; // path green
        }
        if (r === playerPos.row && c === playerPos.col) {
          cell.style.backgroundColor = "#2196F3"; // player blue
        }
        if (r === treasurePos.row && c === treasurePos.col) {
          cell.style.backgroundColor = "#FFD700"; // treasure gold
        }
        gridDiv.appendChild(cell);
      }
    }
  }

  function movePlayer(dr, dc) {
    const newRow = playerPos.row + dr;
    const newCol = playerPos.col + dc;
    if (mazeGrid[newRow][newCol] === 0) {
      playerPos = { row: newRow, col: newCol };
      renderMaze();
      if (playerPos.row === treasurePos.row && playerPos.col === treasurePos.col) {
        alert("You found the treasure in the forest!");
        rewardPlayer(40, { name: "Forest Treasure", image: "forest-treasure.png" });
        miniGameSection.classList.add("hidden");
        gameArea.style.display = "block";
        setBackground('background-home.jpg');
      }
    }
  }

  // Keyboard controls
  function handleKey(e) {
    switch(e.key) {
      case "ArrowUp": movePlayer(-1,0); break;
      case "ArrowDown": movePlayer(1,0); break;
      case "ArrowLeft": movePlayer(0,-1); break;
      case "ArrowRight": movePlayer(0,1); break;
    }
  }

  window.addEventListener("keydown", handleKey);

  // Touch controls (swipe detection)
  let touchStartX = 0;
  let touchStartY = 0;
  miniGameContainer.addEventListener("touchstart", e => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  });

  miniGameContainer.addEventListener("touchend", e => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    const dy = e.changedTouches[0].screenY - touchStartY;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 30) movePlayer(0,1);
      else if (dx < -30) movePlayer(0,-1);
    } else {
      if (dy > 30) movePlayer(1,0);
      else if (dy < -30) movePlayer(-1,0);
    }
  });

  renderMaze();

  // Cleanup on exit
  exitMiniGameBtn.onclick = () => {
    miniGameSection.classList.add("hidden");
    gameArea.style.display = "block";
    setBackground('background-home.jpg');
    window.removeEventListener("keydown", handleKey);
  };
}

// Memory mini-game (Volcano)
function startMemoryGame() {
  miniGameContainer.innerHTML = "";
  const instructions = document.createElement("p");
  instructions.textContent = "Match the pairs to win!";
  miniGameContainer.appendChild(instructions);

  // Simple memory game data
  const symbols = ["🍎","🍌","🍒","🍇","🍉","🍍"];
  const cards = [...symbols, ...symbols];
  shuffleArray(cards);

  const cardElements = [];
  let firstCard = null;
  let matchedPairs = 0;

  const gridDiv = document.createElement("div");
  gridDiv.style.display = "grid";
  gridDiv.style.gridTemplateColumns = "repeat(4, 60px)";
  gridDiv.style.gridGap = "10px";
  miniGameContainer.appendChild(gridDiv);

  cards.forEach((symbol, index) => {
    const card = document.createElement("button");
    card.style.width = "60px";
    card.style.height = "60px";
    card.style.fontSize = "30px";
    card.textContent = "";
    card.dataset.symbol = symbol;
    card.onclick = () => {
      if (card.textContent || cardElements.includes(card)) return;
      card.textContent = symbol;
      if (!firstCard) {
        firstCard = card;
      } else {
        if (firstCard.dataset.symbol === card.dataset.symbol) {
          matchedPairs++;
          firstCard.disabled = true;
          card.disabled = true;
          if (matchedPairs === symbols.length) {
            alert("You matched all pairs!");
            rewardPlayer(50, { name: "Volcano Treasure", image: "volcano-treasure.png" });
            miniGameSection.classList.add("hidden");
            gameArea.style.display = "block";
            setBackground('background-home.jpg');
          }
          firstCard = null;
        } else {
          setTimeout(() => {
            firstCard.textContent = "";
            card.textContent = "";
            firstCard = null;
          }, 800);
        }
      }
    };
    gridDiv.appendChild(card);
    cardElements.push(card);
  });
}

// Shooting mini-game (Castle)
function startShootingGame() {
  miniGameContainer.innerHTML = "";

  const instructions = document.createElement("p");
  instructions.textContent = "Click or tap the targets before time runs out!";
  miniGameContainer.appendChild(instructions);

  const gameAreaDiv = document.createElement("div");
  gameAreaDiv.style.position = "relative";
  gameAreaDiv.style.width = "300px";
  gameAreaDiv.style.height = "200px";
  gameAreaDiv.style.margin = "20px auto";
  gameAreaDiv.style.border = "2px solid #fff";
  miniGameContainer.appendChild(gameAreaDiv);

  let score = 0;
  let timeLeft = 30; // seconds

  const scoreDisplay = document.createElement("p");
  scoreDisplay.textContent = `Score: ${score}`;
  miniGameContainer.appendChild(scoreDisplay);

  const timerDisplay = document.createElement("p");
  timerDisplay.textContent = `Time left: ${timeLeft}`;
  miniGameContainer.appendChild(timerDisplay);

  const target = document.createElement("div");
  target.style.width = "40px";
  target.style.height = "40px";
  target.style.backgroundColor = "red";
  target.style.borderRadius = "50%";
  target.style.position = "absolute";
  target.style.cursor = "pointer";
  gameAreaDiv.appendChild(target);

  function moveTarget() {
    const maxX = gameAreaDiv.clientWidth - 40;
    const maxY = gameAreaDiv.clientHeight - 40;
    const x = Math.floor(Math.random() * maxX);
    const y = Math.floor(Math.random() * maxY);
    target.style.left = x + "px";
    target.style.top = y + "px";
  }

  target.onclick = () => {
    score++;
    scoreDisplay.textContent = `Score: ${score}`;
    moveTarget();
  };

  moveTarget();

  const timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Time left: ${timeLeft}`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      alert(`Time's up! Your score: ${score}`);
      if (score >= 5) {
        rewardPlayer(60, { name: "Castle Treasure", image: "castle-treasure.png" });
      } else {
        alert("Score at least 5 to earn a treasure.");
      }
      miniGameSection.classList.add("hidden");
      gameArea.style.display = "block";
      setBackground('background-home.jpg');
    }
  }, 1000);

  exitMiniGameBtn.onclick = () => {
    clearInterval(timer);
    miniGameSection.classList.add("hidden");
    gameArea.style.display = "block";
    setBackground('background-home.jpg');
  };
}

// Reward player helper
function rewardPlayer(coinsEarned, treasure) {
  profiles[currentProfile].coins += coinsEarned;
  if (!profiles[currentProfile].collectedTreasures) profiles[currentProfile].collectedTreasures = [];
  profiles[currentProfile].collectedTreasures.push(treasure);
  alert(`You earned ${coinsEarned} coins and found a treasure: ${treasure.name}`);
  saveProfiles();
  updateCoins();
  updateNFTDisplay();
}

// Utility shuffle array
function shuffleArray(array) {
  for(let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Initialize on load
loadProfiles();
updateProfileSelect();
updateWelcome();
updateCoins();
createLocationButtons();
updateNFTDisplay();
setBackground('background-home.jpg');
</script>

</body>
</html>
