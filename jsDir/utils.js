function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
}

function determineWinner({ player, enemy, timeId }) {
  clearTimeout(timeId);
  const displayTextElement = document.querySelector("#displayText");

  if (player.health == enemy.health) {
    displayTextElement.innerHTML = "Tie";
  } else if (player.health > enemy.health) {
    displayTextElement.innerHTML = "Player 1 Wins";
    displayTextElement.style.color = "black";
  } else if (player.health < enemy.health) {
    displayTextElement.innerHTML = "Player 2 Wins";
    displayTextElement.style.color = "black"; 
  }

  displayTextElement.style.display = "flex";
}

let timer = 60;
let timeId
function decreaseTimer() {
  if (timer > 0) {
    timeId = setTimeout(decreaseTimer, 1000);
    timer--
    document.querySelector("#timer").innerHTML = timer;
  }

  if (timer == 0) {
    determineWinner({player, enemy})
  }
}