'use strict';
class GameController{
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
    this.engineWorld = this.Engine.world;
    this.canvas = document.getElementById("canvas");
    this.stage = new Stage(this.engine, this.runner, this.render, this.bodies, this.matterWorld, this.composite, this.composites, this.events, this.engineWorld);
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
    this.stage.create();
  }

  random(max){
    const fortune = []
    let num = 0;
    for(let i = (max - 1);i > -1;i--){
      for(let j = 0;j < i;j++){
        fortune.push(num);
      }
      num += 1;
    }

    const random = fortune[Math.floor(Math.random() * fortune.length)];

    return random
  }

  choice(){
    const balls = [
      {name : "ballTypeA", img : "./img/fruit/img_size_30.png", radius : 15},
      {name : "ballTypeB", img : "./img/fruit/img_size_60.png", radius : 30},
      {name : "ballTypeC", img : "./img/fruit/img_size_80.png", radius : 40},
      {name : "ballTypeD", img : "./img/fruit/img_size_100.png", radius : 50},
      {name : "ballTypeE", img : "./img/fruit/img_size_120.png", radius : 60},
      {name : "ballTypeF", img : "./img/fruit/img_size_140.png", radius : 70},
      {name : "ballTypeG", img : "./img/fruit/img_size_160.png", radius : 80},
      {name : "ballTypeH", img : "./img/fruit/img_size_180.png", radius : 90},
      {name : "ballTypeI", img : "./img/fruit/img_size_200.png", radius : 200},
      {name : "ballTypeJ", img : "./img/fruit/img_size_220.png", radius : 110},
    ];
    
    return balls[this.random(balls.length)];
  }

  run(){
    let choice = this.choice();
    let ball = new Ball(choice.img, choice.radius, this.bodies, this.matterWorld, this.engineWorld);
    this.initGame();
    let ball_1 = ball.set();
    this.render.run(this.rendering());
    this.runner.run(this.Engine);

    document.addEventListener("mousemove", (event) => {
      const x = event.pageX;
      ball.position(x,ball_1);
    });

    document.addEventListener("click", (event) => {
      const x = event.pageX;
      ball.delete(ball_1);
      ball.fall(x);
      setTimeout(() => {
        choice = this.choice();
        ball = new Ball(choice.img, choice.radius, this.bodies, this.matterWorld, this.engineWorld);
        ball_1 = ball.set();
      },1000);
    })
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const gameController = new GameController();
  gameController.run();
});