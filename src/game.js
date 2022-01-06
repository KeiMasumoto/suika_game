'use strict';
import "./style.scss"
const Matter = require('./matter.js')
import { Wall } from "./rigid-body";
import { Floor } from "./rigid-body";
import { Ball } from "./ball";
import { Screen } from "./screen";
import { AudioPlayer } from "./audio-player";

class Game {
  constructor() {
    this.engine = Matter.Engine; // 物理シュミレーションおよびレンダリングを管理するコントローラーとなるメソッド
    this.runner = Matter.Runner;
    this.render = Matter.Render;
    this.bodies = Matter.Bodies; // 一般的な剛体モデルを作成するメソッドを含む
    this.matterWorld = Matter.World; // 物理演算領域の作成・操作するメソッドを含む
    this.composite = Matter.Composite; // 物理演算領域の作成・操作するメソッドを含む
    this.events = Matter.Events; // 物理演算領域の作成・操作するメソッドを含む
    this.Engine = this.engine.create(); // 物理シミュレーションの演算を担う機能を用意する
    this.World = this.Engine.world; // 物理シミュレーションを行う環境を用意する

    this.canvas = document.getElementById("canvas");
    this.startWrapper = document.getElementById("start-text-wrapper");
    this.forCanvasHighResolution = 3;
    this.start = document.getElementById("start-text");
    this.gameWrapper = document.getElementById("gameWrapper");
    this.endingTextBtn = document.getElementById("ending-text-wrapper");
    this.endingImgBtn = document.getElementById("ending-img");

    // ゲームの設定
    this.gameOverHeight = null; // 終了条件高さ
    this.scorePoint = 0; // 得点
    this.setBall = null;
    this.positionYList = [];

    // インスタンス生成
    this.wall = new Wall(this.bodies, this.composite, this.World);
    this.floor = new Floor(this.bodies, this.composite, this.World);
    this.ball = new Ball(this.bodies, this.matterWorld, this.World, this.gameOverHeight, this.forCanvasHighResolution);
    this.screen = new Screen(this.forCanvasHighResolution);
    this.AudioPlayer = null;
    this.collisionBool = true;
    this.isCollisionAnimation = false;

    this.soundOn = true;
  }

  // 物理エンジンのレンダリング
  rendering() {
    // 物理シミュレーションを噛ませたキャンバスの設定を行う
    const render = this.render.create({
      canvas: this.canvas,
      element: document.body,
      engine: this.Engine,
      options: {
        wireframes: false,
        width: 320 * this.forCanvasHighResolution,
        height: 550 * this.forCanvasHighResolution,
        showAngleIndicator: false,
        background: "rgba(0, 0, 0 ,0)",
      },
    });

    this.gameOverHeight = (this.canvas.height / this.forCanvasHighResolution) * 0.1; // 終了条件高さ

    return render
  }

  // 初期化
  init() {
    // 初期化するべき対象
    const ballList = this.World.bodies.filter(ball => ball.label === "Circle Body"); // 全ボールの取得
    ballList.length = 0; // 物理シミュレーションを噛ませているボールのリスト
    this.gameWrapper.appendChild(this.canvas);
    this.screen.init(); // 描画画面の初期化 // 得点の初期化
    this.setBall = this.ball.set(this.data); // 最初のボールの生成
  }
  // <=============================== 衝突検知 ===============================>
  collision() {
    const game = this;
    // ゲームエンジンでのコリジョン判定。ゲーム内に剛体として生成したオブジェクトを対象として衝突判定をしてくれている。今回は床、壁、ボール。
    game.events.on(game.Engine, "collisionStart", function(event) {
      if (game.collisionBool) {
        for (let i = 0; i < event.pairs.length; i++) {
          const pairs = event.pairs; // 衝突している二つの物体
          const ballA = pairs[i].bodyA; // 衝突している二つの物体のうちの片方
          const ballB = pairs[i].bodyB; // 衝突している二つの物体のうちの片方
          if (game.soundOn) {  // 衝突はボールが重なるとずっと起こってしまうので落としたボールと下にあるボールがぶつかった初回のみサウンドをオンにする
            if (ballA.id === game.World.bodies[game.World.bodies.length - 1].id || ballB.id === game.World.bodies[game.World.bodies.length - 1].id) {
              game.AudioPlayer.playSound("bound");
              game.soundOn = false;
            }
          }
          if (ballA.circleRadius != 0 && ballB.circleRadius != 0) {
            game.union(ballA, ballB); // 同種のボールの合体
          }
          game.ballHeight = game.maxHeight(); // 全ボールからもっともy座標の位置が高いものを取得
        }
      };
    });
  }

