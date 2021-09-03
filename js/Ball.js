'use strict';

class Ball{
  constructor(bodies, matterWorld, Engine, World, events){
    this.image = new Image();
    this.bodies = bodies;
    this.matterWorld = matterWorld;
    this.Engine = Engine;
    this.World = World;
    this.events = events;
    this.imgs =[
      {name : "ballTypeA", img : "./img/fruit/img_size_30.png", radius : 15},
      {name : "ballTypeB", img : "./img/fruit/img_size_60.png", radius : 30},
      {name : "ballTypeC", img : "./img/fruit/img_size_80.png", radius : 40},
      {name : "ballTypeD", img : "./img/fruit/img_size_100.png", radius : 50},
      {name : "ballTypeE", img : "./img/fruit/img_size_120.png", radius : 60},
      {name : "ballTypeF", img : "./img/fruit/img_size_140.png", radius : 70},
      {name : "ballTypeG", img : "./img/fruit/img_size_160.png", radius : 80},
      {name : "ballTypeH", img : "./img/fruit/img_size_180.png", radius : 90},
      {name : "ballTypeI", img : "./img/fruit/img_size_200.png", radius : 100},
      {name : "ballTypeJ", img : "./img/fruit/img_size_220.png", radius : 110}
    ]
    this.canvas = document.getElementById("canvas");
    this.canvas.style.zIndex = "2";
    this.bool = "false";
  }

  // <=============================== ボールの生成 ===============================>
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
    return this.imgs[this.random(this.imgs.length)];
  }

  //ballを生成するためには
  //1.imgタグをhtmlに挿入する
  //2.setAttributeでsrcを設定する
  set(data){
    const imgTag = document.createElement("img")
    imgTag.setAttribute("src",data.img)
    imgTag.setAttribute("id","ballImg")
    imgTag.style.left = this.canvas.width /2 + "px" ;
    imgTag.style.top = 30 + "px" ;
    imgTag.style.position = "absolute";
    document.body.appendChild(imgTag);
    return imgTag;
  }

  //4.マウスの位置に合わせてx,yの座標を設定する
  //mouseMoveのイベントで発火する
  position(x,imgTag,radius){
    imgTag.style.left = x - radius  + "px";
    imgTag.style.top = this.y + "px";
  }

  hiddenImg(imgTag){
    imgTag.remove();
  }

  create(x,y,data){
    this.image.src = data.img;
    const ball = this.bodies.circle(x, y + data.radius, data.radius, {
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
          yScale: 1
        },
      },
      timeScale: 1.5, //時間の倍率を設定(1で1倍速)
    });
    this.matterWorld.add(this.World, ball);

    return ball;
  }

  // <=============================== ボールの消去 ===============================>
   removeBall(ball){
    this.matterWorld.remove(this.World, ball);
   }

   // <=============================== ボール合体 ===============================>
  union(event){
    const pairs = event.pairs;
    const ballA = pairs[0].bodyA;
    const ballB = pairs[0].bodyB;
    const balls =[ballA,ballB]
    let x = ballA.position.x;
    let y = ballA.position.y;
    if (ballA.circleRadius === ballB.circleRadius){
      for(let i = 0; i < this.imgs.length; i++){
        if(ballA.circleRadius === (this.imgs[i].radius)){
          y -= this.imgs[i+1].radius;
          this.create(x, y, this.imgs[i+1]);
          this.removeBalls(balls);
        }
      }
    }
    return ballA.circleRadius
  };

  // <=============================== ボール合体した時の既存のボールの消去 ===============================>
    removeBalls(ballList){
      for(let i = 0; i < ballList.length; i++)
      this.removeBall(ballList[i]);
    }
}

