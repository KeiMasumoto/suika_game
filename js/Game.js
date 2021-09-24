'use strict';
class Game {
  constructor() {
    this.engine = Matter.Engine; //物理シュミレーションおよびレンダリングを管理するコントローラーとなるメソッド
    this.runner = Matter.Runner;
    this.render = Matter.Render;
    this.bodies = Matter.Bodies; //一般的な剛体モデルを作成するメソッドを含む
    this.matterWorld = Matter.World; //物理演算領域の作成・操作するメソッドを含む
    this.composite = Matter.Composite; //物理演算領域の作成・操作するメソッドを含む
    this.events = Matter.Events;
    this.Engine = this.engine.create();
    this.World = this.Engine.world;

    this.canvas = document.getElementById("canvas");
    this.gamewrapper = document.getElementById("gameWrapper")
    this.endingTextBtn = document.getElementById("ending-text-wrapper");
    this.endingImgBtn = document.getElementById("ending-img");

    //ゲームの設定
    this.gameOverHeight = 300;//終了条件高さ
    this.scorePoint = 0;//得点
    this.setBall = null;

    //インスタンス生成
    this.wall = new Wall(this.bodies, this.matterWorld, this.composite, this.World);
    this.floor = new Floor(this.bodies, this.matterWorld, this.composite, this.World);
    this.ball = new Ball(this.bodies, this.matterWorld, this.World);
    this.screen = new Screen();
    this.AudioPlayer = new AudioPlayer();
    this.collisionBool = null;
  }

  //物理エンジンのレンダリング
  rendering() {
    const render = this.render.create( {
      canvas: this.canvas,
      element: document.body,
      engine: this.Engine,
      options: {
        wireframes: false,
        width: 320,
        height: 550,
        showAngleIndicator: false,
        background: "rgba(0, 0, 0 ,0)",
      },
    } );
    return render
  }

  //初期化
  init() {
    this.gamewrapper.appendChild(this.canvas);
    this.screen.init();//描画画面の初期化
    this.setBall = this.ball.set(this.data);//最初のボールの生成
  }
  // <=============================== 衝突検知 ===============================>
  collision() {
    const game = this;
      //ゲームエンジンでのコリジョン判定。ゲーム内に剛体として生成したオブジェクトを対象として衝突判定をしてくれている。今回は床、壁、ボール。
    game.events.on(game.Engine, "collisionStart", function(event) {
      if(game.collisionBool === "true"){
        const ballList = game.World.bodies.filter(ball => ball.label === "Circle Body"); //全ボールの取得
        if(event.pairs[0].bodyA.label === "Rectangle Body") {
          game.AudioPlayer.playSound("bound");
        }
        else if(event.pairs[0].bodyB.label === "Rectangle Body") {
          game.AudioPlayer.playSound("bound");
        }
        game.union(event);//同種のボールの合体
        game.ballHeight = game.maxHeight();//全ボールからもっともy座標の位置が高いものを取得
      };
    });
  }

  // <=============================== ボール合体 ===============================>
  union(event) {
    const game = this;
    const pairs = event.pairs;
    const ballA = pairs[0].bodyA;
    const ballB = pairs[0].bodyB;
    const balls = [ballA,ballB];
    let x = ballA.position.x;
    let y = ballA.position.y;
    if (ballA.circleRadius === ballB.circleRadius) {
      for(let i = 0; i < game.ball.imgs.length; i++){
        if(ballA.circleRadius === (game.ball.imgs[i].radius)) {
          y -= game.ball.imgs[i+1].radius;
          game.screen.visibleUnionEffect(x, y, game.ball.imgs[i+1].radius * 2, game.ball.imgs[i].name);
          game.AudioPlayer.playSound("union");
          game.ball.create(x + ((innerWidth - this.canvas.width) / 2), y, game.ball.imgs[i+1]);//衝突して合体したボールの半径より一つ大きいボールを生成
          game.removeBalls(balls);//差し替える
          game.scorePoint = game.scorePoint + ballA.circleRadius;//衝突して合体したボールの半径をとりあえず得点としている
          game.screen.addScore(game.scorePoint);
        }
      }
    }
  };

