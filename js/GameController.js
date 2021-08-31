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
    this.stage.init();
  }


  run(){
    let ball = new Ball(this.bodies, this.matterWorld, this.Engine, this.engineWorld, this.events);
    this.initGame();
    this.render.run(this.rendering());
    this.runner.run(this.Engine);
    ball.generate();
    ball.collision();
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const gameController = new GameController();
  gameController.run();
});