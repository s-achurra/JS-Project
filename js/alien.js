class Alien {
  constructor(x, y) {
    this.alien = new createjs.Shape();
    this.alien.graphics.beginFill("Red").drawRect(0,0,50,50);
    this.alien.x = x;
    this.alien.y = y;
    aliens.push(this.alien);
    stage.addChild(this.alien);
    this.handleAlienTick(alien);
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
      var pt = aliens[i].localToLocal(0, 0, cannon);
      // Check if Hit and remove if Hit
      if (cannon.hitTest(pt.x, pt.y)) {
        status = "LOST";
        pauseGame();
      }
    }
    // if the game is not in play mode don't push more events
    if (status === "PLAY") {
      stage.update();
      handleAlienTick(alien);
    }
  }, 1000))
  }

}

module.exports = Alien;
