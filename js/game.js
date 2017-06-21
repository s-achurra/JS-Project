function init() {

  board = document.getElementById("board");
  var stage = new createjs.Stage(board);

  var aliens = [];
  var lasers = [];
  var alienLasers = [];
  var timeouts = [];
  var status = "PLAY";
  var playerScore = 0;

  var cannon = new createjs.Bitmap("./res/cannon.png");
  cannon.scaleX = .4;
  cannon.scaleY = .4;
  cannon.x = 250;
  cannon.y = 700;
  stage.addChild(cannon);

  var score = new createjs.Text("Score: "+playerScore, "12px gameFont", "#ffffff");
  score.x = 20;
  score.y = 25;
  score.textBaseline = "alphabetic";
  stage.addChild(score);

  stage.update();

  var KEYCODE_LEFT = 37,
    KEYCODE_RIGHT = 39,
    SPACE = 32,
    ENTER = 13;

  function keyPressed(event) {
    switch(event.keyCode) {
      case KEYCODE_LEFT:
      if (cannon.x - 10 > 0) {
        cannon.x -= 10;
      }
        break;
      case KEYCODE_RIGHT:
      if (cannon.x + 100 + 10 < board.width - 10) {
        cannon.x += 10;
      }
        break;
      case SPACE:
        createLaser(cannon.x + 60);
        break;
    }
    stage.update();
  }

// #############
// ### Lasers ##
// #############

  function createLaser (x) {
    var laser = new createjs.Shape();
    laser.graphics.beginFill("Green").drawRect(0,0,5,20);
    laser.x = x;
    laser.y = 680;
    stage.addChild(laser);
    lasers.push(laser)
    handleLaserTick(laser);
  }

  function handleLaserTick(laser) {
    timeouts.push (
    setTimeout(function () {
      laser.y -= 10;
      stage.update();
        if (laser.y > -20) {
          for (var i = 0; i < aliens.length; i++) {
            var pt = laser.localToLocal(0, 0, aliens[i]);
            // Check if Hit and remove if Hit
            if (aliens[i].hitTest(pt.x, pt.y)) {
              playerScore += 10;
              score.text = "Score: " + playerScore;
              stage.update();
              stage.removeChild(aliens[i]);
              stage.removeChild(laser);
              aliens.splice(i, 1);
              laser.y = -20;

              if (aliens.length === 0) {
                status = "WON";
                pauseGame();
                removeHidden("won");
                addHidden("pause");
              }

            }
          }
          handleLaserTick(laser);
        }
     }, 50))
   }

// #############
// ### Aliens ##
// #############

  function setupAliens() {
    let x = 20;
    let y = 20;

    for (var j = 0; j < 3; j++) {
      for (var i = 0; i < 5; i++) {
        createAlien(x, y);
        x += 100;
      }
      x = 20;
      y += 100;
    }
    stage.update();
  }

  function createAlien(x, y) {
    var alien = new createjs.Bitmap("./res/Space_invaders_alien.svg.png");
    alien.scaleX = .03;
    alien.scaleY = .03;
    alien.x = x;
    alien.y = y;
    aliens.push(alien);
    stage.addChild(alien);
    handleAlienTick(alien); //toggled off alien movement
  }

  function handleAlienTick(alien) {
    timeouts.push (
    setTimeout(function () {
      for (var i = 0; i < aliens.length; i++) {

        if (aliens[i].x + 10 + 50 < 600) {
          aliens[i].x += 10;
        } else if (aliens[i].y < 800) {
        aliens[i].y += 100;
        aliens[i].x = 20;
      }

      if (Math.random() < .005) {
        createAlienLaser(aliens[i]);
      }

      var pt = aliens[i].localToLocal(0, 0, cannon);
      // Check if Hit and remove if Hit
      if (cannon.hitTest(pt.x, pt.y)) {
        status = "LOST";
        pauseGame();
        removeHidden("loss");
        addHidden("pause");
      }
    }
    // if the game is not in play mode don't push more events
    if (status === "PLAY") {
      stage.update();
      handleAlienTick(alien);
    }
  }, 2000))
  }

// ###################
// ### Alien Lasers ##
// ###################

function createAlienLaser (alien) {
  var laser = new createjs.Shape();
  laser.graphics.beginFill("Green").drawRect(0,0,5,20);
  laser.x = alien.x;
  laser.y = alien.y;
  stage.addChild(laser);
  alienLasers.push(laser)
  handleAlienLaserTick(laser);
}

function handleAlienLaserTick(laser) {
  timeouts.push (
  setTimeout(function () {
    laser.y += 10;
    stage.update();
      if (laser.y < board.height + 20) {
        var pt = laser.localToLocal(0,0, cannon);
        if (cannon.hitTest(pt.x,pt.y)) {
          status = "LOST";
          pauseGame();
          removeHidden("loss");
          addHidden("pause");
        }
        if (status === "PLAY") {
          handleAlienLaserTick(laser);
        }
      }
   }, 50))
 }

// ##############
// ### Utility ##
// ##############

  function pauseGame() {
    if (timeouts) {
      for (var i = 0; i < timeouts.length; i++) {
        clearTimeout(timeouts[i]);
      }
    }
    timeouts = [];
  }

  function restartGame() {
    if (aliens) {
      for (var i = 0; i < aliens.length; i++) {
        handleAlienTick(aliens[i]);
      }
    }
    if (lasers) {
      for (var i = 0; i < lasers.length; i++) {
        handleLaserTick(lasers[i]);
      }
    }
    if (alienLasers) {
      for (var i = 0; i < alienLasers.length; i++) {
        handleAlienLaserTick(alienLasers[i]);
      }
    }
  }

  function togglePause() {

    if (document.getElementById("pause").className === "hidden") {
      document.getElementById("resume").className = "hidden";
      document.getElementById("pause").className = "";
      restartGame();
    } else {
      document.getElementById("pause").className = "hidden";
      document.getElementById("resume").className = "";
      pauseGame();
    }
  }

  function addHidden(id) {
    document.getElementById(`${id}`).className += " hidden";
  }

  function removeHidden(id) {
    var classes = document.getElementById(`${id}`).className.split(" ");
    classes.splice(classes.length - 1, 1);
    document.getElementById(`${id}`).className = classes.join(" ");
  }

  function startGame() {
    setupAliens();
    addHidden("start");
    removeHidden("pause")
  }

  function resetGame() {
    if (aliens) {
      for (var i = 0; i < aliens.length; i++) {
        stage.removeChild(aliens[i]);
      }
    }

    if (lasers) {
      for (var i = 0; i < lasers.length; i++) {
        stage.removeChild(lasers[i]);
      }
    }

    if (alienLasers) {
      for (var i = 0; i < alienLasers.length; i++) {
        stage.removeChild(alienLasers[i]);
      }
    }

    aliens = [];
    lasers = [];
    alienLasers = [];
    timeouts = [];
    status = "PLAY";
    playerScore = 0;
    score.text = "Score: " + playerScore;
    addHidden("loss");
    removeHidden("pause")
    setupAliens();
  }

  function continueGame() {
    if (lasers) {
      for (var i = 0; i < lasers.length; i++) {
        stage.removeChild(lasers[i]);
      }
    }
    aliens = [];
    lasers = [];
    timeouts = [];
    status = "PLAY";
    addHidden("won");
    removeHidden("pause")
    setupAliens();
  }

// #############
// ### Events ##
// #############

  document.getElementById("startButton").addEventListener("click", startGame);
  document.getElementById("resetButton").addEventListener("click", resetGame);
  document.getElementById("continueButton").addEventListener("click", continueGame);
  document.getElementById("pause").addEventListener("click", togglePause);
  document.getElementById("resume").addEventListener("click", togglePause);

  this.document.onkeydown = keyPressed;

}
