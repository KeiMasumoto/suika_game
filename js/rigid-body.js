'use strict';
class RigidBody{
  //流石に下記で作成するWallクラスとFloorクラスの差異がほとんどないから継承の勉強、実践もかねてRigidBodyを継承させることにした。
  constructor(bodies, matterWorld, composite, engineWorld)
    {
      this.canvas = document.getElementById("canvas");
      this.width = innerWidth;
      this.height = innerHeight;
      //Matter.js モジュール 初期設定
      this.Bodies = bodies;
      this.World = matterWorld;
      this.Composite = composite;
      this.world = engineWorld;
    }

  // <=============================== ステージ作成 ===============================>
  create(positionX, positionY, rectWidth, rectHeight) {
    //剛体の四角を作成する
    this.Composite.add(this.world, [
      this.Bodies.rectangle(positionX, positionY, rectWidth, rectHeight, {
        isStatic: true, //固定する
        render: {
          fillStyle: "brown", // 塗りつぶす色: CSSの記述法で指定
          strokeStyle: "rgba(0, 0, 0, 0)", // 線の色: CSSの記述法で指定
          lineWidth: 0, 
        }, 
      }), 
    ]);
  }

  createYellowGround(positionX, positionY, rectWidth, rectHeight){
    //剛体の四角を作成する
    this.Composite.add(this.world, [
      this.Bodies.rectangle(positionX, positionY, rectWidth, rectHeight, {
        isStatic: true, //固定する
        render: {
          fillStyle: "darkgoldenrod", // 塗りつぶす色: CSSの記述法で指定
          strokeStyle: "rgba(0, 0, 0, 0)", // 線の色: CSSの記述法で指定
          lineWidth: 0, 
        }, 
      }), 
    ]);
  }
}

class Wall extends RigidBody {
    // <=============================== 壁作成 ===============================>
  rightWall() {
    this.create(-10, this.canvas.height / 2, 20, this.canvas.height);
  }

  leftWall() {
    this.create(this.canvas.width + 10, this.canvas.height / 2, 20, this.canvas.height);
  }
}

class Floor extends RigidBody {
  // <=============================== 床作成 ===============================>
  floor() {
    this.createYellowGround(this.canvas.width / 2, this.canvas.height-10, this.canvas.width, 90);
    this.create(this.canvas.width / 2, this.canvas.height-10, this.canvas.width, 70);
  }
}