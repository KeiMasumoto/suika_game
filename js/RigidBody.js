'use strict';
class RigidBody{
  constructor(engine,runner,render,bodies,matterWorld,composite,composites,events,engineWorld)
    {
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

    // <=============================== ステージ作成 ===============================>
    create(positionX, positionY, rectWidth, rectHeight){
      //Matter.Worldにadd
      //第一引数がengine.world(engine = Engine.create())
      this.Composite.add(this.world, [
        this.Bodies.rectangle(positionX, positionY, rectWidth, rectHeight, {
          isStatic: true, //固定する
          render: {
            fillStyle: "#000000", // 塗りつぶす色: CSSの記述法で指定
            strokeStyle: "rgba(0, 0, 0, 0)", // 線の色: CSSの記述法で指定
            lineWidth: 0, 
          }, 
        }), 
      ]);
    }
}

class Wall extends RigidBody {
    // <=============================== 壁作成 ===============================>
    Wall(){
      this.createRectangle(-10, this.height / 2, 20, this.height);
      this.createRectangle(this.width + 10, this.height / 2, 20, this.height);
    }
}

class Floor extends RigidBody {
  // <=============================== 床作成 ===============================>
  floor(){
    this.createRectangle(this.width / 2, this.height-10, this.width, 20);
  }
}