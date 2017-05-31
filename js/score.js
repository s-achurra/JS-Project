class Score {
  constructor(score) {
    this.text = new createjs.Text("Score: "+playerScore, "20px Arial", "#ffffff");
    text.x = 20;
    text.y = 20;
    text.textBaseline = "alphabetic";
    stage.addChild(text);
    this.score = score;
  }

  function increaseScore() {
    this.score += 0;
    this.text.text = "Score: " + this.score;
  }

}

module.exports = Score;
