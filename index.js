window.addEventListener("load", function () {
  const canvas = document.getElementById("board");
  const ctx = canvas.getContext("2d");
  console.log(ctx);
  canvas.width = 500;
  canvas.height = 700;
  const scale = 6;

  //Inputs
  class Inputs {
    constructor(game) {
      this.game = game;

      window.addEventListener("keydown", (e) => {
        if (e.key === "ArrowUp") {
          player.speedY = 10;
          player.moveUp();
        } else if (e.key === "ArrowDown") {
          player.speedY = 10;
          player.moveDown();
        } else if (e.key === " ") {
          console.log("Shooting!");
        }
      });

      window.addEventListener("keyup", (e) => {
        if (e.key === "ArrowUp") {
          player.speedY = 0;
          //player.moveUp();
        } else if (e.key === "ArrowDown") {
          player.speedY = 0;
          //player.moveDown();
        }
      });
    }
  }
  // Classes
  class Player {
    constructor(game) {
      this.game = game;
      this.x = 10;
      this.y = canvas.height / 2;
      this.width = 120;
      this.height = 100;
      this.speedY = 10;
      // this.image=new Image();
      // this.img.src=imgSrc;
      // this.width=this.image.width/scale;
      // this.height=this.image.height/scale;
    }

    moveUp() {
      this.y -= this.speedY;
    }
    moveDown() {
      this.y += this.speedY;
    }

    draw(context) {
      context.fillStyle = "red";
      context.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  //Logic
  //  const player=new Player(ctx);
  // console.log(player)

  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.player = new Player(this);
    }
    update() {
      this.player.moveUp();
      this.player.moveDown();
    }
    draw(context) {
      this.player.draw(context);
    }
  }

  const game = new Game(canvas.width, canvas.height);
  console.log(game);

  function startGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update();
    game.draw(ctx);
    requestAnimationFrame(startGame);
  }
  startGame();
});
