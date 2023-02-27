export default class Intro extends Phaser.Scene {

  private logo:Phaser.GameObjects.Image;
  private playText:Phaser.GameObjects.Text;
  private creditsText:Phaser.GameObjects.Text;
  private howToPlayText:Phaser.GameObjects.Text;

  constructor() {
    super({
      key: "Intro",
    });
  }

  preload() {
  }
  create() {  
    this.logo=this.add.image(this.game.canvas.width/2-5,100,"logo-game").setScale(1);
    this.playText=this.add.text(this.game.canvas.width/2-5,230,"PLAY",{fontSize:"40px"})
    .setColor("Black")
    .setOrigin(0.5,0.5)
    .setInteractive()
    .on("pointerdown",()=>{
      console.log("pressed");
      this.scene.start("LevelSelection");
    });

    this.creditsText=this.add.text(this.game.canvas.width/2,300,"Credits",{fontSize:"40px"})
    .setColor("Black")
    .setOrigin(0.5,0.5)
    .setInteractive()
    .on("pointerdown",()=>{
      console.log("pressed2");
      this.playText.setInteractive(false);
    });

    this.howToPlayText=this.add.text(this.game.canvas.width/2,300,"Credits",{fontSize:"40px"})
    .setColor("Black")
    .setOrigin(0.5,0.5)
    .setInteractive()
    .on("pointerdown",()=>{
      console.log("pressed2");
      this.playText.setInteractive(false);
    });
    
  }


  update(time: number, delta: number): void {

  }

  private onClick():void{

  }
}

