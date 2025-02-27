const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: './assets/Backgrounds/background.png',
  framesMax: 8
})

// const shop = new Sprite({
//   position: {
//     x: 0,
//     y: 0,
//   },
//   imageSrc: './assets/shop.png',
//   scale: 2.75,
//   framesMax: 6
// })

const player = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0
  },
  imageSrc: './assets/sarkov/sarkov.idle.png',
  framesMax: 2,
  scale: 1.2,
  offset : {
    x: -20,
    y: 0
  },
  sprites : {
    idle: {
      imageSrc: './assets/sarkov/sarkov.idle.png',
      framesMax: 2,
      
    },
    run: {
      imageSrc: './assets/sarkov/sarkov.run.png',
      framesMax: 3,
    },
    jump: {
      imageSrc: './assets/sarkov/sarkov.jump.png',
      framesMax: 1,
    },
    fall : {
      imageSrc: './assets/sarkov/sarkov.fall.png',
      framesMax: 1,
    },
    attack : {
      imageSrc: './assets/sarkov/sarkov.attack.png',
      framesMax: 3,
    },
    takeHit : {
      imageSrc: './assets/sarkov/sarkov.takehit.png',
      framesMax: 3,
    },
    death : {
      imageSrc: './assets/sarkov/sarkov.dead.png',
      framesMax: 6,
    }
    
  }
});

const enemy = new Fighter({
  position: {
    x: 800,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset : {
    x: -50,
    y: 0
  },

  imageSrc: './assets/redman/redman.idle.png',
  framesMax: 2,
  scale: 1.2,
  offset : {
    x: -20,
    y: 0
  },
  sprites : {
    idle: {
      imageSrc: './assets/redman/redman.idle.png',
      framesMax: 2,
      
    },
    run: {
      imageSrc: './assets/redman/redman.run.png',
      framesMax: 4,
    },
    jump: {
      imageSrc: './assets/redman/redman.jump.png',
      framesMax: 1,
    },
    fall : {
      imageSrc: './assets/redman/redman.fall.png',
      framesMax: 1,
    },
    attack : {
      imageSrc: './assets/redman/redman.attack.png',
      framesMax: 3,
    },
    takeHit : {
      imageSrc: './assets/redman/redman.takehit.png',
      framesMax: 3,
    },
    death : {
      imageSrc: './assets/redman/redman.dead.png',
      framesMax: 5,
    }
  }
});


const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  // shop.update();
  c.fillStyle = 'rgba(255, 255, 255, 0.2)';
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;
  
  //movements for player 1
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
    player.switchSprite('run')
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
    player.switchSprite('run')
  } else {
    player.switchSprite('idle')
  }

  //jumping for player1
  if (player.velocity.y < 0) {
    player.switchSprite('jump')
  } else if (player.velocity.y > 0) {
    player.switchSprite('fall')
  }
 //movements for player 2
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
    enemy.switchSprite('run')
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
    enemy.switchSprite('run')
  } else {
    enemy.switchSprite('idle')
  }

  //jumping for player2
  if (enemy.velocity.y < 0) {
    enemy.switchSprite('jump')
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite('fall')
  }

  //detect collision and enemy gets hit
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking
  ) {
    enemy.takeHit()
    player.isAttacking = false;
    gsap.to("#enemyHealth", {width: enemy.health + "%"})
  }

  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking
  ) {
    player.takeHit()
    enemy.isAttacking = false;
    gsap.to("#playerHealth", {width: player.health + "%"})
  }

  // end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({player, enemy, timeId})
  }

}

animate();

window.addEventListener('keydown', (event) => {
  if (!player.dead) {

  switch (event.key) {
    case "d":
      keys.d.pressed = true;
      player.lastKey = "d";
      break;
    case "a":
      keys.a.pressed = true;
      player.lastKey = "a";
      break;
    case "w":
      player.velocity.y = -20;
      break;
    case " ":
      player.attack();
      break;
  }
}
    if (!enemy.dead) {
    switch (event.key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      enemy.lastKey = "ArrowRight";
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = "ArrowLeft";
      break;
    case "ArrowUp":
      enemy.velocity.y = -20;
      break;
    case 'ArrowDown':
      enemy.attack()
      break;
    }
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
  }

  switch (event.key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
});