window.addEventListener("load", function () {
  const canvas = document.getElementById("board");
  const ctx = canvas.getContext("2d");

  canvas.width = 500;
  canvas.height = 700;
  const scale = 6;

  //Inputs
  class Inputs {
    constructor(game) {
      this.game = game;

      window.addEventListener("keydown", (e) => {
        if (
          (e.key === "ArrowUp" || e.key === "ArrowDown") &&
          this.game.keys.indexOf(e.key) === -1
        ) {
          this.game.keys.push(e.key);
        } else if (e.key === " ") {
          this.game.player.shootPoo();
          console.log("Shooting!");
        }
      });

      window.addEventListener("keyup", (e) => {
        if (this.game.keys.indexOf(e.key) > -1) {
          this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
        }
      });
    }
  }
  // Classes
  class Enemy {
    constructor(game) {
      this.game = game;
      this.x = this.game.width;
      this.speedX = 5;
      this.scale = 1;
      // this.image=new Image();
      // this.img.src=imgSrc;
      // this.width=this.image.width/scale;
      // this.height=this.image.height/scale;
    }
    update() {
      this.x -= this.speedX;
    }

    draw(context) {
      context.fillStyle = "yellow";
      context.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  class Paper extends Enemy {
    constructor(game) {
      super(game);
      this.width = 30;
      this.height = 60;
      this.y = Math.floor(
        Math.random() * (this.game.height * 0.9 - this.height)
      );
    }
  }
  class Bullets {
    constructor(game) {
      this.game = game;
      this.x = this.game.player.x;
      this.y = this.game.player.y;
      this.width = 20;
      this.height = 20;
      this.speedX = 5;
      this.scale = 1;
      // this.image=new Image();
      // this.img.src=imgSrc;
      // this.width=this.image.width/scale;
      // this.height=this.image.height/scale;
    }
    update() {
      this.x += this.speedX;
    }

    draw(context) {
      context.fillStyle = "green";
      context.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  class Player {
    constructor(game) {
      this.game = game;
      this.x = 10;
      this.y = canvas.height / 2;
      this.width = 120;
      this.height = 100;
      this.speedY = 0;
      this.maxSpeed = 5;
      this.scale = 1;
      this.pooBullets = [];
      // this.image=new Image();
      // this.img.src=imgSrc;
      // this.width=this.image.width/scale;
      // this.height=this.image.height/scale;
    }
    update() {
      if (this.game.keys.includes("ArrowUp")) {
        if (this.y <= 0) {
          this.y = 0;
        } else {
          this.y -= this.maxSpeed;
        }
      } else if (this.game.keys.includes("ArrowDown")) {
        if (this.y + this.height >= this.game.height) {
          this.y = this.game.height - this.height;
        } else {
          this.y += this.maxSpeed;
        }
      } else {
        this.y += this.speedY;
      }
      //Shooting
      this.pooBullets.forEach((poobullet) => {
        poobullet.update();
      });
    }

    draw(context) {
      context.fillStyle = "red";
      context.fillRect(this.x, this.y, this.width, this.height);
      //Shooting
      this.pooBullets.forEach((poobullet) => {
        poobullet.draw(context);
      });
    }

    shootPoo() {
      if (this.game.pooBullets > 0) {
        this.pooBullets.push(new Bullets(this.game));
        this.game.pooBullets--;
      }
    }
  }

  //Logic

  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.player = new Player(this);
      this.inputs = new Inputs(this);
      this.bullets = new Bullets(this);
      this.pooBullets = 20;
      this.maxBullets = 20;
      this.keys = [];
    }
    update() {
      this.player.update();
      if (this.pooBullets === 0) {
        this.incrementBullets();

        console.log("NO POO");
      }

      //Find a way to recharge bullets every sec until is full.
      // if (this.pooBullets < this.maxBullets) {
      //   setInterval(() => {
      //     this.pooBullets++;
      //   }, 1000);
      // } else {
      //   clearInterval;
      // }
    }
    draw(context) {
      this.player.draw(context);
    }
    incrementBullets() {
      do {
        this.pooBullets++;
      } while (this.pooBullets < this.maxBullets);
      console.log(this.pooBullets);
    }
  }

  const game = new Game(canvas.width, canvas.height);

  function startGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update();
    game.draw(ctx);
    requestAnimationFrame(startGame);
  }
  startGame();
});
