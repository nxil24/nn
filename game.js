const treasures = [
  { name: "Gold Coin", image: "gold-coin.png", value: 10 },
  { name: "Silver Sword", image: "silver-sword.png", value: 20 },
  { name: "Diamond Ring", image: "diamond-ring.png", value: 50 }
];

const itemsForSale = [
  { name: "Mystic Map", image: "mystic-map.png", cost: 30 },
  { name: "Golden Key", image: "golden-key.png", cost: 50 },
  { name: "Fire Charm", image: "fire-charm (1).png", cost: 70 }
];

const locations = [
  {
    name: "Mystic Forest",
    background: "forest (1).png",
    requiredItem: "Mystic Map",
    story: "The forest whispers ancient secrets. Find the exit through the maze.",
    game: "maze"
  },
  {
    name: "Volcanic Crater",
    background: "volcano.png",
    requiredItem: "Fire Charm",
    story: "A memory lost in flames. Match the lava tiles before it's too late!",
    game: "memory"
  },
  {
    name: "Ancient Castle",
    background: "castle (1).png",
    requiredItem: "Golden Key",
    story: "Guarded by riddles and magic, defend yourself and shoot enemies to advance.",
    game: "shooter"
  }
];

let player = {
  name: "Explorer",
  coins: 0,
  level: 1,
  ownedItems: [],
  treasures: []
};

// === DOM SHORTCUTS ===
const coinBalance = document.getElementById("coin-balance");
const playerLevel = document.getElementById("player-level");
const playerInfo = document.getElementById("player-info");

function updateUI() {
  coinBalance.innerText = player.coins;
  playerLevel.innerText = player.level;
  playerInfo.innerText = `${player.name} | Level ${player.level}`;
  updateShop();
  updateTreasures();
  updateLocationButtons();
}

function updateTreasures() {
  const nftList = document.getElementById("nft-list");
  nftList.innerHTML = "";
  player.treasures.forEach(t => {
    const item = document.createElement("div");
    item.className = "nft-item";
    item.innerHTML = `<img src="${t.image}"><p>${t.name}</p>`;
    nftList.appendChild(item);
  });
}

function updateShop() {
  const shelf = document.getElementById("shop-shelf");
  shelf.innerHTML = "";
  itemsForSale.forEach(item => {
    const div = document.createElement("div");
    div.className = "shop-item";
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <p>${item.name}</p>
      <p>${item.cost} Coins</p>
      <button onclick="buyItem('${item.name}')">Buy</button>
    `;
    shelf.appendChild(div);
  });
}

function updateLocationButtons() {
  const locBtns = document.getElementById("location-buttons");
  locBtns.innerHTML = "";
  locations.forEach(loc => {
    const btn = document.createElement("button");
    btn.innerText = loc.name;
    btn.onclick = () => enterLocation(loc.name);
    locBtns.appendChild(btn);
  });
}

function explore() {
  const sound = document.getElementById("sound-explore");
  sound.play();
  const treasure = treasures[Math.floor(Math.random() * treasures.length)];
  player.coins += treasure.value;
  player.treasures.push(treasure);
  updateUI();
}

function buyItem(name) {
  const item = itemsForSale.find(i => i.name === name);
  if (player.coins >= item.cost && !player.ownedItems.includes(name)) {
    player.coins -= item.cost;
    player.ownedItems.push(name);
    document.getElementById("sound-coin").play();
    updateUI();
  }
}

function enterLocation(name) {
  const loc = locations.find(l => l.name === name);
  if (!player.ownedItems.includes(loc.requiredItem)) {
    alert(`You need ${loc.requiredItem} to enter!`);
    return;
  }

  document.getElementById("location-area").classList.remove("hidden");
  document.getElementById("location-title").innerText = loc.name;
  document.getElementById("location-background").style.backgroundImage = `url('${loc.background}')`;
  document.getElementById("location-story").innerText = loc.story;

  const gameContainer = document.getElementById("location-mini-game");
  gameContainer.innerHTML = "";
  if (loc.game === "maze") loadMaze(gameContainer);
  else if (loc.game === "memory") loadMemoryGame(gameContainer);
  else if (loc.game === "shooter") loadShooterGame(gameContainer);
}

function loadMaze(container) {
  container.innerHTML = `<p>[MAZE GAME Placeholder]</p>`;
  // You would replace this with your canvas or SVG maze game logic
}

function loadMemoryGame(container) {
  container.innerHTML = `<p>[MEMORY MATCH GAME Placeholder]</p>`;
  // Replace with real grid logic and animations
}

function loadShooterGame(container) {
  container.innerHTML = `<p>[SHOOTING GAME Placeholder]</p>`;
  // Replace with interactive shooter game canvas + keys/touch
}

document.getElementById("explore-btn").onclick = explore;
document.getElementById("shop-btn").onclick = () => {
  document.getElementById("shop").classList.remove("hidden");
  document.getElementById("sound-shop").play();
};
document.getElementById("close-shop-btn").onclick = () => {
  document.getElementById("shop").classList.add("hidden");
};
document.getElementById("exit-location-btn").onclick = () => {
  document.getElementById("location-area").classList.add("hidden");
};

updateUI();
