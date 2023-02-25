
import GamePlay from "./GamePlay";
import Player from "../components/Player";

export default class Level1 extends Phaser.Scene {
   

    private mainCam:Phaser.Cameras.Scene2D.Camera;
    private player:Player;
    private music: Phaser.Sound.BaseSound;
    private jmp:boolean;
    private HUD :Phaser.GameObjects.Container;
    private continua :Phaser.GameObjects.Image;
    private esci: Phaser.GameObjects.Image;
    private base: Phaser.GameObjects.Image;
    private textMenu: Phaser.GameObjects.BitmapText;
    private textContinua: Phaser.GameObjects.BitmapText;
    private textEsci: Phaser.GameObjects.BitmapText;
    public completed:boolean;
    private bg:Phaser.GameObjects.Image;
  //i due riferimenti alla mappa di tile e al tileset
	private map: Phaser.Tilemaps.Tilemap;
	private tileset: Phaser.Tilemaps.Tileset;
  //in layer viene istanziato il livello di tile visibili
	private layer: Phaser.Tilemaps.TilemapLayer;
  //in layer 2 il livello per la gestione delle collisioni pavimento e piattaforme	
	private layer2: Phaser.Tilemaps.TilemapLayer;
    private keyEsc:any;

    constructor() {
        super({
        key: "Level1",
        });
    }

    preload() {      
        if(!this.completed){
            this.completed=false;
        }
        this.player= new Player({ scene: this, x: 100, y: 500, key: "player" });
        this.physics.add.existing(this.player);
        this.music=this.sound.add("music1",{loop:true,volume:.4});
        this.music.play();
        this.map = this.make.tilemap({ key: "level-1"});
        this.bg=this.add.image(0, 0,"bg1").setOrigin(0,0).setDepth(0);
        this.keyEsc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        this.mainCam = this.cameras.main;
        this.mainCam.setBounds(
            0, //x
            0, //y
            this.map.widthInPixels, //width
            this.map.heightInPixels //height
            );
        this.mainCam.startFollow(this.player);
        
    
        this.physics.world.setBounds(
            0, //x
            0, //y
            this.map.widthInPixels, //width
            this.map.heightInPixels //height
        );  
        this.jmp=true;

        this.tileset = this.map.addTilesetImage("tilemap-extruded");
        this.layer = this.map
	    .createLayer("world", this.tileset, 0, 0)
	    .setDepth(3)
	    .setAlpha(1);

        this.layer2 = this.map
        .createLayer("collision", this.tileset, 0, 0)
        .setDepth(1)
        .setAlpha(1);

        this.layer2.setCollisionByProperty({collide: true });
        
        this.physics.add.collider(this.player,this.layer2,(_player: any, _tile: any) => {
            this.jmp=true;
                if (_tile.properties.exit == true) {				
                    console.log("level completed");
                    this.completed=true;
                    this.scene.start("LevelSelection");
                }
            },undefined,this
        );
       
    }

    create() {
        console.log("create:Level1");
        this.createHUD();
    }

    update(time: number, delta: number): void {
        this.player.update(time,delta);
        this.jump();
        if(this.keyEsc.isDown&&this.HUD.alpha==0){
            this.createHUD();
            this.player.pause=true;
            this.player.anims.play('idle', true);
            this.HUD.setAlpha(1);
        }
        if(this.player.pause&&this.player._body.allowGravity==true){                 
            this.player._body.setVelocity(0);                
            this.player._body.setAllowGravity(false);
            this.player._body.allowGravity=false;
        }else if(!this.player.pause&&!this.player._body.allowGravity){
            this.player._body.setAllowGravity(true)
            this.player._body.allowGravity=true;
        }
    }

    jump():void{
        if(this.player.scene!=undefined&&this.jmp&&!this.player.pause){
            if (this.player._cursors.up.isDown) {
                this.jmp=false;
                this.tweens.add({
                    targets: this.player,
                duration: 500,
                repeat: 0,
                ease: "Linear",
                y: this.player.body.position.y-75,
                
                });
            }
        }
    }
    
    createHUD(){
        this.HUD=this.add.container().setAlpha(1);
        this.base=this.add.image(this.cameras.main.worldView.centerX,this.cameras.main.worldView.centerY+15,"base").setOrigin(0.5,0.5).setDepth(12);
        this.textMenu=this.add.bitmapText(this.cameras.main.worldView.centerX,this.cameras.main.worldView.centerY-90, "arcade", "Menu", 30)
        .setAlpha(1)
        .setDepth(10)
        .setOrigin(0.5,0.5)
        .setTint(0x0000);
        this.textContinua=this.add.bitmapText(this.cameras.main.worldView.centerX,this.cameras.main.worldView.centerY-10, "arcade", "Continua", 28)
        .setAlpha(1)
        .setDepth(10)
        .setOrigin(0.5,0.5)
        .setTint(0x0000)
        .setInteractive()
        .on("pointerdown",()=>{this.HUD.setAlpha(0);this.player.pause=false;console.log(1);});
        this.continua=this.add.image(this.cameras.main.worldView.centerX,this.cameras.main.worldView.centerY-10,"rettangolo").setInteractive().on("pointerdown",()=>{this.HUD.setAlpha(0);console.log(1);this.player.pause=false;}).setOrigin(0.5,0.5).setDepth(9);
        this.textEsci=this.add.bitmapText(this.cameras.main.worldView.centerX,this.cameras.main.worldView.centerY+90, "arcade", "Esci", 28)
        .setDepth(10)
        .setOrigin(0.5,0.5)
        .setTint(0x0000)
        .setInteractive()
        .on("pointerdown",()=>{this.scene.remove,this.scene.start("LevelSelection");this.music.destroy()});
  
        this.HUD.add([this.base,this.continua,this.textMenu,this.textContinua,this.textEsci]);
        this.HUD.setAlpha(0).setDepth(100);
    }
}