  // <=============================== 次弾を装填または装填しない ===============================>
  generate() {
    const ball = this.ball;
    const game = this;

    document.addEventListener("mousemove", (event) => {
      let x = event.pageX;
      const r = ball.data.radius;
      if((((innerWidth - this.canvas.width) / 2) + r) > x) {
        x = r;
      }
      else if((((innerWidth + this.canvas.width) / 2) - r) < x) {
        x = (((innerWidth + this.canvas.width) / 2) - r) - ((innerWidth - this.canvas.width) / 2);
      }
      else{
        x = event.pageX - ((innerWidth - this.canvas.width) / 2);
      }
      ball.position(x);//装填したボールをマウスに追従させる
    });

    game.canvas.addEventListener("click", (event) => {
      const x = event.pageX;
      ball.hiddenImg();
      ball.create(x, 30, game.ball.data);
      game.canvas.style.pointerEvents = "none";//ボールを落としてから次のボールが生成されるまで、ボールを落下させないようにする。

      //タイマーでクリック可能にしつつ、次弾装填
      const oldTime = Date.now();
      let time = null;
      let diff = null;
      const update = () => {
        time = Date.now();
        diff = time - oldTime;
        const id = requestAnimationFrame(update); 
        if(diff > 2000) {
          if(game.ballHeight < game.gameOverHeight) {//ある高さを積み上げたボールが超えるとゲーム終了
            const ballList = this.World.bodies.filter(ball => ball.label === "Circle Body"); //全ボールの取得
            game.collisionBool = "false";
            game.removeGameOverBalls(ballList);
          }
          else if(game.ballHeight < (game.gameOverHeight + 100)) {//ステージがいっぱいになり、終了条件に近づいていることを警告する
            this.setBall = ball.set();
            game.screen.visibleBar(game.gameOverHeight);
          }
          else {//何事もなくプレイング
            this.setBall = ball.set();
            game.screen.hiddenBar();
          }
          game.canvas.style.pointerEvents = "auto";
          cancelAnimationFrame(id);
        }
      };
      requestAnimationFrame(update); 
    });
  }

     // <=============================== ステージ上のボール全削除 ===============================>
  removeBalls(ballList) {
    for(let i = 0; i < ballList.length; i++)
      this.ball.removeBall(ballList[i]);
  }

  removeGameOverBalls(ballList) {
    let startTime = Date.now();
    let eleNum = 0;
    const game = this;
    game.screen.deleteBalls();
    if(game.collisionBool === "false") {
      const removeAllBalls = () => {
        const currentTime = Date.now();
        console.log()
        const id = requestAnimationFrame(removeAllBalls);
        if(eleNum === ballList.length) {
          cancelAnimationFrame(id);
          game.collisionBool = "true";
          game.screen.gameOver();
        };
        if(currentTime - startTime > 1000) {
          for(let i = 0; i < game.ball.imgs.length; i++) {
            if(ballList[eleNum].circleRadius === game.ball.imgs[i].radius) {
              game.AudioPlayer.playSound("union");
              game.screen.visibleUnionEffect(ballList[eleNum].position.x, ballList[eleNum].position.y, (game.ball.imgs[i].radius * 2), game.ball.imgs[i].name);
              this.ball.removeBall(ballList[eleNum]);
            }
          }
          eleNum += 1;
          startTime = Date.now();
        }
      };
      requestAnimationFrame(removeAllBalls);
    }
  }
     // <=============================== ボールの最高到達高さを算出 ===============================>
     //MaxHeight = ball.position.y + ball.radius
     //まず一番大きいボールを探す。
     //そのためにボールリストを作成
     //ボールリストを今度はposition.yで降べきに並び替え
     //indexの0を取得
  maxHeight() {
    const ballList = this.World.bodies.filter(ball => ball.label === "Circle Body");//剛体を管理するリストからボールのみを取り出して全ボールのリストを作成
    const yList = [];
    for(let i = 0;i < ballList.length; i++){
      yList.push(ballList[i].position.y);//全ボールからy座標を取得してそのリストを作成
    }
    const min = Math.min.apply(null, yList);//もっとも画面上部のy座標を取得
    const index = yList.indexOf(min);//もっとも画面上部にあるボールのインデックスを取得
    const height = ballList[index].position.y - ballList[index].circleRadius;//座標リストのインデックスからどのボールが一番上かを特定して、ボールの最上部の高さを算出する
    return height;
  }


  run() {
    this.collisionBool = "true";
    this.render.run(this.rendering());
    this.runner.run(this.Engine);
    this.wall.rightWall();
    this.wall.leftWall();
    this.floor.floor();
    this.init();
    this.generate();
    this.collision();
    this.endingTextBtn.addEventListener("click", () => {
      this.init();
    })
    this.endingImgBtn.addEventListener("click", () => {
      this.init();
    })
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const game = new Game();
  game.run();
});