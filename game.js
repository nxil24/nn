// Game Data
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
  {
    name: "Mystic Forest",
    image: "images/forest-bg.jpg",
    requiredItem: "Mystic Map",
    reward: 40,
    story: "You enter the Mystic Forest, where the trees whisper ancient secrets. Solve this riddle to continue:",
    riddle: {
      question: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
      answer: "echo"
    },
    miniGame: "shooting"
  },
  {
    name: "Ancient Castle",
    image: "images/castle-bg.jpg",
    requiredItem: "Golden Key",
    reward: 80,
    story: "The Ancient Castle stands tall and proud. A guardian awaits your wit. Solve this riddle:",
    riddle: {
      question: "What has keys but can't open locks?",
      answer: "piano"
    },
    miniGame: "shooting"
  },
  {
    name: "Volcanic Crater",
    image: "images/volcano-bg.jpg",
    requiredItem: "Fire Charm",
    reward: 100,
    story: "The Volcanic Crater is hot and dangerous. Solve this riddle to calm the fire:",
    riddle: {
      question: "What comes once in a minute, twice in a moment, but never in a thousand years?",
      answer: "m"
    },
    miniGame: "shooting"
  }
];

// State & Player Data
let profiles = JSON.parse(localStorage.getItem("profiles")) || {};
let currentProfileName = null;
let currentProfile = null;

let isMuted = false;
const sounds = {
  coin: new Audio('sounds/coin.wav'),
  click: new Audio('sounds/click.wav'),
  treasure: new Audio('sounds/treasure.wav'),
  shoot: new Audio('sounds/shoot.wav'),
  bgm: new Audio('sounds/bgm.mp3')
};
sounds.bgm.loop = true;

// DOM elements
const profileInput = document.getElementById("player-name");
const createProfileBtn = document.getElementById("create-profile-btn");
const profileSelect = document.getElementById("profile-select");
const deleteProfileBtn = document.getElementById("delete-profile-btn");
const welcomeMsg = document.getElementById("welcome-msg");

const gameArea = document.getElementById("game-area");
const coinBalanceSpan = document.getElementById("coin-balance");
const exploreBtn = document.getElementById("explore-btn");
const statusText = document.getElementById("status");
const treasureInfo = document.getElementById("treasure-info");
const treasureAnimation = document.getElementById("treasure-animation");
const shopBtn = document.getElementById("shop-btn");

const shopSection = document.getElementById("shop");
const shopItemsContainer = document.getElementById("shop-items");
const closeShopBtn = document.getElementById("close-shop-btn");

const locationsSection = document.getElementById("locations");
const locationButtonsDiv = document.getElementById("location-buttons");

const locationStorySection = document.getElementById("location-story");
const locationNameHeading = document.getElementById("location-name");
const locationStoryText = document.getElementById("location-story-text");
const riddleSection = document.getElementById("riddle-section");
const riddleQuestion = document.getElementById("riddle-question");
const riddleAnswerInput = document.getElementById("riddle-answer");
const submitRiddleBtn = document.getElementById("submit-riddle-btn");
const riddleFeedback = document.getElementById("riddle-feedback");

const miniGameSection = document.getElementById("mini-game");
const miniGameTitle = document.getElementById("mini-game-title");
const gameCanvas = document.getElementById("game-canvas");
const gameInstructions = document.getElementById("game-instructions");
const endGameBtn = document.getElementById("end-game-btn");
const miniGameScoreDisplay = document.getElementById("mini-game-score");

const nftCollectionSection = document.getElementById("nft-collection");
const nftList = document.getElementById("nft-list");

const muteBtn = document.getElementById("mute-btn");

let currentLocation = null;
let miniGameScore = 0;
let shootingGameInterval = null;
let targets = [];
let canvasCtx = gameCanvas.getContext("2d");

function playSound(name) {
  if (isMuted) return;
  if (sounds[name]) {
    sounds[name].currentTime = 0;
    sounds[name].play();
  }
}

