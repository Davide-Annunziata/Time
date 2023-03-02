export default class Overlay extends Phaser.Scene{
    public static points:integer;
    public static lives:integer;
    public static alive:boolean;
    public static paused:boolean;
    private cuori:Phaser.GameObjects.Image;
    private textPoints:Phaser.GameObjects.BitmapText;

    constructor() {
        super({
        key: "Overlay",
        });
    }

    preload() {}
    
    create(){ 
        this.scene.setVisible(true,"Overlay");
        Overlay.lives=3;
        Overlay.points=0;
        Overlay.alive=true;
        Overlay.paused=false;
        console.log("overlay");
        this.cuori=this.add.image(70,30,"1cuore").setDepth(20).setAlpha(1);
         
        this.textPoints=this.add.bitmapText(115,60,"arcade","Frammenti:"+ Overlay.points,18)
        .setAlpha(1) 
        .setTint(0x0000)
        .setOrigin(0.5,0.5)
        .setDepth(20);

        this.scene.bringToTop();
    };

    static updateScore(points:number,lives:number,alive:boolean,paused:boolean){
        Overlay.lives=lives;
        Overlay.points=points;
        Overlay.alive=alive;
        Overlay.paused=paused;
    }

    update(time: number, delta: number): void {
        if(Overlay.paused){
            this.scene.moveBelow("Level1");
            this.scene.moveBelow("Level2");
            this.scene.moveBelow("Level3");
            this.scene.moveBelow("Boss");
        }else{
            this.scene.bringToTop();
        }
        if(!Overlay.alive){
            Overlay.lives=0;
            Overlay.points=0;
            Overlay.alive=true;
            this.cuori.destroy();
            this.textPoints.setAlpha(0);
        }else{
            this.textPoints.setText("Frammenti:"+ Overlay.points);
        this.cuori.destroy();
        if(Overlay.lives==3){
            this.cuori=this.add.image(70,30,"3cuori").setDepth(15);
         }else if(Overlay.lives==2){
            this.cuori=this.add.image(50,30,"2cuori").setDepth(15);
        }else if(Overlay.lives==1){
            this.cuori=this.add.image(30,30,"1cuore").setDepth(15);
        }
        }
  
    };
}