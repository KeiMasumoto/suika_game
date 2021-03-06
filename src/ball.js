'use strict';

export class Ball {
  constructor(bodies, matterWorld, World, gameOverHeight, forCanvasHighResolution) {
    this.image = new Image();
    this.bodies = bodies; // 物理シミュレーション上で剛体を設定する
    this.matterWorld = matterWorld; // 物理シミュレーションを構成するオブジェクトを管理する、Compositeとほぼ同じ
    this.World = World; // 物理シミュレーションを行う環境を用意する
    this.gameOverHeight = gameOverHeight; // ゲームの終了判定の高さ
    this.forCanvasHighResolution = forCanvasHighResolution;// キャンバスの画質を向上させるためにキャンバスに適当な数字を乗算していうる

    this.imgs = [ // 果物の画像を格納
      { name : "ballTypeA", img : "./img/fruit/modified_size/img_size_30.png", radius : 11 },
      { name : "ballTypeB", img : "./img/fruit/modified_size/img_size_60.png", radius : 17 },
      { name : "ballTypeC", img : "./img/fruit/modified_size/img_size_80.png", radius : 23 },
      { name : "ballTypeD", img : "./img/fruit/modified_size/img_size_100.png", radius : 25 },
      { name : "ballTypeE", img : "./img/fruit/modified_size/img_size_120.png", radius : 32 },
      { name : "ballTypeF", img : "./img/fruit/modified_size/img_size_140.png", radius : 39 },
      { name : "ballTypeG", img : "./img/fruit/modified_size/img_size_160.png", radius : 41 },
      { name : "ballTypeH", img : "./img/fruit/modified_size/img_size_180.png", radius : 55 },
      { name : "ballTypeI", img : "./img/fruit/modified_size/img_size_200.png", radius : 66 },
      { name : "ballTypeJ", img : "./img/fruit/modified_size/img_size_220.png", radius : 67 }
    ]

    this.canvas = document.getElementById("canvas");
    this.gameWrapper = document.getElementById("gameWrapper");
    this.canvas.style.zIndex = "2";
    this.data = null;
    this.imgTag = null;
    this.totalBallNum = 0;
  }

  // <=============================== ボールの生成 ===============================>
  random(max) {
    //ランダムにmaxの値までの整数を生成する
    const fortune = [];
    let num = 0;
    for (let i = (max - 1); i > -1; i--) {
      for (let j = 0;j < i;j++) {
        fortune.push(num);
      }
      num += 1;
    }
    const random = fortune[Math.floor(Math.random() * fortune.length)];
    return random
  }

  choice() {
    //0~ボールの種類の数までの数をランダムに生成し、その数値のインデックスのボールを選択する
    let choicedBall = this.imgs[this.random(6)];

    // 最初の果物5個は紫、紫、赤、オレンジ、オレンジ、みかんで生成する
    const firstChoicedBall = [0, 1, 2, 2, 3];
    const ballList = this.World.bodies.filter(body => body.label === "Circle Body");
    if (this.totalBallNum < 5) {
      choicedBall = this.imgs[firstChoicedBall[this.totalBallNum]];
      this.totalBallNum++;
    }
    
    return choicedBall;
  }

  set() {
    this.data = this.choice();
    //選択したボールを描画する
    this.imgTag = document.createElement("img");
    this.imgTag.setAttribute("src", this.data.img);
    this.imgTag.setAttribute("id", "ballImg");
    this.imgTag.style.left = ((this.canvas.width / this.forCanvasHighResolution) / 2) - (this.data.radius)  + "px";
    this.imgTag.style.top = 30 + "px";
    this.imgTag.style.position = "absolute";
    this.imgTag.style.pointerEvents = "none";
    this.gameWrapper.appendChild(this.imgTag);
  }

  position(x) {
    //描画したボールをxに追従させる
    this.imgTag.style.left = x - this.data.radius  + "px";
    this.imgTag.style.top = this.y + "px";
  }

  hiddenImg() {
    //描画しているボールを削除する
    this.imgTag.remove();
  }

  create(x, y, data) {
    //描画していたボールはimgだけのため、剛体のボールを生成する。（ゲームエンジンのライブラリ使っているため）
    const ball = this.bodies.circle((x * this.forCanvasHighResolution) - (((innerWidth * this.forCanvasHighResolution) - (this.canvas.width)) / 2), y + data.radius * this.forCanvasHighResolution, data.radius * this.forCanvasHighResolution, {
      //ボールを追加
      density: 0.75, // 密度: 単位面積あたりの質量
      frictionAir: 0.005, // 空気抵抗(空気摩擦)
      restitution: 0.2, // 弾力性
      friction: 0.5, // 本体の摩擦
      
      render: {
        //ボールのレンダリングの設定
        sprite: {
          //スプライトの設定
          texture: data.img, //スプライトに使うテクスチャ画像を指定
          xScale: 1 * this.forCanvasHighResolution,
          yScale: 1 * this.forCanvasHighResolution,
        },
      },
      timeScale: 1.25, //時間の倍率を設定(1で1倍速)
    });
    this.matterWorld.add(this.World, ball);
    return ball;
  }

  // <=============================== ボールの消去 ===============================>
  removeBall(ball) {
    const originBall = ball;
    const ghostBall = this.bodies.circle(originBall.position.x, originBall.position.y, 0.001, {
      //ボールを追加
      density: 0.75, // 密度: 単位面積あたりの質量
      frictionAir: 0.005, // 空気抵抗(空気摩擦)
      restitution: 0.2, // 弾力性
      friction: 0.5, // 本体の摩擦
      render: {
        //ボールのレンダリングの設定
        sprite: {
          //スプライトの設定
          texture: originBall.render.sprite.texture, //スプライトに使うテクスチャ画像を指定
          xScale: 1 * this.forCanvasHighResolution,
          yScale: 1 * this.forCanvasHighResolution,
        },
      },
      timeScale: 1.25, //時間の倍率を設定(1で1倍速)
    });

    let removedBall = this.World.bodies.filter(target => target.id === originBall.id)[0];
    const targetNum = this.World.bodies.indexOf(removedBall);
    this.World.bodies[targetNum] = ghostBall;
    removedBall = this.World.bodies[targetNum];

    console.log(originBall.position.x);
    console.log(this.World.bodies);

    // ボールが削除される際に徐々に小さくしてアニメーションの唐突感をなくす
    const renderRadius = originBall.render.sprite.xScale;
    let radius = renderRadius;

    const fadeOut = setInterval(() => {
      radius =  radius - (1 / 5);
      setTimeout(() => {
        if (radius > 0) {
          removedBall.position.x = originBall.position.x;
          removedBall.position.y = originBall.position.y;
          removedBall.render.sprite.xScale = radius;
          removedBall.render.sprite.yScale = radius;
        } else if (radius <= 0) {
          //剛体のボールの消去
          this.matterWorld.remove(this.World, removedBall);
          clearInterval(fadeOut);
        };
      }, 10)
    }, 10);
  }
}
