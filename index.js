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
        } else if (e.key === "r") {
          this.game.incrementBullets();
          console.log("Recharge!");
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
      this.speedX = 1;
      this.scale = 1;
      this.dead = false;
    }
    update() {
      this.x -= this.speedX;
      if (this.x + this.width < 0) {
        this.dead = true;
      }
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
      this.enemyHp = 1;
      this.score = this.enemyHp;
      this.y = Math.floor(Math.random() * this.game.height * 0.9);
      // this.image=new Image();
      // this.img.src=imgSrc;
      // this.width=this.image.width/scale;
      // this.height=this.image.height/scale;
    }
  }

  class Soap extends Enemy {
    constructor(game) {
      super(game);
      this.width = 60;
      this.height = 30;
      this.enemyHp = 3;
      this.score = this.enemyHp;
      this.y = Math.floor(
        Math.random() * (this.game.height * 0.9 - this.height)
      );
      // this.image=new Image();
      // this.img.src=imgSrc;
      // this.width=this.image.width/scale;
      // this.height=this.image.height/scale;
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
      this.delete = false;
      // this.image=new Image();
      // this.img.src=imgSrc;
      // this.width=this.image.width/scale;
      // this.height=this.image.height/scale;
    }
    update() {
      this.x += this.speedX;
      if (this.x > this.game.width * 0.9) this.delete = true;
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
      this.pooBullets = this.pooBullets.filter(
        (pooBullet) => !pooBullet.delete
      );
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
      this.playerHp = 3;
      this.inputs = new Inputs(this);
      this.bullets = new Bullets(this);
      this.pooBullets = 20;
      this.maxBullets = 20;
      this.maxEnemies = 10;
      this.enemies = [];
      this.enemyTimer = 0;
      this.enemyInterval = 1000;
      this.keys = [];
      this.gameOver == false;
      this.score = 0;
      this.maxScore = 50;
    }
    update(delta) {
      this.player.update();

      //Enemies
      this.enemies.forEach((enemy) => {
        enemy.update();

        if (this.checkCollision(this.player, enemy)) {
          enemy.dead = true;
          this.playerHp--;
          if (this.playerHp === 0) {
            this.gameOver = true;
            console.log("YOU LOST");
          }
        }
        this.player.pooBullets.forEach((bullet) => {
          if (this.checkCollision(bullet, enemy)) {
            enemy.enemyHp--;
            bullet.delete = true;
            if (enemy.enemyHp === 0) {
              enemy.dead = true;
              this.score += enemy.score;
              console.log(this.score);
            }
          }
        });
      });

      this.enemies = this.enemies.filter((enemy) => !enemy.dead);

      if (this.enemyTimer > this.enemyInterval) {
        this.addEnemies();
        this.enemyTimer = 0;
      } else {
        this.enemyTimer += delta;
      }

      //Bullets
      if (this.pooBullets === 0) {
        //this.incrementBullets();
        console.log("NO POO,YOU NEED TO EAT");
      }
    }
    draw(context) {
      this.player.draw(context);
      this.enemies.forEach((enemy) => {
        enemy.draw(context);
      });
    }

    incrementBullets() {
      do {
        this.pooBullets++;
      } while (this.pooBullets < this.maxBullets);
      console.log(this.pooBullets);
    }

    addEnemies() {
      const chooseEnemy = Math.random() * 5;
      if (chooseEnemy < 4) {
        this.enemies.push(new Paper(this));
      } else if (chooseEnemy < 5) {
        this.enemies.push(new Soap(this));
      }
    }

    checkCollision(obj1, obj2) {
      return (
        obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y
      );
    }
  }

  const game = new Game(canvas.width, canvas.height);

  let lastTime = 0;
  function startGame(time) {
    const delta = time - lastTime;
    //console.log(delta);
    lastTime = time;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    game.update(delta);
    game.draw(ctx);

    requestAnimationFrame(startGame);
  }

  startGame(0);
});
