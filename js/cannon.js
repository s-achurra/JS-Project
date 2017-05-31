class Cannon {
  constructor() {
    var cannon = new createjs.Shape();
    cannon.graphics.beginFill("DeepSkyBlue").drawRect(0, 0, 100, 50);
    cannon.x = 250;
    cannon.y = 700;
    stage.addChild(cannon);
  }
}

module.exports = Cannon;
