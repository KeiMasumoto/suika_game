'use strict';
class Screen {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.delete = document.getElementById("delete-balls");
    this.ending = document.getElementById("end");
    this.caution = document.getElementById("caution");
    this.score = document.getElementById("score");
    this.sumScore = document.getElementById("ending-score-text");
    this.width = innerWidth;
    this.height = innerHeight;
    this.tags = [];
  }

  showElemnet(ele) {
    ele.classList.add("is-show");
    ele.classList.remove("is-hidden");
  }
  hiddenElement(ele) {
    ele.classList.add("is-hidden");
    ele.classList.remove("is-show");
  }
  pointerEventsOn(ele) {
    ele.classList.add("pointer-events-on");
    ele.classList.remove("pointer-events-off");
  }
  pointerEventsOff(ele) {
    ele.classList.remove("pointer-events-on");
    ele.classList.add("pointer-events-off");
  }

  //ゲーム終了画面
  deleteBalls() {
    // this.delete.style.display = "block"
    // this.canvas.style.pointerEvents = "none"
    this.showElemnet(this.delete);
    this.pointerEventsOff(this.canvas);
  }

  gameOver() {
    // this.delete.style.display = "none"
    // this.ending.style.display = "block";//エンディングの表示
    this.showElemnet(this.ending);
    this.hiddenElement(this.delete);
  }

  //タイトル画面
  init() {
    // this.canvas.style.pointerEvents = "auto"
    // this.delete.style.display = "none"
    // this.ending.style.display = "none";//エンディングの非表示
    this.pointerEventsOn(this.canvas);
    this.hiddenElement(this.delete);
    this.hiddenElement(this.ending);
    this.hiddenBar();//警告の非表示
    this.score.innerText = 0;//得点の初期化

  }

  //プレイ中の画面
  visibleBar(top) {
    // this.caution.style.display = "block";//ゲームの終了条件に近いことを警告
    this.showElemnet(this.caution);
    this.caution.style.top = top + "px";
  }

  hiddenBar() {
    this.hiddenElement(this.caution);
    // this.caution.style.display = "";//ゲームの終了条件に近く無い
  }

  visibleUnionEffect(x, y, size, type) {
    const imgs = [
      { name : "ballTypeA", 0 : "../img/fruit/purple/img_p1.png", 1 : "../img/fruit/purple/img_p2.png", 2 : "../img/fruit/purple/img_p3.png", 3 : "../img/fruit/purple/img_p4.png", 4 : "../img/fruit/purple/img_p5.png", 5 : "../img/fruit/purple/img_p6.png" },
      { name : "ballTypeB", 0 : "../img/fruit/red/img_r1.png", 1 : "../img/fruit/red/img_r2.png", 2 : "../img/fruit/red/img_r3.png", 3 : "../img/fruit/red/img_r4.png", 4 : "../img/fruit/red/img_r5.png", 5 : "../img/fruit/red/img_r6.png" },
      { name : "ballTypeC", 0 : "../img/fruit/orange/img_o1.png", 1 : "../img/fruit/orange/img_o2.png", 2 : "../img/fruit/orange/img_o3.png", 3 : "../img/fruit/orange/img_o4.png", 4 : "../img/fruit/orange/img_o5.png", 5 : "../img/fruit/orange/img_o6.png" },
      { name : "ballTypeD", 0 : "../img/fruit/yellow/img_y1.png", 1 : "../img/fruit/yellow/img_y2.png", 2 : "../img/fruit/yellow/img_y3.png", 3 : "../img/fruit/yellow/img_y4.png", 4 : "../img/fruit/yellow/img_y5.png", 5 : "../img/fruit/yellow/img_y6.png" },
      { name : "ballTypeE", 0 : "../img/fruit/green/img_g1.png", 1 : "../img/fruit/green/img_g2.png", 2 : "../img/fruit/green/img_g3.png", 3 : "../img/fruit/green/img_g4.png", 4 : "../img/fruit/green/img_g5.png", 5 : "../img/fruit/green/img_g6.png" },
      { name : "ballTypeF", 0 : "../img/fruit/red/img_r1.png", 1 : "../img/fruit/red/img_r2.png", 2 : "../img/fruit/red/img_r3.png", 3 : "../img/fruit/red/img_r4.png", 4 : "../img/fruit/red/img_r5.png", 5 : "../img/fruit/red/img_r6.png" },
      { name : "ballTypeG", 0 : "../img/fruit/orange/img_o1.png", 1 : "../img/fruit/orange/img_o2.png", 2 : "../img/fruit/orange/img_o3.png", 3 : "../img/fruit/orange/img_o4.png", 4 : "../img/fruit/orange/img_o5.png", 5 : "../img/fruit/orange/img_o6.png" },
      { name : "ballTypeH", 0 : "../img/fruit/yellow/img_y1.png", 1 : "../img/fruit/yellow/img_y2.png", 2 : "../img/fruit/yellow/img_y3.png", 3 : "../img/fruit/yellow/img_y4.png", 4 : "../img/fruit/yellow/img_y5.png", 5 : "../img/fruit/yellow/img_y6.png" },
      { name : "ballTypeI", 0 : "../img/fruit/white/img_w1.png", 1 : "../img/fruit/white/img_w2.png", 2 : "../img/fruit/white/img_w3.png", 3 : "../img/fruit/white/img_w4.png", 4 : "../img/fruit/white/img_w5.png", 5 : "../img/fruit/white/img_w6.png" },
      { name : "ballTypeJ", 0 : "../img/fruit/red/img_r1.png", 1 : "../img/fruit/red/img_r2.png", 2 : "../img/fruit/red/img_r3.png", 3 : "../img/fruit/red/img_r4.png", 4 : "../img/fruit/red/img_r5.png", 5 : "../img/fruit/red/img_r6.png" },
    ];
    for(let i = 0; i < imgs.length; i++) {
      if(imgs[i].name === type) {
        for(let j = 0; j < 6; j++) {
          const imgTag = document.createElement("img");
          imgTag.setAttribute("class", "union-effect" + j);
          imgTag.setAttribute("src", imgs[i][j]);
          imgTag.width = size;
          imgTag.height = size;
          imgTag.style.left = x - (imgTag.width / 2) + ((innerWidth - this.canvas.width) / 2) + "px" ;
          imgTag.style.top = y - (imgTag.height / 2) + ((innerHeight - this.canvas.height) / 2) + "px" ;
          document.body.appendChild(imgTag);
          this.tags.push(imgTag);
        }
      }
    }
    const screen = this;
    const oldTime = Date.now();
    let time = null;
    let diff = null;
    const update = () => {
      time = Date.now();
      diff = time - oldTime;
      const id = requestAnimationFrame(update);
      if (diff > 1000) {
        cancelAnimationFrame(id);
        screen.removeUnionEffect();
      }
    };
    requestAnimationFrame(update);
  }

  removeUnionEffect() {
    if(this.tags.length !== null) {
      for(let i = 0; i < this.tags.length; i++) {
        this.tags[i].remove();
      }
      this.tags = [];
    }
  }

 //スコアを描画
  addScore(point) {
    this.score.innerText = point;//得点のテキスト挿入
    this.sumScore.innerText = point;//エンディング画面での得点のテキスト挿入
  }
}