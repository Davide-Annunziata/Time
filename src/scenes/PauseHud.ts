

export default class PauseHud extends Phaser.Scene{
    private continua :Phaser.GameObjects.Image;
    private esci: Phaser.GameObjects.Image;
    private base: Phaser.GameObjects.Image;
    private level:integer;
    constructor(level:integer) {
        super({
        key: "PauseHud",
        });
        this.level=level
    }

    preload() {}
    
    create(){ 
        this.scene.bringToTop();
        this.base=this.add.image(1024/2,300+15,"base").setOrigin(0.5,0.5).setDepth(12).setAlpha(1);
        this.continua=this.add.image(1024/2,300-20,"continua").setInteractive().on("pointerdown",()=>{
            this.scene.resume("Level1");
            this.scene.resume("Level2");
            this.scene.resume("Level3");
            this.scene.resume("Boss");
            this.base.setAlpha(0);
            this.continua.setAlpha(0);
            this.esci.setAlpha(0);
            }
        ).setOrigin(0.5,0.5).setDepth(14).setScale(0.3).setAlpha(1);
        this.esci=this.add.image(1024/2,300+70,"esci").setInteractive().on("pointerdown",()=>{
            this.base.setAlpha(0);
            this.continua.setAlpha(0);
            this.esci.setAlpha(0);
            this.scene.setVisible(false,"Overlay");
            this.scene.setVisible(false,"Level1");
            this.scene.setVisible(false,"Level2");
            this.scene.setVisible(false,"Level3");
            this.scene.setVisible(false,"Boss");
            this.scene.start("LevelSelection");
            }
        ).setOrigin(0.5,0.5).setDepth(14).setScale(0.3).setAlpha(1);
    };

    update(time: number, delta: number): void {
    };
}