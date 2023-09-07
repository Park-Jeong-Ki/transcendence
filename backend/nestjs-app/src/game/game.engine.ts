export class GameData {
  leftPaddle: number;
  rightPaddle: number;
  ballX: number;
  ballY: number;
  ballVecX: number;
  ballVecY: number;
  ballSpeed: number;
  score: [number, number];
  onGame: boolean;
  mode: number;
  isGamePaused: boolean;

  constructor() {
    (this.leftPaddle = 300),
      (this.rightPaddle = 300),
      (this.ballX = 400),
      (this.ballY = 300),
      (this.ballVecX = 5),
      (this.ballVecY = 0),
      (this.ballSpeed = 6),
      (this.score = [0, 0]),
      (this.onGame = false),
      (this.mode = 0),
      (this.isGamePaused = false);
  }

  public reset() {
    this.ballX = 400;
    this.ballY = 300;
    this.ballVecY = 0;
    this.ballSpeed = 6;

    this.isGamePaused = true;
    setTimeout(() => {
      this.isGamePaused = false;
    }, 1000);
  }

  advance(paddleDelta: number) {
    if (this.isGamePaused) {
      return;
    }
    let collidePoint: number;
    let angleRad: number;
    let speedModifier: number;
    this.ballX += this.ballVecX;
    this.ballY += this.ballVecY;

    // console.log(`BallX: ${this.ballX}, BallY: ${this.ballY}`);
    if (
      (this.ballVecY > 0 && paddleDelta > 0) ||
      (this.ballVecY < 0 && paddleDelta < 0)
    ) {
      speedModifier = 1 - paddleDelta * 0.001;
    } else {
      speedModifier = 1 + paddleDelta * 0.001;
    }

    if (this.ballY < 0 + 10) {
      if (this.ballVecY < 0) this.ballVecY = -this.ballVecY;
    } else if (this.ballY > 600 - 10) {
      if (this.ballVecY > 0) this.ballVecY = -this.ballVecY;
    }

    if (this.ballX < 0) {
      if (
        this.ballY >= this.leftPaddle &&
        this.ballY <= this.leftPaddle + 100
      ) {
        collidePoint = (this.ballY - (this.leftPaddle + 50)) / 50;
        angleRad = (Math.PI / 4) * collidePoint;
        this.ballVecX = this.ballSpeed * Math.cos(angleRad);
        this.ballVecY = this.ballSpeed * Math.sin(angleRad);
        this.ballSpeed *= speedModifier;
        if (this.ballSpeed > 9) {
          this.ballSpeed = 9;
        }
      } else {
        this.score[1]++;
        this.ballVecX = -5;
        this.reset();
      }
    } else if (this.ballX > 800) {
      if (
        this.ballY >= this.rightPaddle &&
        this.ballY <= this.rightPaddle + 100
      ) {
        collidePoint = (this.ballY - (this.rightPaddle + 50)) / 50;
        angleRad = (Math.PI / 4) * collidePoint;
        this.ballVecX = -1 * this.ballSpeed * Math.cos(angleRad);
        this.ballVecY = this.ballSpeed * Math.sin(angleRad);
        this.ballSpeed *= speedModifier;
        if (this.ballSpeed > 9) {
          this.ballSpeed = 9;
        }
      } else {
        this.score[0]++;
        this.ballVecX = 5;
        this.reset();
      }
    }
  }
}
