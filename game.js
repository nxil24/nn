const treasures = [
  { name: "Gold Coin", image: "gold-coin.png", value: 10 },
  { name: "Silver Sword", image: "silver-sword.png", value: 20 },
  { name: "Diamond Ring", image: "diamond-ring.png", value: 50 },
  { name: "Magic Potion", image: "magic-potion.png", value: 30 },
  { name: "Ancient Artifact", image: "ancient-artifact.png", value: 100 }
];

const itemsForSale = [
  { name: "Mystic Map", image: "mystic-map.png", cost: 30 },
  { name: "Golden Key", image: "golden-key.png", cost: 50 },
  { name: "Fire Charm", image: "fire-charm.png", cost: 70 }
];

const locations = [
  { name: "Mystic Forest", bg: "forest.png", item: "Mystic Map", game: "maze" },
  { name: "Ancient Castle", bg: "castle.png", item: "Golden Key", game: "shooter" },
  { name: "Volcanic Crater", bg: "volcano.png", item: "Fire Charm", game: "memory" }
];

let coins = parseInt(localStorage.getItem("coinBalance")) || 0;
let collected = JSON.parse(localStorage.getItem("collectedTreasures")) || [];
let ownedItems = JSON.parse(localStorage.getItem("ownedItems")) || [];

function updateUI() {
  document.getElementById("coin-balance").innerText = coins;

  const nftList = document.getElementById("nft-list");
  nftList.innerHTML = '';
  collected.forEach(t => {
    const div = document.createElement("div");
    div.classList.add("nft-item");
    div.innerHTML = `<img src="${t.image}" alt="${t.name}"><p>${t.name}</p>`;
    nftList.appendChild(div);
  });

  const shopDiv = document.getElementById("shop-items");
  shopDiv.innerHTML = '';
  itemsForSale.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("shop-item");
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}"><p>${item.name}</p>
      <p>${item.cost} coins</p>
      <button onclick="buyItem('${item.name}')">Buy</button>`;
    shopDiv.appendChild(div);
  });

  const locBtns = document.getElementById("location-buttons");
  locBtns.innerHTML = '';
  locations.forEach(loc => {
    const btn = document.createElement("button");
    btn.innerText = loc.name;
    btn.onclick = () => enterLocation(loc);
    locBtns.appendChild(btn);
  });
}

function explore() {
  const treasure = treasures[Math.floor(Math.random() * treasures.length)];
  coins += treasure.value;
  collected.push(treasure);
  document.getElementById("status").innerText = `You found: ${treasure.name}`;
  showTreasureAnimation(treasure.image);
  saveGame();
  updateUI();
}

function showTreasureAnimation(img) {
  const anim = document.getElementById("treasure-animation");
  anim.innerHTML = `<img src="${img}" alt="treasure" />`;
  setTimeout(() => anim.innerHTML = '', 1000);
}

function buyItem(itemName) {
  const item = itemsForSale.find(i => i.name === itemName);
  if (coins >= item.cost) {
    coins -= item.cost;
    ownedItems.push(item.name);
    alert(`Purchased: ${item.name}`);
    saveGame();
    updateUI();
  } else {
    alert("Not enough coins!");
  }
}

function enterLocation(loc) {
  if (!ownedItems.includes(loc.item)) {
    alert(`You need the ${loc.item} to enter ${loc.name}.`);
    return;
  }
  document.body.style.backgroundImage = `url('${loc.bg}')`;
  document.getElementById("main-area").classList.add("hidden");
  document.getElementById("location-play-area").classList.remove("hidden");
  loadMiniGame(loc.game);
}

function loadMiniGame(gameType) {
  const area = document.getElementById("location-content");
  area.innerHTML = '';
  switch (gameType) {
    case 'maze':
      area.innerHTML = `<iframe src="games/maze.html" width="100%" height="400px"></iframe>`;
      break;
    case 'shooter':
      area.innerHTML = `<iframe src="games/shooter.html" width="100%" height="400px"></iframe>`;
      break;
    case 'memory':
      area.innerHTML = `<iframe src="games/memory.html" width="100%" height="400px"></iframe>`;
      break;
  }
}

function saveGame() {
  localStorage.setItem("coinBalance", coins);
  localStorage.setItem("collectedTreasures", JSON.stringify(collected));
  localStorage.setItem("ownedItems", JSON.stringify(ownedItems));
}

document.getElementById("explore-btn").onclick = explore;
document.getElementById("shop-btn").onclick = () => document.getElementById("shop-panel").classList.remove("hidden");
document.getElementById("close-shop-btn").onclick = () => document.getElementById("shop-panel").classList.add("hidden");
document.getElementById("exit-location").onclick = () => {
  document.body.style.backgroundImage = "url('images/bg-home.jpg')";
  document.getElementById("main-area").classList.remove("hidden");
  document.getElementById("location-play-area").classList.add("hidden");
};

updateUI();
