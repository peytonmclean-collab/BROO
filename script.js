const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const inventoryMenu = document.getElementById("inventory");
const mapMenu = document.getElementById("mapMenu");

const keys = {};

const player = {
  x: 400,
  y: 300,
  width: 40,
  height: 40,
  speed: 4,
  color: "cyan",
  health: 100,
  energy: 100,
  level: 1,
  class: "Warrior",
  attacking: false,
  dodging: false,
  blocking: false
};

const world = {
  width: 4000,
  height: 4000
};

const camera = {
  x: 0,
  y: 0
};

const enemies = [
  {
    x: 700,
    y: 500,
    width: 40,
    height: 40,
    color: "green",
    type: "Goblin",
    health: 50
  },
  {
    x: 1200,
    y: 900,
    width: 60,
    height: 60,
    color: "purple",
    type: "Shadow Beast",
    health: 120
  },
  {
    x: 1800,
    y: 1500,
    width: 90,
    height: 90,
    color: "red",
    type: "Dragon",
    health: 300
  }
];

const regions = [
  {
    x: 0,
    y: 0,
    width: 1000,
    height: 1000,
    color: "#2e8b57",
    name: "Forest"
  },
  {
    x: 1000,
    y: 0,
    width: 1000,
    height: 1000,
    color: "#c2b280",
    name: "Desert"
  },
  {
    x: 0,
    y: 1000,
    width: 1000,
    height: 1000,
    color: "#708090",
    name: "Mountains"
  },
  {
    x: 1000,
    y: 1000,
    width: 1000,
    height: 1000,
    color: "#556b2f",
    name: "Swamp"
  },
  {
    x: 2000,
    y: 1000,
    width: 1000,
    height: 1000,
    color: "#dfefff",
    name: "Snow Kingdom"
  }
];

window.addEventListener("keydown", (e) => {
  keys[e.key.toLowerCase()] = true;

  if (e.key.toLowerCase() === "i") {
    inventoryMenu.classList.toggle("hidden");
  }

  if (e.key.toLowerCase() === "m") {
    mapMenu.classList.toggle("hidden");
  }

  if (e.key === "Tab") {
    e.preventDefault();
    alert("Main Quest: Stop Lebron before the Shadow Realm awakens.");
  }

  if (e.key === " ") {
    dodge();
  }

  if (e.key.toLowerCase() === "q") {
    castSpell();
  }
});

window.addEventListener("keyup", (e) => {
  keys[e.key.toLowerCase()] = false;
});

window.addEventListener("mousedown", (e) => {
  if (e.button === 0) {
    attack();
  }

  if (e.button === 2) {
    player.blocking = true;
  }
});

window.addEventListener("mouseup", (e) => {
  if (e.button === 2) {
    player.blocking = false;
  }
});

window.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

function movePlayer() {
  if (keys["w"]) player.y -= player.speed;
  if (keys["s"]) player.y += player.speed;
  if (keys["a"]) player.x -= player.speed;
  if (keys["d"]) player.x += player.speed;

  player.x = Math.max(0, Math.min(world.width, player.x));
  player.y = Math.max(0, Math.min(world.height, player.y));
}

function attack() {
  player.attacking = true;

  enemies.forEach(enemy => {
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 100) {
      enemy.health -= 20;
    }
  });

  setTimeout(() => {
    player.attacking = false;
  }, 200);
}

function dodge() {
  player.dodging = true;
  player.speed = 8;

  setTimeout(() => {
    player.speed = 4;
    player.dodging = false;
  }, 300);
}

function castSpell() {
  if (player.energy >= 10) {
    player.energy -= 10;

    enemies.forEach(enemy => {
      const dx = player.x - enemy.x;
      const dy = player.y - enemy.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 200) {
        enemy.health -= 40;
      }
    });
  }
}

function updateEnemies() {
  enemies.forEach(enemy => {
    if (enemy.health > 0) {
      if (enemy.x < player.x) enemy.x += 1;
      if (enemy.x > player.x) enemy.x -= 1;
      if (enemy.y < player.y) enemy.y += 1;
      if (enemy.y > player.y) enemy.y -= 1;

      const dx = player.x - enemy.x;
      const dy = player.y - enemy.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 50 && !player.blocking) {
        player.health -= 0.1;
      }
    }
  });
}

function updateCamera() {
  camera.x = player.x - canvas.width / 2;
  camera.y = player.y - canvas.height / 2;
}

function drawRegions() {
  regions.forEach(region => {
    ctx.fillStyle = region.color;
    ctx.fillRect(
      region.x - camera.x,
      region.y - camera.y,
      region.width,
      region.height
    );

    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText(
      region.name,
      region.x + 40 - camera.x,
      region.y + 50 - camera.y
    );
  });
}

function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(
    player.x - camera.x,
    player.y - camera.y,
    player.width,
    player.height
  );

  if (player.attacking) {
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(
      player.x + 20 - camera.x,
      player.y + 20 - camera.y,
      60,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
}

function drawEnemies() {
  enemies.forEach(enemy => {
    if (enemy.health > 0) {
      ctx.fillStyle = enemy.color;
      ctx.fillRect(
        enemy.x - camera.x,
        enemy.y - camera.y,
        enemy.width,
        enemy.height
      );

      ctx.fillStyle = "red";
      ctx.fillRect(
        enemy.x - camera.x,
        enemy.y - 10 - camera.y,
        enemy.health / 2,
        5
      );

      ctx.fillStyle = "white";
      ctx.fillText(
        enemy.type,
        enemy.x - camera.x,
        enemy.y - 20 - camera.y
      );
    }
  });
}

function drawWorldDetails() {
  for (let i = 0; i < 40; i++) {
    ctx.fillStyle = "#654321";
    ctx.fillRect(i * 200 - camera.x, 300 - camera.y, 20, 60);

    ctx.fillStyle = "green";
    ctx.beginPath();
    ctx.arc(i * 200 + 10 - camera.x, 280 - camera.y, 40, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "blue";
  ctx.fillRect(1500 - camera.x, 200 - camera.y, 100, 300);

  ctx.fillStyle = "gray";
  ctx.fillRect(2300 - camera.x, 1200 - camera.y, 300, 300);

  ctx.fillStyle = "darkred";
  ctx.fillRect(2600 - camera.x, 700 - camera.y, 200, 200);
}

function drawHUD() {
  document.querySelector(".health").style.width = player.health + "%";
  document.querySelector(".energy").style.width = player.energy + "%";
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  movePlayer();
  updateEnemies();
  updateCamera();

  drawRegions();
  drawWorldDetails();
  drawPlayer();
  drawEnemies();
  drawHUD();

  requestAnimationFrame(gameLoop);
}

gameLoop();
