const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const unicornImg = new Image();
unicornImg.src = "./assets/unicornrun.webp";

class Unicorn {
  constructor() {
    this.x = 50;
    this.y = canvas.height - 150;
    this.width = 100;
    this.height = 80;
    this.velocityY = 0;
    this.gravity = 1;
    this.jumpPower = -15;
    this.jumping = false;
    this.speed = 5;

    this.frameX = 0;
    this.totalFrames = 6;
    this.spriteWidth = 600 / this.totalFrames; // Assuming each frame is equal in size
    this.spriteHeight = 100;
  }

  jump() {
    if (!this.jumping) {
      this.velocityY = this.jumpPower;
      this.jumping = true;
    }
  }

  moveRight() {
    this.x += this.speed;
  }

  moveLeft() {
    this.x -= this.speed;
  }

  update() {
    this.y += this.velocityY;
    this.velocityY += this.gravity;

    if (this.y >= canvas.height - 150) {
      this.y = canvas.height - 150;
      this.jumping = false;
    }

    this.frameX = (this.frameX + 1) % this.totalFrames;
  }

  draw() {
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

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  unicorn.update();
  unicorn.draw();
  requestAnimationFrame(update);
}

document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    unicorn.jump();
  } else if (event.code === "ArrowRight") {
    unicorn.moveRight();
  } else if (event.code === "ArrowLeft") {
    unicorn.moveLeft();
  }
});

update();

const music = document.getElementById("bgMusic");
const startButton = document.getElementById("startGame");

startButton.addEventListener("click", () => {
  music.play();
  startButton.style.display = "none"; // Hide button after starting
});
