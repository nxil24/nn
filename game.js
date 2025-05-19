// Game State
let coins = 0;
const collectedNFTs = [];
const shopItems = [
  { id: 1, name: 'Mystic Map', price: 20, img: 'mystic-map.png', unlocks: 'forest' },
  { id: 2, name: 'Golden Key', price: 30, img: 'golden-key.png', unlocks: 'castle' },
  { id: 3, name: 'Fire Charm', price: 25, img: 'fire-charm.png', unlocks: 'volcano' }
];

// Current Location game state
let currentLocation = null;

// DOM refs
const coinBalanceEl = document.getElementById('coin-balance');
const statusEl = document.getElementById('status');
const exploreBtn = document.getElementById('explore-btn');
const shopBtn = document.getElementById('shop-btn');
const locationButtonsEl = document.getElementById('location-buttons');
const nftListEl = document.getElementById('nft-list');
const shopPanel = document.getElementById('shop-panel');
const shopItemsEl = document.getElementById('shop-items');
const closeShopBtn = document.getElementById('close-shop-btn');
const treasureAnimationEl = document.getElementById('treasure-animation');
const locationPlayArea = document.getElementById('location-play-area');
const locationTitleEl = document.getElementById('location-title');
const locationContentEl = document.getElementById('location-content');
const exitLocationBtn = document.getElementById('exit-location');

function updateCoinDisplay() {
  coinBalanceEl.textContent = `Coins: ${coins}`;
}

function addStatusMessage(msg) {
  statusEl.textContent = msg;
  setTimeout(() => {
    if(statusEl.textContent === msg) {
      statusEl.textContent = '';
    }
  }, 4000);
}

function showTreasureAnimation(imgUrl) {
  treasureAnimationEl.innerHTML = '';
  const img = document.createElement('img');
  img.src = imgUrl;
  treasureAnimationEl.appendChild(img);
  setTimeout(() => treasureAnimationEl.innerHTML = '', 1200);
}

function addNFTToInventory(item) {
  if(!collectedNFTs.find(i => i.id === item.id)) {
    collectedNFTs.push(item);
    renderNFTs();
  }
}

function renderNFTs() {
  nftListEl.innerHTML = '<h3>Your Treasures</h3>';
  if(collectedNFTs.length === 0) {
    nftListEl.innerHTML += '<p>You have no treasures yet. Explore to find some!</p>';
    return;
  }
  collectedNFTs.forEach(item => {
    const div = document.createElement('div');
    div.classList.add('nft-item');
    div.innerHTML = `<img src="${item.img}" alt="${item.name}"/> <p>${item.name}</p>`;
    nftListEl.appendChild(div);
  });
}

function openShop() {
  renderShopItems();
  shopPanel.style.display = 'flex';
}

function closeShop() {
  shopPanel.style.display = 'none';
}

