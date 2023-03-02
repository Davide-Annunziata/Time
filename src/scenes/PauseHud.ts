import Overlay from "./Overlay";

export default class PauseHud extends Phaser.Scene{
    private continua :Phaser.GameObjects.Image;
    private esci: Phaser.GameObjects.Image;
    private base: Phaser.GameObjects.Image;

    constructor() {
        super({
        key: "Layout",
        });
    }

    preload() {}
    
    create(){ 
        
        this.base=this.add.image(this.cameras.main.worldView.centerX,this.cameras.main.worldView.centerY+15,"base").setOrigin(0.5,0.5).setDepth(12);
        this.continua=this.add.image(this.cameras.main.worldView.centerX,this.cameras.main.worldView.centerY-15,"continua").setInteractive().on("pointerdown",()=>{
           
            }
        ).setOrigin(0.5,0.5).setDepth(9).setScale(0.3);
        this.esci=this.add.image(this.cameras.main.worldView.centerX,this.cameras.main.worldView.centerY+85,"esci").setInteractive().on("pointerdown",()=>{
            
            }
        ).setOrigin(0.5,0.5).setDepth(9).setScale(0.3);
    };

    update(time: number, delta: number): void {
    };
}