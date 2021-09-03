'use strict';
class Screen{
  constructor()
    {
      this.ending = document.getElementById("end");
      this.caution = document.getElementById("caution");
      this.score = document.getElementById("score");
      this.sumScore = document.getElementById("ending-score-text");
      this.width = innerWidth;
      this.height = innerHeight;
    }

    gameOver(){
      this.ending.style.display = "block";//エンディングの表示
    }
    
    visibleBar(){
      this.caution.style.display = "block";//ゲームの終了条件に近いことを警告
    }

    hiddenBar(){
      this.caution.style.display = "";//ゲームの終了条件に近く無い
    }

    init(){
        this.ending.style.display = "none";//エンディングの非表示
        this.hiddenBar();//警告の非表示
        this.score.innerText = 0;//得点の初期化
    }
  
    addScore(point){
      this.score.innerText = point;//得点のテキスト挿入
      this.sumScore.innerText =point;//エンディング画面での得点のテキスト挿入
    }

}