function renderShopItems() {
  shopItemsEl.innerHTML = '';
  shopItems.forEach(item => {
    const div = document.createElement('div');
    div.classList.add('shop-item');
    div.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <p>${item.name} - ${item.price} coins</p>
      <button data-id="${item.id}">Buy</button>
    `;
    shopItemsEl.appendChild(div);
  });
}

function buyItem(id) {
  const item = shopItems.find(i => i.id === id);
  if (!item) return;

  if(coins >= item.price) {
    coins -= item.price;
    updateCoinDisplay();
    addNFTToInventory(item);
    addStatusMessage(`Purchased ${item.name}!`);
    showTreasureAnimation(item.img);
  } else {
    addStatusMessage(`Not enough coins for ${item.name}.`);
  }
}

function createLocationButtons() {
  locationButtonsEl.innerHTML = '';
  const locations = [
    { id: 'forest', name: 'Enchanted Forest', requires: 'Mystic Map' },
    { id: 'volcano', name: 'Volcanic Crater', requires: 'Fire Charm' },
    { id: 'castle', name: 'Ancient Castle', requires: 'Golden Key' }
  ];
  locations.forEach(loc => {
    const hasItem = collectedNFTs.some(nft => nft.name === loc.requires);
    const btn = document.createElement('button');
    btn.textContent = loc.name;
    btn.disabled = !hasItem;
    btn.title = hasItem ? `Enter ${loc.name}` : `Requires ${loc.requires}`;
    btn.addEventListener('click', () => enterLocation(loc.id));
    locationButtonsEl.appendChild(btn);
  });
}

function enterLocation(locId) {
  currentLocation = locId;
  exploreBtn.disabled = true;
  shopBtn.disabled = true;
  locationButtonsEl.style.display = 'none';
  locationPlayArea.style.display = 'flex';
  locationTitleEl.textContent = `You are in the ${getLocationName(locId)}`;
  locationContentEl.innerHTML = '';
  runLocationGame(locId);
}

function exitLocation() {
  currentLocation = null;
  locationPlayArea.style.display = 'none';
  exploreBtn.disabled = false;
  shopBtn.disabled = false;
  locationButtonsEl.style.display = 'flex';
  locationContentEl.innerHTML = '';
}

function getLocationName(id) {
  switch(id) {
    case 'forest': return 'Enchanted Forest';
    case 'volcano': return 'Volcanic Crater';
    case 'castle': return 'Ancient Castle';
    default: return 'Unknown Location';
  }
}

function runLocationGame(locId) {
  if(locId === 'forest') runForestMazeGame();
  else if(locId === 'volcano') runVolcanoMemoryGame();
  else if(locId === 'castle') runCastleShootingGame();
}

/* ==== Mini-Games ==== */

// 1) Forest Maze Game
function runForestMazeGame() {
  locationContentEl.innerHTML = '';
  locationContentEl.style.position = 'relative';

  const mazeSize = 8;
  const cellSize = 40;

  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.width = mazeSize * cellSize;
  canvas.height = mazeSize * cellSize;
  locationContentEl.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  // Maze data
  const maze = generateMaze(mazeSize, mazeSize);

  // Player
  let player = { x: 0, y: 0 };
  const end = { x: mazeSize - 1, y: mazeSize - 1 };

  drawMaze();

  // Keyboard controls
  function handleKey(e) {
    let nx = player.x;
    let ny = player.y;
    if (e.key === 'ArrowUp') ny--;
    else if (e.key === 'ArrowDown') ny++;
    else if (e.key === 'ArrowLeft') nx--;
    else if (e.key === 'ArrowRight') nx++;

    if (nx >= 0 && ny >= 0 && nx < mazeSize && ny < mazeSize && !maze[ny][nx]) {
      player.x = nx;
      player.y = ny;
      drawMaze();
      if (player.x === end.x && player.y === end.y) {
        window.removeEventListener('keydown', handleKey);
        addStatusMessage('You found the treasure in the forest! +15 coins');
        coins += 15;
        updateCoinDisplay();
        exitLocationBtn.click();
      }
    }
  }
  window.addEventListener('keydown', handleKey);

  function drawMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw cells
    for(let y=0; y<mazeSize; y++) {
      for(let x=0; x<mazeSize; x++) {
        if(maze[y][x]) {
          ctx.fillStyle = '#663300';
          ctx.fillRect(x*cellSize, y*cellSize, cellSize, cellSize);
        } else {
          ctx.fillStyle = '#228B22';
          ctx.fillRect(x*cellSize, y*cellSize, cellSize, cellSize);
        }
      }
    }
    // Draw exit
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(end.x*cellSize, end.y*cellSize, cellSize, cellSize);
    // Draw player
    ctx.fillStyle = '#ff4500';
    ctx.beginPath();
    ctx.arc(player.x*cellSize + cellSize/2, player.y*cellSize + cellSize/2, cellSize/3, 0, Math.PI*2);
    ctx.fill();
  }

  // Maze generator: simple randomized walls with path cleared (basic)
  function generateMaze(w, h) {
    // Create grid filled with walls
    let grid = Array.from({length: h}, ()=>Array(w).fill(1));
    // Create a simple path from top-left to bottom-right (clear)
    for(let i=0; i<w; i++) grid[0][i] = 0;
    for(let j=0; j<h; j++) grid[j][w-1] = 0;

    // Random open cells (easy maze)
    for(let y=1; y<h-1; y++) {
      for(let x=1; x<w-1; x++) {
        if(Math.random() < 0.7) grid[y][x] = 0;
      }
    }
    grid[0][0] = 0;
    grid[h-1][w-1] = 0;
    return grid;
  }
}

// 2) Volcano Memory Game
function runVolcanoMemoryGame() {
  locationContentEl.innerHTML = '<p>Match all pairs to earn 20 coins!</p>';

  const cardsData = [
    '🌋', '🌋',
    '🔥', '🔥',
    '🌟', '🌟',
    '💎', '💎',
    '🔥', '🔥',
    '🌟', '🌟'
  ];

  // Shuffle array
  function shuffle(arr) {
    for(let i=arr.length-1; i>0; i--) {
      const j = Math.floor(Math.random()*(i+1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  shuffle(cardsData);

  // Create cards
  const cardContainer = document.createElement('div');
  cardContainer.style.display = 'grid';
  cardContainer.style.gridTemplateColumns = 'repeat(4, 60px)';
  cardContainer.style.gap = '10px';
  locationContentEl.appendChild(cardContainer);

  let firstCard = null;
  let secondCard = null;
  let matchedPairs = 0;

  cardsData.forEach((emoji, i) => {
    const card = document.createElement('div');
    card.style.width = '60px';
    card.style.height = '60px';
    card.style.background = '#442c00';
    card.style.borderRadius = '8px';
    card.style.cursor = 'pointer';
    card.style.fontSize = '2.5rem';
    card.style.display = 'flex';
    card.style.alignItems = 'center';
    card.style.justifyContent = 'center';
    card.style.userSelect = 'none';
    card.dataset.emoji = emoji;
    card.textContent = '';

    card.addEventListener('click', () => {
      if(card.textContent || secondCard) return; // ignore if already flipped or two cards flipped
      card.textContent = emoji;
      if(!firstCard) {
        firstCard = card;
      } else {
        secondCard = card;
        if(firstCard.dataset.emoji === secondCard.dataset.emoji) {
          matchedPairs++;
          firstCard.style.background = '#ffaa00cc';
          secondCard.style.background = '#ffaa00cc';
          firstCard = null;
          secondCard = null;
          if(matchedPairs === cardsData.length / 2) {
            addStatusMessage('Memory game completed! +20 coins');
            coins += 20;
            updateCoinDisplay();
            exitLocationBtn.click();
          }
        } else {
          setTimeout(() => {
            firstCard.textContent = '';
            secondCard.textContent = '';
            firstCard = null;
            secondCard = null;
          }, 1000);
        }
      }
    });

    cardContainer.appendChild(card);
  });
}

// 3) Castle Shooting Game
function runCastleShootingGame() {
  locationContentEl.innerHTML = '';
  locationContentEl.style.position = 'relative';

  const width = 400;
  const height = 250;

  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  locationContentEl.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  // Player gun
  const gun = {
    x: width / 2,
    y: height - 30,
    width: 50,
    height: 20,
    speed: 10,
  };

  // Targets array
  let targets = [];
  let bullets = [];

  let score = 0;
  let gameOver = false;

  function createTarget() {
    const target = {
      x: Math.random() * (width - 30),
      y: 0,
      width: 30,
      height: 30,
      speed: 2 + Math.random() * 2,
    };
    targets.push(target);
  }

  function drawGun() {
    ctx.fillStyle = '#ffaa00';
    ctx.fillRect(gun.x - gun.width / 2, gun.y, gun.width, gun.height);
  }

  function drawTargets() {
    ctx.fillStyle = '#ff3300';
    targets.forEach(t => {
      ctx.beginPath();
      ctx.arc(t.x + t.width/2, t.y + t.height/2, t.width/2, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function drawBullets() {
    ctx.fillStyle = '#ffff00';
    bullets.forEach(b => {
      ctx.fillRect(b.x - 2, b.y, 4, 10);
    });
  }

  function update() {
    if(gameOver) return;
    // Move targets
    targets.forEach(t => {
      t.y += t.speed;
      if(t.y > height) {
        gameOver = true;
        addStatusMessage('Game over! You missed a target.');
      }
    });

    // Move bullets
    bullets.forEach((b, idx) => {
      b.y -= 10;
      if(b.y < 0) {
        bullets.splice(idx, 1);
      }
    });

    // Collision detection
    bullets.forEach((b, bIdx) => {
      targets.forEach((t, tIdx) => {
        if (
          b.x > t.x &&
          b.x < t.x + t.width &&
          b.y > t.y &&
          b.y < t.y + t.height
        ) {
          // Hit
          targets.splice(tIdx, 1);
          bullets.splice(bIdx, 1);
          score++;
          addStatusMessage(`Target hit! Score: ${score}`);
          coins += 5;
          updateCoinDisplay();
        }
      });
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    drawGun();
    drawTargets();
    drawBullets();
    ctx.fillStyle = '#ffd700';
    ctx.font = '18px Montserrat';
    ctx.fillText(`Score: ${score}`, 10, 20);
  }

  function gameLoop() {
    update();
    draw();
    if(!gameOver) {
      requestAnimationFrame(gameLoop);
    } else {
      addStatusMessage('Shooting game ended!');
      setTimeout(() => exitLocationBtn.click(), 3000);
    }
  }

  // Controls
  function keyDownHandler(e) {
    if(e.key === 'ArrowLeft') {
      gun.x -= gun.speed;
      if(gun.x < gun.width / 2) gun.x = gun.width / 2;
    } else if(e.key === 'ArrowRight') {
      gun.x += gun.speed;
      if(gun.x > width - gun.width / 2) gun.x = width - gun.width / 2;
    } else if(e.key === ' ') {
      // Shoot bullet
      bullets.push({ x: gun.x, y: gun.y });
    }
  }

  window.addEventListener('keydown', keyDownHandler);

  //
