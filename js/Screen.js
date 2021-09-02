'use strict';
class Screen{
  constructor(engine,runner,render,bodies,matterWorld,composite,composites,events,engineWorld)
    {
      this.canvas = document.getElementById("canvas");
      this.canvas = document.getElementById("canvas");
      this.width = innerWidth;
      this.height = innerHeight;
      //Matter.js モジュール 初期設定
      this.Engine = engine; //物理シュミレーションおよびレンダリングを管理するコントローラーとなるメソッド
      this.Runner = runner;
      this.Render = render;
      this.Bodies = bodies; //一般的な剛体モデルを作成するメソッドを含む
      this.World = matterWorld; //物理演算領域の作成・操作するメソッドを含む
      this.Composite = composite; //物理演算領域の作成・操作するメソッドを含む
      this.Composites = composites;
      this.Events = events;
      this.world = engineWorld;
      this.bool = false;
    }

    gameOver(){

    }

}