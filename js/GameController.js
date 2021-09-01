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

document.addEventListener("DOMContentLoaded", () => {
  const gameController = new GameController();
  gameController.run();
});