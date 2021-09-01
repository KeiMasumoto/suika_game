class BallManager{
  constructor(bodies, matterWorld, Engine, World, events){
    this.bodies = bodies;
    this.matterWorld = matterWorld;
    this.Engine = Engine;
    this.World = World;
    this.events = events;
    this.ball = new Ball(this.bodies, this.matterWorld, this.Engine, this.World, this.events);
  }
    // <=============================== 衝突検知 ===============================>
    collision(){
      const ballManager = this;
      ballManager.events.on(ballManager.Engine, "collisionStart", function(event) {
        ballManager.ball.union(event);
        // set.scoreText(Math.ceil(scorePoint));
        // gameClass.audioBound.playSound();
      });
    }

     // <=============================== ステージ上のボール全削除 ===============================>
     removeBall(ball){
      this.matterWorld.remove(this.World, ball);
     }

     removeBalls(ballList){
      for(let i = 0; i < ballList.length; i++)
      this.removeBall(ballList[i]);
    }

    init(){
      const ballList = this.World.bodies.filter(ball => ball.label === "Circle Body");
      this.removeBalls(ballList);
      this.ball.generate();
    }
}