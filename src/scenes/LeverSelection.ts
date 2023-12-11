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
    this.scene.bringToTop();
    let bg=this.add.image(0, 0,"select").setOrigin(0,0).setDepth(8);
    let music: Phaser.Sound.BaseSound=this.sound.add("music0",{loop:true,volume:0.4});
    music.play();
    console.log("create:LevelSelection")
    let level1=this.add.image(170,200,"1").setDepth(9).setScale(2).setInteractive().on("pointerdown",()=>{music.pause();this.scene.start("Level1");});
    let level2=this.add.image(270,200,"2").setDepth(9).setScale(2).setInteractive().on("pointerdown",()=>{if(Level1.completed){music.pause();this.scene.start("Level2") }});
    let level3=this.add.image(370,200,"3").setDepth(9).setScale(2).setInteractive().on("pointerdown",()=>{if(Level2.completed){music.pause();this.scene.start("Level3")}});
    let boss=this.add.image(470,200,"4").setDepth(9).setScale(2).setInteractive().on("pointerdown",()=>{if(Level3.completed){music.pause();this.scene.start("Boss")}});
    let back=this.add.image(950,50,"x").setDepth(9).setScale(1).setInteractive().on("pointerdown",()=>{music.pause();this.scene.start("Intro")});
  }

  update(time: number, delta: number): void {
  }

  createHUD(event:any):void{
  }
 
}