// Profile management
function updateProfileList() {
  profileSelect.innerHTML = '';
  Object.keys(profiles).forEach(name => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    profileSelect.appendChild(option);
  });
  if (Object.keys(profiles).length > 0) {
    profileSelect.style.display = 'inline-block';
    deleteProfileBtn.style.display = 'inline-block';
    createProfileBtn.style.display = 'none';
    profileInput.style.display = 'none';
    loadProfile(profileSelect.value);
  } else {
    profileSelect.style.display = 'none';
    deleteProfileBtn.style.display = 'none';
    createProfileBtn.style.display = 'inline-block';
    profileInput.style.display = 'inline-block';
  }
}

function createProfile() {
  const name = profileInput.value.trim();
  if (!name) {
    alert("Please enter a valid name");
    return;
  }
  if (profiles[name]) {
    alert("Profile already exists. Choose another name or select from dropdown.");
    return;
  }
  profiles[name] = {
    coins: 100,
    inventory: [],
    collectedTreasures: [],
    currentLocationIndex: 0,
    level: 1
  };
  saveProfiles();
  updateProfileList();
  profileInput.value = '';
  loadProfile(name);
}

function loadProfile(name) {
  currentProfileName = name;
  currentProfile = profiles[name];
  welcomeMsg.textContent = `Welcome, ${currentProfileName}! Level: ${currentProfile.level}`;
  coinBalanceSpan.textContent = currentProfile.coins;
  updateInventory();
  showGameArea();
  playSound('bgm');
}

function deleteProfile() {
  if (!currentProfileName) return;
  if (confirm(`Delete profile ${currentProfileName}? This action cannot be undone.`)) {
    delete profiles[currentProfileName];
    saveProfiles();
    currentProfileName = null;
    currentProfile = null;
    welcomeMsg.textContent = '';
    coinBalanceSpan.textContent = '0';
    hideAllSections();
    updateProfileList();
    stopBGM();
  }
}

function saveProfiles() {
  localStorage.setItem("profiles", JSON.stringify(profiles));
}

function showGameArea() {
  hideAllSections();
  gameArea.classList.remove("hidden");
  locationsSection.classList.remove("hidden");
}

function hideAllSections() {
  gameArea.classList.add("hidden");
  shopSection.classList.add("hidden");
  locationsSection.classList.add("hidden");
  locationStorySection.classList.add("hidden");
  miniGameSection.classList.add("hidden");
  nftCollectionSection.classList.add("hidden");
}

createProfileBtn.addEventListener("click", createProfile);
profileSelect.addEventListener("change", () => {
  loadProfile(profileSelect.value);
});
deleteProfileBtn.addEventListener("click", deleteProfile);

