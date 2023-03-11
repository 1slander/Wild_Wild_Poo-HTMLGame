window.addEventListener("load", function () {
  const canvas = document.getElementById("board");
  const ctx = canvas.getContext("2d");

  canvas.width = 700;
  canvas.height = 500;

  //Resample image W120 H108

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
      context.strokeStyle = "yellow";
      context.strokeRect(this.x, this.y, this.width, this.height);
      context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
  }

  class Paper extends Enemy {
    constructor(game) {
      super(game);
      const paper = new Image();
      paper.src = "Images/paper.png";
      this.width = 70;
      this.height = 80;
      this.enemyHp = 1;
      this.score = this.enemyHp;
      this.y = Math.floor(Math.random() * this.game.height * 0.9);
      this.image = paper;
    }
  }

  class Soap extends Enemy {
    constructor(game) {
      super(game);
      const soap = new Image();
      soap.src = "Images/soap.png";
      this.width = 80;
      this.height = 70;
      this.enemyHp = 3;
      this.score = this.enemyHp;
      this.y = Math.floor(
        Math.random() * (this.game.height * 0.9 - this.height)
      );
      this.image = soap;
    }
  }
  class Bullets {
    constructor(game) {
      const pooBullet = new Image();
      pooBullet.src = "Images/splat.png";

      this.game = game;
      this.x = this.game.player.x + 65;
      this.y = this.game.player.y + 35;
      this.width = 50;
      this.height = 50;
      this.speedX = 5;
      this.scale = 1;
      this.delete = false;
      this.image = pooBullet;
    }
    update() {
      this.x += this.speedX;
      if (this.x > this.game.width * 0.9) this.delete = true;
    }

    draw(context) {
      context.strokeStyle = "green";
      context.strokeRect(this.x, this.y, this.width, this.height);
      context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
  }
  class HP {
    constructor(game, x) {
      const hp = new Image();
      hp.src = "Images/lives.png";

      this.game = game;
      this.x = x;
      this.y = 50;
      this.width = 30;
      this.height = 30;
      this.image = hp;
    }

    draw(context) {
      context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
  }

  class Player {
    constructor(game) {
      const playerImg = new Image();
      playerImg.src = "./Images/player_rb.png";

      const shootAudio = new Audio();
      shootAudio.src = "./Sounds/fart.mp3";

      const shootAudio2 = new Audio();
      shootAudio2.src = "./Sounds/fart2.wav";

      const shootAudio3 = new Audio();
      shootAudio2.src = "./Sounds/fart3.wav";

      this.game = game;
      this.x = 5;
      this.y = this.game.height / 2;
      this.width = 120;
      this.height = 108;
      this.speedY = 0;
      this.maxSpeed = 5;
      this.scale = 1;
      this.pooBullets = [];
      this.playerImg = playerImg;
      this.playerW = playerImg.width * this.scale;
      this.playerH = playerImg.height * this.scale;
      this.bulletSound = [shootAudio, shootAudio2, shootAudio3];
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
      context.strokeStyle = "red";
      context.strokeRect(this.x, this.y, this.width, this.height);
      context.drawImage(
        this.playerImg,
        this.x,
        this.y,
        this.width,
        this.height
      );
      //Shooting
      this.pooBullets.forEach((poobullet) => {
        poobullet.draw(context);
      });
    }

    randomSound() {
      if (this.game.gameOver) {
        this.bulletSound[random].pause();
      } else {
        let random = Math.floor(Math.random() * 2);
        console.log(random);
        this.bulletSound[random].play();
      }
    }

    shootPoo() {
      if (this.game.pooBullets > 0) {
        this.pooBullets.push(new Bullets(this.game));
        this.randomSound();
        this.game.pooBullets--;
      }
    }
  }
  // UI

  class UI {
    constructor(game) {
      this.game = game;
      this.fontSize = 30;
      this.fontFamily = "Luckiest Guy";
      this.color = "white";
    }

    draw(context) {
      context.fillStyle = this.color;
      context.font = `${this.fontSize}px ${this.fontFamily}`;
      context.fillText(`S c o r e :  ${this.game.score}`, 20, 40);
      context.font = `${this.fontSize - 10}px ${this.fontFamily}`;
      context.fillText(`Poo:  ${this.game.pooBullets}   HP: `, 20, 70);
    }
  }

  //Background

  class Background {
    constructor(game) {
      const background = new Image();
      background.src = "Images/GameBackground.png";

      this.game = game;
      this.image = background;
      this.width = 2300;
      this.height = this.game.height;
      this.speedX = 0.5;
      this.x = 0;
      this.y = 0;
    }

    update() {
      if (this.x <= -this.width) this.x = 0;
      this.x -= this.speedX;
    }
    draw(context) {
      context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
  }

  //Logic

  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.player = new Player(this);
      this.playerHp = 3;
      this.hp = [];
      this.inputs = new Inputs(this);
      this.bullets = new Bullets(this);
      this.background = new Background(this);
      this.ui = new UI(this);
      this.pooBullets = 20;
      this.maxBullets = 20;
      this.maxEnemies = 10;
      this.enemies = [];
      this.enemyTimer = 0;
      this.enemyInterval = 1000;
      this.keys = [];
      this.gameOver == false;
      this.score = 0;
      this.maxScore = 5;
      this.fontFamily = "Luckiest Guy";
    }
    update(delta) {
      this.background.update();
      this.player.update();

      //Enemies
      this.enemies.forEach((enemy) => {
        enemy.update();

        if (this.checkCollision(this.player, enemy)) {
          enemy.dead = true;
          this.playerHp--;
          this.hp.pop();
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
              if (this.score >= this.maxScore) this.gameOver = true;
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
      //HP
      if (this.playerHp > 0) {
        this.addHP();
      }
    }
    draw(context) {
      this.background.draw(context);
      this.player.draw(context);
      this.ui.draw(context);
      if (this.pooBullets === 0) {
        context.style = "white";
        context.font = `40px  ${this.fontFamily}`;
        context.fillText("RECHARGE", 200, 70);
      }
      this.enemies.forEach((enemy) => {
        enemy.draw(context);
      });
      this.hp.forEach((hp) => {
        hp.draw(context);
      });
    }

    addHP() {
      if (this.hp.length < this.playerHp) {
        this.hp.push(new HP(this, 150));
        this.hp.push(new HP(this, 190));
        this.hp.push(new HP(this, 230));
      }
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
    endGame(context) {
      if (this.score >= this.maxScore) {
        context.fillStyle = "Black";
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "white";
        context.font = `50px  ${this.fontFamily}`;
        context.fillText("YOU WON", this.width / 2 - 100, this.height / 2);
        context.font = `30px  ${this.fontFamily}`;
        context.fillText(
          `Score: ${this.score}`,
          this.width / 2 - 70,
          this.height / 2 + 50
        );
      } else if (this.playerHp === 0) {
        context.fillStyle = "Black";
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "white";
        context.font = `50px  ${this.fontFamily}`;
        context.fillText("Game Over", this.width / 2 - 150, this.height / 2);
        context.font = `30px  ${this.fontFamily}`;
        context.fillText(
          `Score: ${this.score}`,
          this.width / 2 - 70,
          this.height / 2 + 50
        );
      }
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
    if (game.gameOver) {
      game.endGame(ctx);
      cancelAnimationFrame;
    } else {
      requestAnimationFrame(startGame);
    }
  }

  startGame(0);
});
