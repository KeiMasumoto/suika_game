'use strict';

class Ball {
  constructor(bodies, matterWorld, World, gameOverHeight) {
    this.image = new Image();
    this.bodies = bodies;
    this.matterWorld = matterWorld;
    this.World = World;
    this.gameOverHeight = gameOverHeight;
    // this.imgs =[
    //   { name : "ballTypeA", img : "./img/fruit/img_size_30.png", radius : 15 },
    //   { name : "ballTypeB", img : "./img/fruit/img_size_60.png", radius : 30 },
    //   { name : "ballTypeC", img : "./img/fruit/img_size_80.png", radius : 40 },
    //   { name : "ballTypeD", img : "./img/fruit/img_size_100.png", radius : 50 },
    //   { name : "ballTypeE", img : "./img/fruit/img_size_120.png", radius : 60 },
    //   { name : "ballTypeF", img : "./img/fruit/img_size_140.png", radius : 70 },
    //   { name : "ballTypeG", img : "./img/fruit/img_size_160.png", radius : 80 },
    //   { name : "ballTypeH", img : "./img/fruit/img_size_180.png", radius : 90 },
    //   { name : "ballTypeI", img : "./img/fruit/img_size_200.png", radius : 100 },
    //   { name : "ballTypeJ", img : "./img/fruit/img_size_220.png", radius : 110 }
    // ]
    // this.imgs =[
    //   { name : "ballTypeA", img : "./img/fruit/small/img_size_30.png", radius : 5 },
    //   { name : "ballTypeB", img : "./img/fruit/small/img_size_60.png", radius : 10 },
    //   { name : "ballTypeC", img : "./img/fruit/small/img_size_80.png", radius : 15 },
    //   { name : "ballTypeD", img : "./img/fruit/small/img_size_100.png", radius : 20 },
    //   { name : "ballTypeE", img : "./img/fruit/small/img_size_120.png", radius : 25 },
    //   { name : "ballTypeF", img : "./img/fruit/small/img_size_140.png", radius : 30 },
    //   { name : "ballTypeG", img : "./img/fruit/small/img_size_160.png", radius : 35 },
    //   { name : "ballTypeH", img : "./img/fruit/small/img_size_180.png", radius : 40 },
    //   { name : "ballTypeI", img : "./img/fruit/small/img_size_200.png", radius : 45 },
    //   { name : "ballTypeJ", img : "./img/fruit/small/img_size_220.png", radius : 50 }
    // ]

    // this.imgs =[
    //   { name : "ballTypeA", img : "./img/fruit/middle/img_size_30.png", radius : 10 },
    //   { name : "ballTypeB", img : "./img/fruit/middle/img_size_60.png", radius : 15 },
    //   { name : "ballTypeC", img : "./img/fruit/middle/img_size_80.png", radius : 20 },
    //   { name : "ballTypeD", img : "./img/fruit/middle/img_size_100.png", radius : 25 },
    //   { name : "ballTypeE", img : "./img/fruit/middle/img_size_120.png", radius : 30 },
    //   { name : "ballTypeF", img : "./img/fruit/middle/img_size_140.png", radius : 35 },
    //   { name : "ballTypeG", img : "./img/fruit/middle/img_size_160.png", radius : 40 },
    //   { name : "ballTypeH", img : "./img/fruit/middle/img_size_180.png", radius : 45 },
    //   { name : "ballTypeI", img : "./img/fruit/middle/img_size_200.png", radius : 50 },
    //   { name : "ballTypeJ", img : "./img/fruit/middle/img_size_220.png", radius : 55 }
    // ]

    this.imgs =[
      { name : "ballTypeA", img : "./img/fruit/middle/img_size_30.png", radius : 15 },
      { name : "ballTypeB", img : "./img/fruit/middle/img_size_60.png", radius : 20 },
      { name : "ballTypeC", img : "./img/fruit/middle/img_size_80.png", radius : 25 },
      { name : "ballTypeD", img : "./img/fruit/middle/img_size_100.png", radius : 30 },
      { name : "ballTypeE", img : "./img/fruit/middle/img_size_120.png", radius : 35 },
      { name : "ballTypeF", img : "./img/fruit/middle/img_size_140.png", radius : 40 },
      { name : "ballTypeG", img : "./img/fruit/middle/img_size_160.png", radius : 45 },
      { name : "ballTypeH", img : "./img/fruit/middle/img_size_180.png", radius : 50 },
      { name : "ballTypeI", img : "./img/fruit/middle/img_size_200.png", radius : 55 },
      { name : "ballTypeJ", img : "./img/fruit/middle/img_size_220.png", radius : 60 }
    ]
    this.canvas = document.getElementById("canvas");
    this.gameWrapper = document.getElementById("gameWrapper");
    this.canvas.style.zIndex = "2";
    this.data = null;
    this.imgTag = null;
  }

