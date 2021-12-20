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
    this.startWrapper = document.getElementById("start-text-wrapper");
    this.start = document.getElementById("start-text");
    this.gameWrapper = document.getElementById("gameWrapper")
    this.endingTextBtn = document.getElementById("ending-text-wrapper");
    this.endingImgBtn = document.getElementById("ending-img");

    //ゲームの設定
    this.gameOverHeight = null;//終了条件高さ
    this.scorePoint = 0;//得点
    this.setBall = null;
    this.positionYList = [];

    //インスタンス生成
    this.wall = new Wall(this.bodies, this.matterWorld, this.composite, this.World);
    this.floor = new Floor(this.bodies, this.matterWorld, this.composite, this.World);
    this.ball = new Ball(this.bodies, this.matterWorld, this.World, this.gameOverHeight);
    this.screen = new Screen();
    this.AudioPlayer = null;
    this.collisionBool = true;
    this.isCollisionAnimation = false;

    this.soundOn = true;
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

    this.gameOverHeight = this.canvas.height * 0.1;//終了条件高さ
    console.log(this.gameOverHeight);

    return render
  }

  //初期化
  init() {
    // 初期化するべき対象
    // 物理シミュレーションを噛ませているボールのリスト
    // 得点
    const ballList = this.World.bodies.filter(ball => ball.label === "Circle Body"); //全ボールの取得
    ballList.length = 0;
    this.gameWrapper.appendChild(this.canvas);
    this.screen.init();//描画画面の初期化// 得点の初期化
    this.setBall = this.ball.set(this.data);//最初のボールの生成
  }
  // <=============================== 衝突検知 ===============================>
  collision() {
    const game = this;
      //ゲームエンジンでのコリジョン判定。ゲーム内に剛体として生成したオブジェクトを対象として衝突判定をしてくれている。今回は床、壁、ボール。
    game.events.on(game.Engine, "collisionStart", function(event) {
      if(game.collisionBool)
      {
        // if(game.soundOn)
        // {
        for (let i = 0; i < event.pairs.length; i++)
        {
          const pairs = event.pairs;
          const ballA = pairs[i].bodyA;
          const ballB = pairs[i].bodyB;
          if(game.soundOn)
          {
            if(ballA.id === game.World.bodies[game.World.bodies.length - 1].id || ballB.id === game.World.bodies[game.World.bodies.length - 1].id)
            {
              game.AudioPlayer.playSound("bound");
              game.soundOn = false;
            }
          }
          if (ballA.circleRadius != 0 && ballB.circleRadius != 0)
          {
            game.union(ballA, ballB);//同種のボールの合体
          }
          game.ballHeight = game.maxHeight();//全ボールからもっともy座標の位置が高いものを取得
        }

        // let time = 0;
        // const timeLag = () => {
        //   const pairs = event.pairs;
        //   if (typeof pairs[time] != "undefined") {
        //     console.log(pairs[time]);
        //     const ballA = pairs[time].bodyA;
        //     const ballB = pairs[time].bodyB;
        //     if (game.soundOn) {
        //       if (ballA.id === game.World.bodies[game.World.bodies.length - 1].id || ballB.id === game.World.bodies[game.World.bodies.length - 1].id) {
        //         game.AudioPlayer.playSound("bound");
        //         game.soundOn = false;
        //       }
        //     }
        //     if (ballA.circleRadius != 0 && ballB.circleRadius != 0) {
        //       game.union(ballA, ballB);//同種のボールの合体
        //     }
        //     game.ballHeight = game.maxHeight();//全ボールからもっともy座標の位置が高いものを取得
            
        //     if (time < event.pairs.length) {
        //       setTimeout (() => {
        //         time += 1;
        //         timeLag();
        //       }, 200)
        //     }
        //   } else {
        //     if (time < event.pairs.length) {
        //       setTimeout (() => {
        //         time += 1;
        //         timeLag();
        //       }, 200)
        //     }
        //   }
        // }

        // timeLag();

      };
    });
  }

  colliding() {
    const game = this;
      //ゲームエンジンでのコリジョン判定。ゲーム内に剛体として生成したオブジェクトを対象として衝突判定をしてくれている。今回は床、壁、ボール。
    game.events.on(game.Engine, "collisionActive", function(event) {
      if(game.collisionBool)
      {
        // if(game.soundOn)
        // {
        for (let i = 0; i < event.pairs.length; i++)
        {
          const pairs = event.pairs;
          const ballA = pairs[i].bodyA;
          const ballB = pairs[i].bodyB;
          if(game.soundOn)
          {
            if(ballA.id === game.World.bodies[game.World.bodies.length - 1].id || ballB.id === game.World.bodies[game.World.bodies.length - 1].id)
            {
              game.AudioPlayer.playSound("bound");
              game.soundOn = false;
            }
          }
          if (ballA.circleRadius != 0 && ballB.circleRadius != 0)
          {
            game.union(ballA, ballB);//同種のボールの合体
          }
          game.ballHeight = game.maxHeight();//全ボールからもっともy座標の位置が高いものを取得
        }
      };
    });
  }

  // <=============================== ボール合体 ===============================>
  union(ballA, ballB) {
    const game = this;
    if (game.isCollisionAnimation) {
      return;
    }
    const balls = [ballA, ballB];
    let x = ballA.position.x;
    let y = ballA.position.y;
    if (ballA.circleRadius === ballB.circleRadius) {
      console.log("========= union ==========");
      for (let j = 0; j < game.ball.imgs.length; j++) {
        if (ballA.circleRadius === (game.ball.imgs[j].radius) && (j + 1) < game.ball.imgs.length) {
          y -= game.ball.imgs[j + 1].radius;
          // game.screen.visibleUnionEffect(x, y, game.ball.imgs[j+1].radius * 2, game.ball.imgs[j].name);
          game.screen.visibleUnionEffect(x, y, game.ball.imgs[j+1].radius * 2.5, game.ball.imgs[j].name);
          game.AudioPlayer.playSound("union");
          game.ball.create(x + ((innerWidth - this.canvas.width) / 2), y, game.ball.imgs[j + 1]);//衝突して合体したボールの半径より一つ大きいボールを生成
          game.removeBalls(balls);//差し替える
          game.scorePoint = game.scorePoint + ballA.circleRadius;//衝突して合体したボールの半径をとりあえず得点としている
          game.screen.addScore(game.scorePoint);
          game.isCollisionAnimation = true;
          setTimeout (() => {
            game.isCollisionAnimation = false;
          } ,80);
        }
        else if (j === game.ball.imgs.length)
        {
          game.screen.visibleUnionEffect(x, y, game.ball.imgs[j+1].radius * 2, game.ball.imgs[j].name);
          game.AudioPlayer.playSound("union");
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
      else {
        x = event.pageX - ((innerWidth - this.canvas.width) / 2);
      }
      ball.position(x);//装填したボールをマウスに追従させる
    });

    game.canvas.addEventListener("click", (event) => {
      const x = event.pageX;
      game.soundOn = true;
      ball.create(x, 30, game.ball.data);
      ball.hiddenImg();
      // game.canvas.style.pointerEvents = "none";//ボールを落としてから次のボールが生成されるまで、ボールを落下させないようにする。
      this.screen.pointerEventsOff(game.canvas);

      //タイマーでクリック可能にしつつ、次弾装填
      const oldTime = Date.now();
      let time = null;
      let diff = null;
      const update = () => {
        time = Date.now();
        diff = time - oldTime;
        const id = requestAnimationFrame(update);
        if(diff > 2000) {
          if(game.ballHeight < game.gameOverHeight) { //ある高さを積み上げたボールが超えるとゲーム終了
            this.positionYList = [];
            const ballList = this.World.bodies.filter(ball => ball.label === "Circle Body"); //全ボールの取得
            game.collisionBool = false;
            game.screen.visibleBar(game.gameOverHeight);
            game.removeGameOverBalls(ballList);
          }
          else if(game.ballHeight < (game.gameOverHeight + 100)) { //ステージがいっぱいになり、終了条件に近づいていることを警告する
            this.setBall = ball.set();
            game.screen.visibleBar(game.gameOverHeight);
            this.screen.pointerEventsOn(game.canvas);
          }
          else {//何事もなくプレイング
            this.setBall = ball.set();
            game.screen.hiddenBar();
            // game.canvas.style.pointerEvents = "auto";
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
    for(let i = 0; i < ballList.length; i++)
      this.ball.removeBall(ballList[i]);
  }

  removeGameOverBalls(ballList) {
    let startTime = Date.now();
    let eleNum = 0;
    const game = this;
    game.screen.deleteBalls();
    if(!game.collisionBool) {
      const removeAllBalls = () => {
        const currentTime = Date.now();
        const id = requestAnimationFrame(removeAllBalls);
        if(eleNum === ballList.length) {
          cancelAnimationFrame(id);
          game.collisionBool = true;
          game.screen.gameOver();
        };
        if(currentTime - startTime > 500) {
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
    // const yList = [];
    this.positionYList = [];
    for(let i = 0;i < ballList.length; i++){
      this.positionYList.push(ballList[i].position.y);//全ボールからy座標を取得してそのリストを作成
    }
    const min = Math.min.apply(null, this.positionYList);//もっとも画面上部のy座標を取得
    const index = this.positionYList.indexOf(min);//もっとも画面上部にあるボールのインデックスを取得
    let height = innerHeight;
    if(ballList.length > 1)
    {
      if (ballList[index])
      {
        height = ballList[index].position.y - ballList[index].circleRadius;//座標リストのインデックスからどのボールが一番上かを特定して、ボールの最上部の高さを算出する
      }
    }

    return height;
  }


  run() {
    this.start.addEventListener("click", () => {
      this.start.style.display = "none";
      this.startWrapper.style.display = "none";
      this.AudioPlayer = new AudioPlayer();
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

document.addEventListener("DOMContentLoaded", () => {
  const game = new Game();
  game.run();
});

const touchEventController = () => {
  document.documentElement.addEventListener('touchstart', function (e) {
    // Disable Pinch in/out zoom
    if (e.touches.length >= 2) { e.preventDefault(); }
  }, {passive: false});

  gameView.addEventListener('touchstart', function (e) {
    // Clear touch
    touchStartX = e.touches[0].pageX;
    touchStartY = e.touches[0].pageY;
    swipedir = 'none'
    startTime = new Date().getTime() // record time when finger first makes contact with surface
  }, {passive: false});

  // // Disable double touch zoom
  let t = 0;
  document.addEventListener('touchend', function (e) {
    var now = new Date().getTime();
    if (e.target.id === 'gameView') {
      // Do not detect as double tap
    }  else if ((now - t) < 350){
      e.preventDefault(); 
å
    }
    t = now;
  });

  gameView.addEventListener('touchend', function (e) {
    var now = new Date().getTime();
    let distX = touchEndX - touchStartX;
    let distY = touchEndY - touchStartY;
    elapsedTime = now - startTime // get time elapsed
    //elapsedTimeはタッチスタートからタッチエンドまでの時間
    //allowedTimeで長すぎるタッチを排除している
    if (elapsedTime <= allowedTime) { // first condition for swipe met

      //distが大きい軸方向に対してフリック判定を与える
      if (Math.abs(distX) >= threshold && Math.abs(distY) <= Math.abs(distX)) { // 2nd condition for horizontal swipe met
          swipedir = (distX < 0)? 'left' : 'right' // if dist traveled is negative, it indicates left swipe
      }
      else if (Math.abs(distY) >= threshold && Math.abs(distX) <= Math.abs(distY)) { // 2nd condition for vertical swipe met
          swipedir = (distY < 0)? 'up' : 'down' // if dist traveled is negative, it indicates up swipe
      }

      if (swipedir === 'up') {
          document.dispatchEvent(swipeUp);
      } else if (swipedir === 'down') {
          document.dispatchEvent(swipeDown);
      } else if (swipedir === 'left') {
          document.dispatchEvent(swipeLeft);
      } else if (swipedir === 'right') {
          document.dispatchEvent(swipeRight);
      }
    }
  }, false);

  // Prevent scroll
  gameView.addEventListener('touchmove', function(e) {
    touchEndX = e.touches[0].pageX;
    touchEndY = e.touches[0].pageY;
  });
};