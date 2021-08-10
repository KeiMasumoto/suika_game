'use strict';

class FruitsBall{
  constructor(){
  }
}

class Ball{
  constructor(img, radius, bodies, matterWorld, World){
    this.img = img ;
    this.radius = radius;
    this.image = new Image();
    this.y = 0;
    this.bodies = bodies;
    this.matterWorld = matterWorld;
    this.World = World;
  }

  //ballを描画するためには
  //1.imgタグをhtmlに挿入する
  //2.setAttributeでsrcを設定する
  //3.radiusをwidhtとheightに設定する
  set(){
    const imgTag = document.createElement("img")
    imgTag.setAttribute("src",this.img)
    imgTag.style.width = this.radius * 2;
    imgTag.style.height = this.radius * 2;
    imgTag.style.position = "absolute";
    document.body.appendChild(imgTag);
    return imgTag;
  }

  //4.マウスの位置に合わせてx,yの座標を設定する
  //mouseMoveのイベントで発火する
  position(x,element){
    element.style.left = x + "px";
    element.style.top = this.y + "px";
  }

  delete(element){
    element.remove();
  }

  fall(x){
    this.image.src = this.img;
    const ball = this.bodies.circle(x, this.y + this.radius, this.radius, {
      //ボールを追加
      density: 0.01, // 密度: 単位面積あたりの質量
      frictionAir: 0.05, // 空気抵抗(空気摩擦)
      restitution: 0.6, // 弾力性
      friction: 0.05, // 本体の摩擦
      render: {
        //ボールのレンダリングの設定
        sprite: {
          //スプライトの設定
          texture: this.img, //スプライトに使うテクスチャ画像を指定
          xScale: (this.radius * 2) / this.image.width,
          yScale: (this.radius * 2) / this.image.width
        }, 
      }, 
      timeScale: 1.5, //時間の倍率を設定(1で1倍速)
    });
    this.matterWorld.add(this.World, ball);
  }
}

