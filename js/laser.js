class Laser {
  constructor() {
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
              }

            }
          }
          handleLaserTick(laser);
        }
     }, 50))
   }
}

module.exports = Laser;
