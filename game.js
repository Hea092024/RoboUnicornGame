const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Unicorn {
  constructor() {
    this.x = 50;
    this.y = canvas.height - 100;
    this.width = 80;
    this.height = 50;
    this.velocityY = 0;
    this.gravity = 1;
    this.jumpPower = -15;
    this.jumping = false;
  }

  jump() {
    if (!this.jumping) {
      this.velocityY = this.jumpPower;
      this.jumping = true;
    }
  }

  update() {
    this.y += this.velocityY;
    this.velocityY += this.gravity;

    if (this.y >= canvas.height - 100) {
      this.y = canvas.height - 100;
      this.jumping = false;
    }
  }

  draw() {
    ctx.fillStyle = "cyan";
    ctx.fillRect(this.x, this.y, this.width, this.height);
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
  }
});

update();

const music = document.getElementById("bgMusic");

document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    unicorn.jump();
    if (music.paused) {
      music.play();
    }
  }
});
