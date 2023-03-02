import Level1 from "./Level1";
import Level2 from "./Level2";
import Level3 from "./Level3";

export default class LevelSelection extends Phaser.Scene {
  constructor() {
    super({
      key: "LevelSelection",
    });
  }

  preload() { }

  create() {
    let music: Phaser.Sound.BaseSound=this.sound.add("music0",{loop:true,volume:0.4});
    music.play();
    console.log("create:LevelSelection")
    let level1=this.add.image(50,50,"1").setScale(2).setInteractive().on("pointerdown",()=>{music.destroy();this.scene.start("Level1");});;
    let level2=this.add.image(150,50,"2").setScale(2).setInteractive().on("pointerdown",()=>{if(Level1.completed){} music.destroy();this.scene.start("Level2")});
    let level3=this.add.image(250,50,"3").setScale(2).setInteractive().on("pointerdown",()=>{if(Level2.completed){} music.destroy();this.scene.start("Level3") });
    let boss=this.add.image(350,50,"4").setScale(2).setInteractive().on("pointerdown",()=>{if(Level3.completed){}music.destroy();this.scene.start("Boss")});
  }

  update(time: number, delta: number): void {
  }

  createHUD(event:any):void{
  }
 
}
