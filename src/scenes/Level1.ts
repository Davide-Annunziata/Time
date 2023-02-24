
import GamePlay from "./GamePlay";
import Player from "../components/Player";

export default class Level1 extends Phaser.Scene {
    private groupBomb:Phaser.GameObjects.Group;
    private skel:Phaser.GameObjects.Image;

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

    
  //i due riferimenti alla mappa di tile e al tileset
	private map: Phaser.Tilemaps.Tilemap;
	private tileset: Phaser.Tilemaps.Tileset;
  //in layer viene istanziato il livello di tile visibili
	private layer: Phaser.Tilemaps.TilemapLayer;
  //in layer 2 il livello per la gestione delle collisioni pavimento e piattaforme	
	private layer2: Phaser.Tilemaps.TilemapLayer;

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
        this.music=this.sound.add("music0",{loop:true,volume:0.1});
        this.music.play();
        this.groupBomb = this.add.group();
        this.map = this.make.tilemap({ key: "level-1"});

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
	    .setDepth(9)
	    .setAlpha(1);

        this.layer2 = this.map
        .createLayer("collision", this.tileset, 0, 0)
        .setDepth(0)
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

        this.physics.add.collider(this.groupBomb, this.layer2, (obj1: any, obj2: any) => {
            obj1.destroy();
        }, undefined, this);

        this.physics.add.collider(this.groupBomb, this.player, (obj1: any, obj2: any) => {
            obj1.destroy();
            this.mainCam.stopFollow();
            obj2.destroy();
            this.time.addEvent({
                delay: 1000, loop: true, callback: () => {
                    this.scene.restart();
                }, callbackScope: this
            });
        }, undefined, this);

        this.time.addEvent({
            delay: 3000, loop: true, callback: () => {
                this.thunder();
                this.thunder();
                this.thunder();
            }, callbackScope: this
        });
        
    }

    create() {
        console.log("create:Level1");
        this.createHUD();
    }

    thunder(){
        let _bomb = this.physics.add.image(this.cameras.main.worldView.getRandomPoint().x,this.cameras.main.worldView.top,"thunder").setDepth(10);
        _bomb.setOrigin(1,1).setDepth(9);
        _bomb.body.allowGravity = false;
        _bomb.body.setVelocityY(600);
        this.groupBomb.add(_bomb);
    }

    update(time: number, delta: number): void {
        this.player.update(time,delta);
        this.jump();
      
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
        this.player.pause=true;
        this.HUD=this.add.container().setAlpha(1);
        this.base=this.add.image(this.mainCam.centerX,this.mainCam.centerY+30,"base").setOrigin(0.5,0.5).setDepth(8);
        this.textMenu=this.add.bitmapText(this.mainCam.centerX,this.mainCam.centerY-105, "arcade", "Menu", 30)
        .setAlpha(1)
        .setDepth(10)
        .setOrigin(0.5,0.5)
        .setTint(0x0000);
        this.textContinua=this.add.bitmapText(this.mainCam.centerX,this.mainCam.centerY-10, "arcade", "Continua", 28)
        .setAlpha(1)
        .setDepth(10)
        .setOrigin(0.5,0.5)
        .setTint(0x0000)
        .setInteractive()
        .on("pointerdown",()=>{this.HUD.setAlpha(0);this.player.pause=false;console.log(1);});
        this.continua=this.add.image(this.mainCam.centerX,this.mainCam.centerY-10,"rettangolo").setInteractive().on("pointerdown",()=>{this.HUD.setAlpha(0);console.log(1)}).setOrigin(0.5,0.5).setDepth(9);
        this.textEsci=this.add.bitmapText(this.mainCam.centerX,this.mainCam.centerY+90, "arcade", "Esci", 28)
        .setAlpha(1)
        .setDepth(10)
        .setOrigin(0.5,0.5)
        .setTint(0x0000)
        .setInteractive()
        .on("pointerdown",()=>{this.scene.remove,this.scene.start("LevelSelection")});
        this.esci=this.add.image(this.mainCam.centerX,this.mainCam.centerY+80,"rettangolo").setInteractive().on("pointerdown",()=>{console.log(2)}).setOrigin(0.5,0.5).setDepth(9);
        
        this.HUD.add([this.base,this.continua,this.textMenu,this.textContinua,this.textEsci,this.esci]);
    }
}