  // <=============================== ボールの生成 ===============================>
  random(max) {
    //ランダムにmaxの値までの整数を生成する
    const fortune = [];
    let num = 0;
    for(let i = (max - 1); i > -1; i--) {
      for(let j = 0;j < i;j++) {
        fortune.push(num);
      }
      num += 1;
    }

    const random = fortune[Math.floor(Math.random() * fortune.length)];

    return random
  }

  choice() {
    //0~ボールの種類の数までの数をランダムに生成し、その数値のインデックスのボールを選択する
    //ゲームオーバー寸前に大きい球がきたらゲームが即終了してしまうので出現する勾配をコントロールする
    const ballList = this.World.bodies.filter(body => body.label === "Circle Body");
 
    // const HeightList = [];
    // for (let i = 0; i < ballList.length; i++) {
    //   HeightList.push(ballList[i].position.y)
    // }

    // const maxHeight = Math.min.apply(null, HeightList);
    // const remainedHeight = Math.abs(this.gameOverHeight - maxHeight);
    
    // let maxIndex = null;
    
    // for (let i = 0; i < this.imgs.length; i++) {
    //   if (remainedHeight > (this.imgs[i].radius * 2)) {
    //     maxIndex = i;
    //   }

    // }
    // if (remainedHeight < (this.imgs[3].radius * 2)) {
    //   maxIndex = 3;
    // }
    
    return this.imgs[this.random(4)];
  }

  set() {
    this.data = this.choice();
    //選択したボールを描画する
    this.imgTag = document.createElement("img");
    this.imgTag.setAttribute("src", this.data.img);
    this.imgTag.setAttribute("id", "ballImg");
    this.imgTag.style.left = (this.canvas.width / 2) - (this.data.radius)  + "px";
    this.imgTag.style.top = 30 + "px";
    this.imgTag.style.position = "absolute";
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
    // this.image.src = data.img;
    const ball = this.bodies.circle(x - ((innerWidth - this.canvas.width) / 2), y + data.radius, data.radius, {
      //ボールを追加
      density: 0.01, // 密度: 単位面積あたりの質量
      frictionAir: 0.05, // 空気抵抗(空気摩擦)
      restitution: 0.6, // 弾力性
      friction: 0.05, // 本体の摩擦
      render: {
        //ボールのレンダリングの設定
        sprite: {
          //スプライトの設定
          texture: data.img, //スプライトに使うテクスチャ画像を指定
          xScale: 1,
          yScale: 1,
        },
      },
      timeScale: 1.5, //時間の倍率を設定(1で1倍速)
    });
    this.matterWorld.add(this.World, ball);
    return ball;
  }

  // <=============================== ボールの消去 ===============================>
  removeBall(ball) {
     //剛体のボールの消去
    this.matterWorld.remove(this.World, ball);

    let radius = ball.circleRadius - (ball.circleRadius / 15);
    const fadeOut = setInterval(() => {
      const fadeOutBall = this.bodies.circle(ball.position.x, ball.position.y + radius, radius, {
        //ボールを追加
        density: 0.01, // 密度: 単位面積あたりの質量
        frictionAir: 0.05, // 空気抵抗(空気摩擦)
        restitution: 0.6, // 弾力性
        friction: 0.05, // 本体の摩擦
        render: {
          //ボールのレンダリングの設定
          sprite: {
            //スプライトの設定
            texture: ball.render.sprite.texture, //スプライトに使うテクスチャ画像を指定
            xScale: radius / ball.circleRadius,
            yScale: radius / ball.circleRadius,
          },
        },
        timeScale: 1.5, //時間の倍率を設定(1で1倍速)
      });
      radius = radius - (ball.circleRadius / 15);
      this.matterWorld.add(this.World, fadeOutBall);
      setTimeout(() => {
        this.matterWorld.remove(this.World, fadeOutBall);
      }, 10)
      if(radius <= 0){
        clearInterval(fadeOut);
      };
    }, 10);
  }
}