  colliding() { // collisionは衝突が起こった瞬間に発火するが、こちらは衝突中時に発火する衝突判定、内容はcollisionと同じ。
    const game = this;
    // ゲームエンジンでのコリジョン判定。ゲーム内に剛体として生成したオブジェクトを対象として衝突判定をしてくれている。今回は床、壁、ボール。
    game.events.on(game.Engine, "collisionActive", function(event) {
      if (game.collisionBool) {
        for (let i = 0; i < event.pairs.length; i++) {
          const pairs = event.pairs;
          const ballA = pairs[i].bodyA;
          const ballB = pairs[i].bodyB;
          if (game.soundOn) {
            if (ballA.id === game.World.bodies[game.World.bodies.length - 1].id || ballB.id === game.World.bodies[game.World.bodies.length - 1].id) {
              game.AudioPlayer.playSound("bound");
              game.soundOn = false;
            }
          }
          if (ballA.circleRadius != 0 && ballB.circleRadius != 0) {
            game.union(ballA, ballB);// 同種のボールの合体
          }
          game.ballHeight = game.maxHeight();// 全ボールからもっともy座標の位置が高いものを取得
        }
      };
    });
  }

  // <=============================== ボール合体 ===============================>
  union(ballA, ballB) { // 同種のボールを合体させる
    const game = this;

    if (game.isCollisionAnimation) { // ボールの合体に少しのラグを出すことで消滅が連鎖しているような表現を行うために一度、合体が起こったらブレイクさせる
      return;
    }

    const balls = [ballA, ballB];
    let x = ballA.position.x / this.forCanvasHighResolution; // ボールのx座標を実際に描画されているサイズに合わせる
    let y = ballA.position.y; // ボールのy座標は実際に描画されるサイズとキャンバスのサイズ両方ほしいのでそのままにしておく

    if (ballA.circleRadius === ballB.circleRadius) { // 衝突したボールのサイズが同一だった時

      for (let j = 0; j < game.ball.imgs.length; j++) {
        if (ballA.circleRadius === (game.ball.imgs[j].radius * this.forCanvasHighResolution) && (j + 1) < game.ball.imgs.length) {
          y -= game.ball.imgs[j + 1].radius;
          // ボールが消失する際の飛沫のエフェクトの描画
          game.screen.showUnionEffect(x, y / this.forCanvasHighResolution, game.ball.imgs[j+1].radius * 2, game.ball.imgs[j].name);
          // ボールが消失する際の音の再生
          game.AudioPlayer.playSound("union");
          // 衝突して合体したボールの半径より一つ大きいボールを生成
          game.ball.create(x + ((innerWidth - (this.canvas.width / this.forCanvasHighResolution)) / 2), y, game.ball.imgs[j + 1]);
          // 差し替える
          game.removeBalls(balls);
          // 衝突して合体したボールの半径をとりあえず得点としている
          game.scorePoint = game.scorePoint + ballA.circleRadius;
          // スコアに加算する
          game.screen.addScore(game.scorePoint);
          // 繰り返しをここで一度ブレイクする
          game.isCollisionAnimation = true;
          setTimeout (() => {
            game.isCollisionAnimation = false;
          } ,80);
        } else if (j === game.ball.imgs.length) { // すいかが一番大きいボールで合体イベントが起こらない

          // game.screen.showUnionEffect(x, y, game.ball.imgs[j+1].radius * 2, game.ball.imgs[j].name);
          // game.AudioPlayer.playSound("union");
          // game.removeBalls(balls); // 差し替える
          // game.scorePoint = game.scorePoint + ballA.circleRadius; // 衝突して合体したボールの半径をとりあえず得点としている
          // game.screen.addScore(game.scorePoint);
          game.isCollisionAnimation = true;
        }
      }
    }

  };

  // <=============================== 次弾を装填または装填しない ===============================>
  generate() {
    const ball = this.ball;
    const game = this;

    document.addEventListener("mousemove", (event) => { // マウスのムーブに落下を控えている果物を追従させる
      let x = event.pageX;
      const r = ball.data.radius;
      if ((((innerWidth - (this.canvas.width / this.forCanvasHighResolution)) / 2) + r) > x) { // ステージ内なら自由に動かすことができる
        x = r;
      } else if ((((innerWidth + (this.canvas.width / this.forCanvasHighResolution)) / 2) - r) < x) { // 端にいった時にステージ内に留める
        x = (((innerWidth + (this.canvas.width / this.forCanvasHighResolution)) / 2) - r) - ((innerWidth - (this.canvas.width / this.forCanvasHighResolution)) / 2);
      } else { // 端にいった時にステージ内に留める
        x = event.pageX - ((innerWidth - (this.canvas.width / this.forCanvasHighResolution)) / 2);
      }
      ball.position(x);// 装填したボールをマウスに追従させる
    });

    game.canvas.addEventListener("click", (event) => { // 落としたい位置をクリックしたら
      const x = event.pageX;
      game.soundOn = true;
      ball.create(x, 30 * this.forCanvasHighResolution, game.ball.data); // 物理シミュレーション上に果物を生成する
      ball.hiddenImg(); // imgで自由に動かせるように描画していた果物を削除する
      // ボールを落としてから次のボールが生成されるまで、ボールを落下させないようにする。
      this.screen.pointerEventsOff(game.canvas); // クリックをキャンセルし、連続で果物をだせないようにする

      // タイマーでクリック可能にしつつ、次弾装填
      const oldTime = Date.now();
      let time = null;
      let diff = null;
      const update = () => {
        time = Date.now();
        diff = time - oldTime;
        const id = requestAnimationFrame(update);
        if (diff > 2000) { // 2秒後にクリックを許可する
          if (game.ballHeight < game.gameOverHeight) { // ある高さを積み上げたボールが超えるとゲーム終了
            this.positionYList = [];
            const ballList = this.World.bodies.filter(ball => ball.label === "Circle Body"); // 全ボールの取得
            game.screen.showBar(game.gameOverHeight);
            console.log(ballList);
            game.collisionBool = false;
            game.screen.showRemovingBallView();
            game.removeGameOverBalls(ballList);
          }
          else if (game.ballHeight < (game.gameOverHeight + 100)) { // ステージがいっぱいになり、終了条件に近づいていることを警告する
            this.setBall = ball.set();
            game.screen.showBar(game.gameOverHeight);
            this.screen.pointerEventsOn(game.canvas);
          }
          else { // 何事もなくプレイング
            this.setBall = ball.set();
            game.screen.hiddenBar();
            this.screen.pointerEventsOn(game.canvas);
          }
          cancelAnimationFrame(id);
        }
      };
      requestAnimationFrame(update);
    });
  }

