import GamePlay from "./GamePlay";
import Level1 from "./Level1";

export default class LevelSelection extends Phaser.Scene {

  private level1:Phaser.GameObjects.Text;
  private level2:Phaser.GameObjects.Text;
  private level3:Phaser.GameObjects.Text;
  private boss:Phaser.GameObjects.Text;

  constructor() {
    super({
      key: "LevelSelection",
    });
  }

  preload() { }

  create() {
    console.log("create:LevelSelection")
    this.level1=this.add.text(50,50,"1",{fontSize:"32px"}).setColor("Black");
    this.level2=this.add.text(100,50,"2",{fontSize:"32px"}).setColor("Black");
    this.level3=this.add.text(150,50,"3",{fontSize:"32px"}).setColor("Black");
    this.boss=this.add.text(210,50,"^U^",{fontSize:"32px"}).setColor("Black");


    this.level1.setInteractive().on("pointerdown",()=>{this.scene.start("Level1")});
    this.level2.setInteractive().on("pointerdown",()=>{this.scene.start("Level2")});
    this.level3.setInteractive().on("pointerdown",()=>{this.scene.start("Level3")});
    this.boss.setInteractive().on("pointerdown",()=>{this.scene.start("Boss")});
  }

  update(time: number, delta: number): void {
  }

  createHUD(event:any):void{
  }
 
}
