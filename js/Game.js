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
    this.endingTextBtn = document.getElementById("ending-text-wrapper");
    this.endingImgBtn = document.getElementById("ending-img");
    this.gameOverHeight = 500;//終了条件高さ
    this.wall = new Wall(this.engine, this.runner, this.render, this.bodies, this.matterWorld, this.composite, this.composites, this.events, this.World);
    this.floor = new Floor(this.engine, this.runner, this.render, this.bodies, this.matterWorld, this.composite, this.composites, this.events, this.World);
    this.ball = new Ball(this.bodies, this.matterWorld, this.Engine, this.World, this.events);
    this.screen = new Screen(this.engine,this.runner,this.render,this.bodies,this.matterWorld,this.composite,this.composites,this.events,this.World);
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

  init(){
    const ballList = this.World.bodies.filter(ball => ball.label === "Circle Body");
    this.removeBalls(ballList);
    this.generate();
    this.screen.init();
  }
    // <=============================== 衝突検知 ===============================>
  collision(){
    const game = this;
    game.events.on(game.Engine, "collisionStart", function(event) {
      game.ball.union(event);
      game.ballHeight = game.maxHeight();
    });
  }

  // <=============================== 次弾装填 ＆ 終了条件 ===============================>
  generate(){
    const ball = this.ball;
    const game = this;
    let data = ball.choice();
    let setBall = ball.set(data);
    document.addEventListener("mousemove", (event) => {
      const x = event.pageX;
      ball.position(x,setBall,data.radius);
    });

    game.canvas.addEventListener("click", (event) => {
      const x = event.pageX;
      ball.hiddenImg(setBall);
      ball.create(x,0,data);
      game.canvas.style.pointerEvents = "none";
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
          if(game.ballHeight < game.gameOverHeight){
            game.screen.gameOver();
            cancelAnimationFrame(id);
          }else if(game.ballHeight < (game.gameOverHeight + 200)){
            data = ball.choice();
            setBall = ball.set(data);
            game.screen.visibleBar();
            game.canvas.style.pointerEvents = "auto";
            cancelAnimationFrame(id);
          }else{
            data = ball.choice();
            setBall = ball.set(data);
            game.canvas.style.pointerEvents = "auto";
            game.screen.hiddenBar();
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


  run(){
    this.render.run(this.rendering());
    this.runner.run(this.Engine);
    this.wall.wall();
    this.floor.floor();
    this.init();
    this.collision();
    this.endingTextBtn.addEventListener("click", () =>{
      this.init();
    })
    this.endingImgBtn.addEventListener("click", () =>{
      this.init();
    })
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const game = new Game();
  game.run();
});