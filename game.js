const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const unicornImg = new Image();
unicornImg.src = "./assets/roboRun.png";

unicornImg.onload = () => {
  console.log("Unicorn image loaded successfully");
};

unicornImg.onerror = () => {
  console.error("Error loading unicorn image");
};

const GROUND_OFFSET = 210; // Increased to raise everything higher
const JUMP_HEIGHT = -20; // Increased jump power

class Obstacle {
  constructor() {
    this.width = 50;
    this.height = 70;
    this.x = canvas.width;
    // Adjusted obstacle position to be at ground level
    this.y = canvas.height - GROUND_OFFSET;
    this.speed = 5;
  }

  update() {
    this.x -= this.speed;
  }

  draw() {
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  isOffScreen() {
    return this.x + this.width < 0;
  }

  collidesWith(unicorn) {
    const collisionMargin = 10;
    return !(
      this.x > unicorn.x + unicorn.width - collisionMargin ||
      this.x + this.width < unicorn.x + collisionMargin ||
      this.y > unicorn.y + unicorn.height - collisionMargin ||
      this.y + this.height < unicorn.y + collisionMargin
    );
  }
}

class Unicorn {
  constructor() {
    this.x = 50;
    this.y = canvas.height - GROUND_OFFSET - 30; // Raised horse 30px from ground
    this.width = 100;
    this.height = 80;
    this.velocityY = 0;
    this.gravity = 1;
    this.jumpPower = JUMP_HEIGHT;
    this.jumping = false;
    this.speed = 5;
    this.frameX = 0;
    this.totalFrames = 6;
    this.spriteWidth = 600 / this.totalFrames;
    this.spriteHeight = 100;
    this.frameTimer = 0;
    this.frameInterval = 150;
    this.groundY = canvas.height - GROUND_OFFSET - 30; // Store initial Y position as ground level
  }

  jump() {
    if (!this.jumping) {
      this.velocityY = this.jumpPower;
      this.jumping = true;
    }
  }

  moveRight() {
    this.x += this.speed;
    if (this.x > canvas.width - this.width) {
      this.x = canvas.width - this.width;
    }
  }

  moveLeft() {
    this.x -= this.speed;
    if (this.x < 0) {
      this.x = 0;
    }
  }

  update(deltaTime) {
    this.y += this.velocityY;
    this.velocityY += this.gravity;

    if (this.y >= this.groundY) {
      this.y = this.groundY;
      this.jumping = false;
      this.velocityY = 0;
    }

    this.frameTimer += deltaTime;
    if (this.frameTimer >= this.frameInterval) {
      this.frameX = (this.frameX + 1) % this.totalFrames;
      this.frameTimer = 0;
    }
  }

  draw() {
    if (!unicornImg.complete) {
      ctx.fillStyle = "#00FF00";
      ctx.fillRect(this.x, this.y, this.width, this.height);
      return;
    }

    ctx.drawImage(
      unicornImg,
      this.frameX * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}

const unicorn = new Unicorn();
let obstacles = [];
let lastTime = 0;
let gameStarted = false;
let obstacleTimer = 0;
let obstacleInterval = 2000;

function gameLoop(timestamp) {
  if (!gameStarted) return;

  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.moveTo(0, canvas.height - GROUND_OFFSET);
  ctx.lineTo(canvas.width, canvas.height - GROUND_OFFSET);
  ctx.stroke();

  unicorn.update(deltaTime);
  unicorn.draw();

  obstacleTimer += deltaTime;
  if (obstacleTimer >= obstacleInterval) {
    obstacles.push(new Obstacle());
    obstacleTimer = 0;
  }

  obstacles = obstacles.filter((obstacle) => {
    obstacle.update();
    obstacle.draw();

    if (obstacle.collidesWith(unicorn)) {
      gameStarted = false;
      alert("Game Over! Click Start to play again.");
      obstacles = [];
      unicorn.x = 50;
      startButton.style.display = "block";
      return false;
    }

    return !obstacle.isOffScreen();
  });

  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (event) => {
  if (!gameStarted) return;

  switch (event.code) {
    case "Space":
      event.preventDefault();
      unicorn.jump();
      break;
    case "ArrowRight":
      unicorn.moveRight();
      break;
    case "ArrowLeft":
      unicorn.moveLeft();
      break;
  }
});

const music = document.getElementById("bgMusic");
const startButton = document.getElementById("startGame");

startButton.addEventListener("click", () => {
  try {
    music
      .play()
      .then(() => {
        gameStarted = true;
        startButton.style.display = "none";
        lastTime = performance.now();
        requestAnimationFrame(gameLoop);
      })
      .catch((error) => {
        console.error("Audio playback failed:", error);
        gameStarted = true;
        startButton.style.display = "none";
        lastTime = performance.now();
        requestAnimationFrame(gameLoop);
      });
  } catch (error) {
    console.error("Audio playback failed:", error);
    gameStarted = true;
    startButton.style.display = "none";
    lastTime = performance.now();
    requestAnimationFrame(gameLoop);
  }
});
