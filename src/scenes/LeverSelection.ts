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
    console.log("create:LevelSelection")
    let level1=this.add.image(50,50,"nome").setInteractive().on("pointerdown",()=>{this.scene.start("Level1")});;
    let level2=this.add.image(100,50,"nome").setInteractive().on("pointerdown",()=>{if(Level1.completed){ this.scene.start("Level2") }});
    let level3=this.add.image(150,50,"nome").setInteractive().on("pointerdown",()=>{if(Level2.completed){} this.scene.start("Level3") });
    let boss=this.add.image(210,50,"nome").setInteractive().on("pointerdown",()=>{if(Level3.completed){}this.scene.start("Boss")});
  }

  update(time: number, delta: number): void {
  }

  createHUD(event:any):void{
  }
 
}
