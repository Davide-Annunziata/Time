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
    let music: Phaser.Sound.BaseSound=this.sound.add("music0",{loop:true,volume:0.4});
    music.play();
    this.logo=this.add.image(this.game.canvas.width/2-5,100,"logo-game").setScale(1);
    this.playText=this.add.text(this.game.canvas.width/2-5,230,"PLAY",{fontSize:"40px"})
    .setColor("Black")
    .setOrigin(0.5,0.5)
    .setInteractive()
    .on("pointerdown",()=>{
      console.log("play");
      music.destroy();
      this.scene.start("LevelSelection");
    });

    this.creditsText=this.add.text(this.game.canvas.width/2,300,"Credits",{fontSize:"40px"})
    .setColor("Black")
    .setOrigin(0.5,0.5)
    .setInteractive()
    .on("pointerdown",()=>{
      console.log("credits");
      this.createCredits()
    });

    this.howToPlayText=this.add.text(this.game.canvas.width/2,360,"How to play",{fontSize:"40px"})
    .setColor("Black")
    .setOrigin(0.5,0.5)
    .setInteractive()
    .on("pointerdown",()=>{
      console.log("come giocare");
      this.createHow();
    });
    
  }

  createCredits(){
    this.creditsText.setInteractive(false);
    let base:Phaser.GameObjects.Image=this.add.image(this.game.canvas.width/2,300,"credits").setOrigin(0.5,0.5).setDepth(12).setInteractive().on("pointerdown",()=>{
      base.destroy();
      this.creditsText.setInteractive(true);
    });       
  }

  createHow(){
    this.howToPlayText.setInteractive(false);
    let base:Phaser.GameObjects.Image=this.add.image(this.game.canvas.width/2,300,"comeGiocare").setOrigin(0.5,0.5).setDepth(12).setInteractive().on("pointerdown",()=>{
      base.destroy();
      this.howToPlayText.setInteractive(true);
    });       
  }

  update(time: number, delta: number): void {

  }

}

