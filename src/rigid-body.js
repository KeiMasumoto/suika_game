'use strict';
class RigidBody {
  // 流石に下記で作成するWallクラスとFloorクラスの差異がほとんどないから継承の勉強、実践もかねてRigidBodyを継承させることにした。
  constructor(bodies, composite, engineWorld) {
    this.canvas = document.getElementById("canvas");
    this.width = innerWidth;
    this.height = innerHeight;
    // Matter.js モジュール 初期設定
    this.Bodies = bodies; // 物理シミュレーション上で剛体を設定する
    this.Composite = composite; // 物理シミュレーションを構成するオブジェクトを管理する
    this.world = engineWorld; // 物理シミュレーションを行う環境を用意する
  }

  // <=============================== ステージ作成 ===============================>
  create(positionX, positionY, rectWidth, rectHeight, color) {
    // 剛体の四角を作成する
    this.Composite.add(this.world, [ // 物理シミュレーションにオブジェクトを加える
      this.Bodies.rectangle(positionX, positionY, rectWidth, rectHeight, { // レクタングルを加える
        isStatic: true, // 固定する
        render: {
          // fillStyle: "brown", // 塗りつぶす色: CSSの記述法で指定
          fillStyle: color, // 塗りつぶす色: CSSの記述法で指定
          strokeStyle: "rgba(0, 0, 0, 0)", // 線の色: CSSの記述法で指定
          lineWidth: 0,
        },
      }),
    ]);
  }
}

export class Wall extends RigidBody {
  // <=============================== 壁作成 ===============================>
  rightWall() {
    this.create(-10, this.canvas.height / 2, 20, this.canvas.height);
  }

  leftWall() {
    this.create(this.canvas.width + 10, this.canvas.height / 2, 20, this.canvas.height);
  }
}


export class Floor extends RigidBody {
  // <=============================== 床作成 ===============================>
  floor() {
    const brown = "brown";
    const yellow = "darkgoldenrod";
    this.create(this.canvas.width / 2, this.canvas.height-10, this.canvas.width, 90, yellow);
    this.create(this.canvas.width / 2, this.canvas.height-10, this.canvas.width, 70, brown);
  }
}