  // <=============================== ステージ上のボール全削除 ===============================>
  removeBalls(ballList) {
    for (let i = 0; i < ballList.length; i++)
      this.ball.removeBall(ballList[i]);
  }

  removeGameOverBalls(ballList) { // ゲームオーバー時に果物を時間差を持って順番に削除する
    let startTime = Date.now();
    let eleNum = 0;
    const game = this;
    if (!game.collisionBool) {
      const removeAllBalls = () => {
        const currentTime = Date.now();
        const id = requestAnimationFrame(removeAllBalls);

        if (currentTime - startTime > 250 && ballList[eleNum]) {
          for (let i = 0; i < game.ball.imgs.length; i++) {
            if ((ballList[eleNum].circleRadius / this.forCanvasHighResolution) === game.ball.imgs[i].radius) {
              game.AudioPlayer.playSound("union");
              game.screen.showUnionEffect(ballList[eleNum].position.x / this.forCanvasHighResolution, ballList[eleNum].position.y / this.forCanvasHighResolution, (game.ball.imgs[i].radius * 2), game.ball.imgs[i].name);
              this.ball.removeBall(ballList[eleNum]);
            }
          }
          eleNum += 1;
          startTime = Date.now();
        }
        else if (!ballList[eleNum]) {
          game.collisionBool = true;
          eleNum = 0;
          game.screen.showGameOverView();
          cancelAnimationFrame(id);
        }

      };
      requestAnimationFrame(removeAllBalls);
    }
  }
  // <=============================== ボールの最高到達高さを算出 ===============================>
  // MaxHeight = ball.position.y + ball.radius
  // まず一番大きいボールを探す。
  // そのためにボールリストを作成
  // ボールリストを今度はposition.yで降べきに並び替え
  // indexの0を取得
  maxHeight() {
    const ballList = this.World.bodies.filter(ball => ball.label === "Circle Body"); // 剛体を管理するリストからボールのみを取り出して全ボールのリストを作成
    this.positionYList = [];
    for (let i = 0;i < ballList.length; i++) {
      this.positionYList.push(ballList[i].position.y); // 全ボールからy座標を取得してそのリストを作成
    }
    const min = Math.min.apply(null, this.positionYList); // もっとも画面上部のy座標を取得
    const index = this.positionYList.indexOf(min); // もっとも画面上部にあるボールのインデックスを取得
    let height = innerHeight;
    if (ballList.length > 1) {
      if (ballList[index]) {
        height =(ballList[index].position.y / this.forCanvasHighResolution) - ballList[index].circleRadius; // 座標リストのインデックスからどのボールが一番上かを特定して、ボールの最上部の高さを算出する
      }
    }

    return height;
  }


  run() { // ゲーム開始
    this.start.addEventListener("click", () => { // スタートボタンを押すと下記発火
      this.start.style.display = "none"; // スタートボタンの非表示
      this.startWrapper.style.display = "none";
      this.AudioPlayer = new AudioPlayer(); // オーディオが非同期だと許可がおりないのでここで生成する
      this.AudioPlayer.playFirstSound("union");
    });
    this.render.run(this.rendering());
    this.runner.run(this.Engine);
    this.wall.rightWall();
    this.wall.leftWall();
    this.floor.floor();
    this.init();
    this.generate();
    this.collision();
    this.colliding();
    this.endingTextBtn.addEventListener("click", () => {
      this.init();
    })
    this.endingImgBtn.addEventListener("click", () => {
      this.init();
    })
  }
}

const touchEventController = () => {
  document.documentElement.addEventListener('touchstart', function (e) {
    // Disable Pinch in/out zoom
    if (e.touches.length >= 2) { e.preventDefault(); }
  }, {passive: false});
};

document.addEventListener("DOMContentLoaded", () => {
  const game = new Game();
  touchEventController();
  game.run();
});