// Shop display
function openShop() {
  hideAllSections();
  shopSection.classList.remove("hidden");
  shopItemsContainer.innerHTML = "";
  itemsForSale.forEach(item => {
    const div = document.createElement("div");
    div.className = "shop-item";
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}" />
      <h3>${item.name}</h3>
      <p>Cost: ${item.cost} coins</p>
      <button data-item="${item.name}">Buy</button>
    `;
    shopItemsContainer.appendChild(div);
    div.querySelector("button").addEventListener("click", () => buyItem(item));
  });
}

function buyItem(item) {
  if (currentProfile.coins < item.cost) {
    alert("Not enough coins!");
    return;
  }
  if (currentProfile.inventory.includes(item.name)) {
    alert("You already own this item.");
    return;
  }
  currentProfile.coins -= item.cost;
  currentProfile.inventory.push(item.name);
  saveProfiles();
  coinBalanceSpan.textContent = currentProfile.coins;
  playSound('coin');
  alert(`You bought: ${item.name}`);
}

closeShopBtn.addEventListener("click", () => {
  showGameArea();
});

// Location buttons
function showLocations() {
  locationButtonsDiv.innerHTML = "";
  locations.forEach((loc, i) => {
    const container = document.createElement("div");
    container.className = "location-btn-container";
    container.innerHTML = `
      <img src="${loc.image}" alt="${loc.name}" />
      <h3>${loc.name}</h3>
      <button data-index="${i}">Travel</button>
    `;
    locationButtonsDiv.appendChild(container);
    container.querySelector("button").addEventListener("click", () => travelToLocation(i));
  });
}

showLocations();

function travelToLocation(index) {
  const loc = locations[index];
  if (!currentProfile.inventory.includes(loc.requiredItem)) {
    alert(`You need the ${loc.requiredItem} to enter ${loc.name}`);
    return;
  }
  currentLocation = index;
  hideAllSections();
  locationStorySection.classList.remove("hidden");
  locationNameHeading.textContent = loc.name;
  locationStoryText.textContent = loc.story;
  riddleQuestion.textContent = loc.riddle.question;
  riddleAnswerInput.value = "";
  riddleFeedback.textContent = "";
  riddleSection.style.display = "block";

  // change background
  document.body.style.backgroundImage = `url('${loc.image}')`;
}

submitRiddleBtn.addEventListener("click", () => {
  const answer = riddleAnswerInput.value.trim().toLowerCase();
  const correct = locations[currentLocation].riddle.answer.toLowerCase();
  if (answer === correct) {
    riddleFeedback.textContent = "Correct! Starting mini-game...";
    playSound('treasure');
    currentProfile.coins += locations[currentLocation].reward;
    coinBalanceSpan.textContent = currentProfile.coins;
    saveProfiles();
    setTimeout(() => startMiniGame(currentLocation), 1500);
  } else {
    riddleFeedback.textContent = "Incorrect. Try again!";
  }
});

function startMiniGame(locationIndex) {
  hideAllSections();
  miniGameSection.classList.remove("hidden");
  miniGameScoreDisplay.textContent = "Score: 0";
  miniGameScore = 0;
  miniGameTitle.textContent = `Mini-Game: ${locations[locationIndex].name}`;
  gameInstructions.textContent = "Tap or click targets to shoot them! Use arrows and spacebar on desktop.";
  initShootingGame();
}

// Shooting mini-game implementation
const targetRadius = 20;
const targetSpawnInterval = 1500;
const gameDuration = 30000; // 30 seconds
let gameStartTime = 0;

function initShootingGame() {
  targets = [];
  gameStartTime = Date.now();

  // Clear canvas
  canvasCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

  if (shootingGameInterval) clearInterval(shootingGameInterval);
  shootingGameInterval = setInterval(spawnTarget, targetSpawnInterval);

  gameCanvas.addEventListener("click", shootAtPoint);
  gameCanvas.addEventListener("touchstart", e => {
    e.preventDefault();
    const rect = gameCanvas.getBoundingClientRect();
    const touch = e.touches[0];
    shootAtPoint({ clientX: touch.clientX, clientY: touch.clientY, preventDefault: () => {} });
  }, { passive: false });

  requestAnimationFrame(gameLoop);
}

function spawnTarget() {
  const x = Math.random() * (gameCanvas.width - 2 * targetRadius) + targetRadius;
  const y = Math.random() * (gameCanvas.height - 2 * targetRadius) + targetRadius;
  targets.push({ x, y, hit: false });
}

function shootAtPoint(event) {
  const rect = gameCanvas.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const clickY = event.clientY - rect.top;

  for (const target of targets) {
    if (!target.hit) {
      const dist = Math.sqrt((target.x - clickX) ** 2 + (target.y - clickY) ** 2);
      if (dist <= targetRadius) {
        target.hit = true;
        miniGameScore++;
        miniGameScoreDisplay.textContent = `Score: ${miniGameScore}`;
        playSound('shoot');
        break;
      }
    }
  }
}

function gameLoop() {
  const elapsed = Date.now() - gameStartTime;
  if (elapsed > gameDuration) {
    endMiniGame();
    return;
  }

  canvasCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

  // Draw targets
  targets = targets.filter(t => !t.hit);
  targets.forEach(target => {
    canvasCtx.beginPath();
    canvasCtx.arc(target.x, target.y, targetRadius, 0, Math.PI * 2);
    canvasCtx.fillStyle = "red";
    canvasCtx.fill();
    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = "black";
    canvasCtx.stroke();
  });

  requestAnimationFrame(gameLoop);
}

endGameBtn.addEventListener("click", () => {
  endMiniGame();
});

function endMiniGame() {
  if (shootingGameInterval) clearInterval(shootingGameInterval);
  gameCanvas.removeEventListener("click", shootAtPoint);
  gameCanvas.removeEventListener("touchstart", shootAtPoint);
  alert(`Game over! Your score: ${miniGameScore}`);
  currentProfile.level++;
  currentProfile.coins += miniGameScore * 5;
  coinBalanceSpan.textContent = currentProfile.coins;
  welcomeMsg.textContent = `Welcome, ${currentProfileName}! Level: ${currentProfile.level}`;
  saveProfiles();
  showGameArea();
}

// Sound management
const sounds = {
  bgm: new Audio('https://actions.google.com/sounds/v1/ambiences/underwater_bubbles.ogg'),
  coin: new Audio('https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg'),
  shoot: new Audio('https://actions.google.com/sounds/v1/weapons/laser_gun.ogg'),
  treasure: new Audio('https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg'),
};

sounds.bgm.loop = true;

let isMuted = false;

muteBtn.addEventListener("click", () => {
  isMuted = !isMuted;
  muteBtn.textContent = isMuted ? "Unmute" : "Mute";
  if (isMuted) {
    stopBGM();
  } else {
    playSound('bgm');
  }
});

function stopBGM() {
  sounds.bgm.pause();
  sounds.bgm.currentTime = 0;
}

// Inventory and treasures UI update
function updateInventory() {
  // Optional: implement inventory UI update here
}

// Initial setup
const profiles = JSON.parse(localStorage.getItem("profiles") || "{}");
let currentProfileName = null;
let currentProfile = null;

updateProfileList();


// Add your existing game setup code below, e.g., showing shop, treasure info, etc.
// You can add new storyline, riddles, and levels by modifying the `locations` array.

const locations = [
  {
    name: "Enchanted Forest",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    story: "You enter the Enchanted Forest, where ancient trees whisper secrets. Solve the riddle to proceed.",
    riddle: {
      question: "I speak without a mouth and hear without ears. I have nobody, but I come alive with wind. What am I?",
      answer: "echo"
    },
    reward: 50,
    requiredItem: "Mystic Map"
  },
  {
    name: "Volcanic Crater",
    image: "https://images.unsplash.com/photo-1501769214405-8bb11d8e4a2c?auto=format&fit=crop&w=800&q=80",
    story: "The ground trembles beneath your feet as you approach the fiery crater. Only the brave with the Fire Charm may enter.",
    riddle: {
      question: "What burns brighter when shared but cannot be touched or held?",
      answer: "fire"
    },
    reward: 70,
    requiredItem: "Fire Charm"
  },
  {
    name: "Ancient Castle",
    image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=80",
    story: "The Ancient Castle stands tall, guarding countless secrets. Unlock its mystery with your wisdom.",
    riddle: {
      question: "I have cities, but no houses; forests, but no trees; and water, but no fish. What am I?",
      answer: "map"
    },
    reward: 100,
    requiredItem: "Golden Key"
  }
];

// Items for sale in shop
const itemsForSale = [
  {
    name: "Mystic Map",
    cost: 100,
    image: "https://cdn-icons-png.flaticon.com/512/684/684908.png"
  },
  {
    name: "Fire Charm",
    cost: 150,
    image: "https://cdn-icons-png.flaticon.com/512/2920/2920276.png"
  },
  {
    name: "Golden Key",
    cost: 200,
    image: "https://cdn-icons-png.flaticon.com/512/109/109618.png"
  }
];

showLocations();
shopBtn.addEventListener("click", openShop);

// On page load
if (Object.keys(profiles).length > 0) {
  loadProfile(Object.keys(profiles)[0]);
}

  
</script>

</body>
</html>
