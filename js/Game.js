'use strict';
class Game{
  constructor(){
    this.engine = Matter.Engine; //物理シュミレーションおよびレンダリングを管理するコントローラーとなるメソッド
    this.runner = Matter.Runner;
    this.render = Matter.Render;
    this.bodies = Matter.Bodies; //一般的な剛体モデルを作成するメソッドを含む
    this.matterWorld = Matter.World; //物理演算領域の作成・操作するメソッドを含む
    this.composite = Matter.Composite; //物理演算領域の作成・操作するメソッドを含む
    this.composites = Matter.Composites; //物理演算領域の作成・操作するメソッドを含む
    this.events = Matter.Events;
    this.Engine = this.engine.create();
    this.World = this.Engine.world;
    this.canvas = document.getElementById("canvas");
    this.stage = new Stage(this.engine, this.runner, this.render, this.bodies, this.matterWorld, this.composite, this.composites, this.events, this.World);
    this.ballManager = new BallManager(this.bodies, this.matterWorld, this.Engine, this.World ,this.events);
  }

  get body(){
    return this.bodies;
  }

  rendering(){
    const render = this.render.create({
      canvas: this.canvas,
      element: document.body,
      engine: this.Engine,
      options: {
        wireframes: false,
        width: innerWidth,
        height: innerHeight,
        showAngleIndicator: false,
        background: "rgba(0, 0, 0, 0)",
      },
    });
    return render
  }

  initGame(){
    this.stage.init();
    this.ballManager.init();
  }

  run(){
    this.render.run(this.rendering());
    this.runner.run(this.Engine);
    this.initGame();
    this.ballManager.collision();
  }
};

class BallManager{
  constructor(bodies, matterWorld, Engine, World, events){
    this.bodies = bodies;
    this.matterWorld = matterWorld;
    this.Engine = Engine;
    this.World = World;
    this.events = events;
    this.ball = new Ball(this.bodies, this.matterWorld, this.Engine, this.World, this.events);
    this.gameOverHeight = 600;
    this.canvas = document.getElementById("canvas");
    this.ballHeight = null
  }
    // <=============================== 衝突検知 ===============================>
  collision(){
    const ballManager = this;
    ballManager.events.on(ballManager.Engine, "collisionStart", function(event) {
      ballManager.ball.union(event);
      ballManager.ballHeight = ballManager.maxHeight();
    });
  }

  // <=============================== 次弾装填 ＆　終了条件　===============================>
  generate(){
    const ball = this.ball;
    const ballManager = this;
    let data = ball.choice();
    let setBall = ball.set(data);
    document.addEventListener("mousemove", (event) => {
      const x = event.pageX;
      ball.position(x,setBall,data.radius);
    });

    ballManager.canvas.addEventListener("click", (event) => {
      const x = event.pageX;
      ball.hiddenImg(setBall);
      ball.create(x,0,data);
      ballManager.canvas.style.pointerEvents = "none";
      //タイマーでクリック可能にしつつ、次弾装填
      const oldTime = Date.now();
      let time = null;
      let diff = null;
      const update = () => {
        time = Date.now();
        diff = time - oldTime;
        const id = requestAnimationFrame(update); 
        if(diff > 2000){
          //終了条件の高さ
          if(ballManager.ballHeight < ballManager.gameOverHeight){
            cancelAnimationFrame(id);
            console.log("end");
          }
          else{
            data = ball.choice();
            setBall = ball.set(data);
            ballManager.canvas.style.pointerEvents = "auto";
            cancelAnimationFrame(id);
          }
        }
      };
      requestAnimationFrame(update); 
    });
  }

     // <=============================== ステージ上のボール全削除 ===============================>
  removeBall(ball){
    this.matterWorld.remove(this.World, ball);
  }

  removeBalls(ballList){
    for(let i = 0; i < ballList.length; i++)
    this.removeBall(ballList[i]);
  }

  init(){
    const ballList = this.World.bodies.filter(ball => ball.label === "Circle Body");
    this.removeBalls(ballList);
    this.generate();
  }
     // <=============================== ボールの最高到達高さを算出 ===============================>
     //MaxHeight = ball.position.y + ball.radius
     //まず一番大きいボールを探す。
     //そのためにボールリストを作成
     //ボールリストを今度はposition.yで降べきに並び替え
     //indexの0を取得
  maxHeight(){
    const ballList = this.World.bodies.filter(ball => ball.label === "Circle Body");
    const yList = [];
    for(let i = 0;i < ballList.length; i++){
      yList.push(ballList[i].position.y);
    }
    const min = Math.min.apply(null, yList);
    const index = yList.indexOf(min);
    const height = ballList[index].position.y - ballList[index].circleRadius;
    return height;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const gameController = new GameController();
  gameController.run();
});