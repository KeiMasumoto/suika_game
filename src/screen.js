'use strict';
export class Screen {
  constructor(forCanvashighResolution) {
    this.canvas = document.getElementById("canvas");
    this.removingBallView = document.getElementById("removingBallView");
    this.endView = document.getElementById("endView");
    this.cautionBar = document.getElementById("cautionBar");
    this.score = document.getElementById("score");
    this.sumScore = document.getElementById("ending-score-text");
    this.width = innerWidth;
    this.height = innerHeight;
    this.tags = [];
    this.forCanvashighResolution = forCanvashighResolution;
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

  // ゲーム終了画面
  showRemovingBallView() {
    this.showElemnet(this.removingBallView); // ゲーム終了時にボールが順々に削除されていく際に、薄い黒いシートを描画して終わり感を演出する
    this.pointerEventsOff(this.canvas); // キャンバスのクリックを禁止し、ボールの生成をここで阻害する
  }

  showGameOverView() {
    this.showElemnet(this.endView); // ゲーム終了時の得点とコンテニュー画面を表示する
    this.hiddenElement(this.removingBallView);
  }

  // タイトル画面
  init() {
    this.pointerEventsOn(this.canvas);
    this.hiddenElement(this.removingBallView); // ゲーム終了時の画面を非表示
    this.hiddenElement(this.endView); // ゲーム終了時の画面を非表示
    this.hiddenBar(); // 警告の非表示
    this.score.innerText = 0; // 得点の初期化

  }

  // プレイ中の画面
  showBar(top) {
    this.showElemnet(this.cautionBar); // 警告のバーを表示する
    this.cautionBar.style.top = top + "px";
  }

  hiddenBar() {
    this.hiddenElement(this.cautionBar); // 警告のバーを非表示する
  }

  showUnionEffect(x, y, size, type) {
    // ボールが削除された際の飛沫を画像として格納する
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
    // 画像として格納した画像を描画する
    for (let i = 0; i < imgs.length; i++) {
      if (imgs[i].name === type) {
        for (let j = 0; j < 6; j++) {
          const imgTag = document.createElement("img");
          imgTag.setAttribute("class", "union-effect" + j);
          imgTag.setAttribute("src", imgs[i][j]);
          imgTag.width = size;
          imgTag.height = size;
          imgTag.style.left = x - (imgTag.width / 2) + ((innerWidth - (this.canvas.width / this.forCanvashighResolution)) / 2) + "px" ;
          imgTag.style.top = y - (imgTag.height / 2) + ((innerHeight - (this.canvas.height / this.forCanvashighResolution)) / 2) + "px" ;
          document.body.appendChild(imgTag);
          this.tags.push(imgTag);
        }
      }
    }
    const screen = this;
    const oldTime = Date.now();
    let time = null;
    let diff = null;

    // 飛沫のimgを描画時間に合わせて削除する
    const update = () => {
      time = Date.now();
      diff = time - oldTime;
      const id = requestAnimationFrame(update);
      if (diff > 1000) {
        cancelAnimationFrame(id);
        screen.hiddenUnionEffect();
      }
    };
    requestAnimationFrame(update);
  }

  hiddenUnionEffect() {
    // 飛沫のimgを削除する
    if (this.tags.length !== null) {
      for (let i = 0; i < this.tags.length; i++) {
        this.tags[i].remove();
      }
      this.tags = [];
    }
  }

 // スコアを描画
  addScore(point) {
    this.score.innerText = point; // 得点のテキスト挿入
    this.sumScore.innerText = point; // エンディング画面での得点のテキスト挿入
  }
}