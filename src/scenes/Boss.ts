import GamePlay from "./GamePlay";
import Player from "../components/Player";
import BossC from "../components/BossC";

export default class Boss extends Phaser.Scene {
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
    public completed:boolean=false;
  //i due riferimenti alla mappa di tile e al tileset
	private map: Phaser.Tilemaps.Tilemap;
	private tileset: Phaser.Tilemaps.Tileset;
  //in layer viene istanziato il livello di tile visibili
	private layer: Phaser.Tilemaps.TilemapLayer;
  //in layer 2 il livello per la gestione delle collisioni pavimento e piattaforme	
	private layer2: Phaser.Tilemaps.TilemapLayer;
    private keyEsc:any;

    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private playing:boolean;
    private groupProj:Phaser.GameObjects.Group;
    private boss:BossC;
    private groupThunder:Phaser.GameObjects.Group;
    private shot:boolean;
    private win:boolean;
    private triggered:boolean
    constructor() {
        super({
        key: "Boss",
        });
    }

    preload() {      
        this.player= new Player({ scene: this, x: 100, y: 500, key: "player" });
        this.boss=new BossC(({ scene: this, x: 500, y: 550, key: "player" }));
        this.triggered=false;
        this.groupProj= this.add.group();
        this.physics.add.existing(this.player);
        this.music=this.sound.add("music4",{loop:true,volume:0.4});
        this.music.play();
        this.playing=false;
        this.map = this.make.tilemap({ key: "level-1"});
        this.keyEsc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.cursors = this.input.keyboard.createCursorKeys();
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
        this.groupThunder = this.add.group();
        this.shot=true;
        this.win=false;
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

        this.physics.add.collider(this.groupProj,this.boss,(proj: any, boss: any) => {	
            proj.destroy();
            boss.life-=5;
            console.log(this.boss.life);
            },undefined,this
        );

        this.physics.add.collider(this.groupThunder, this.layer2, (obj1: any, obj2: any) => {
            obj1.destroy();
        }, undefined, this);

        this.physics.add.collider(this.groupThunder, this.player, (obj1: any, obj2: any) => {
            obj1.destroy();
            this.mainCam.stopFollow();
            obj2.destroy();
            this.player.pause=true;
            this.time.addEvent({
                delay: 1000, loop: true, callback: () => {
                    this.music.destroy();
                    this.scene.restart();
                }, callbackScope: this
            });
        }, undefined, this);

        
        this.physics.add.collider(this.groupProj,this.layer2,(proj: any, _tile: any) => {
                if (_tile.properties.worldBounds == true) {				
                    proj.destroy();
                }
            },undefined,this
        );
        
        this.time.addEvent({
            delay: 3000, loop: true, callback: () => {
                if(this.boss.life>0&&!this.player.pause&&!this.triggered){
                    this.thunder();
                    this.thunder();
                    this.thunder();
                } 
            }, callbackScope: this
        });

        this.time.addEvent({
            delay: 1000, loop: true, callback: () => {
                if(this.boss.life>0&&!this.player.pause&&!this.shot){
                   this.shot=true;
                } 
            }, callbackScope: this
        });

        
    }

    create() {
        console.log("create:Boss");
        this.createHUD();
    }

    update(time: number, delta: number): void {
        this.player.update(time,delta);
        if(this.boss.life<=0){
            this.boss.destroy();
            this.win=true;
        }
        this.jump();
        if(this.keyEsc.isDown&&this.HUD.alpha==0){
            this.createHUD();
            this.player.pause=true;
            this.player.anims.play('idle', true);
            this.HUD.setAlpha(1); 
        }
        if (this.cursors.space.isDown) {
            this.createProj();
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
        this.base=this.add.image(this.cameras.main.worldView.centerX,this.cameras.main.worldView.centerY+15,"base").setOrigin(0.5,0.5).setDepth(8);
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
        .on("pointerdown",()=>{this.scene.remove,this.scene.start("LevelSelection")});
        this.esci=this.add.image(this.cameras.main.worldView.centerX,this.cameras.main.worldView.centerY+80,"rettangolo").setInteractive().on("pointerdown",()=>{console.log(2)}).setOrigin(0.5,0.5).setDepth(9);
        
        this.HUD.add([this.base,this.continua,this.textMenu,this.textContinua,this.textEsci,this.esci]);
        this.HUD.setAlpha(0).setDepth(12);
    }

    createProj(){
        if(this.shot&&this.player.scene!=undefined&&!this.player.pause){
            if(this.player.right){ 
            this.shot=false;
            let proj = this.physics.add.image(this.player.body.position.x+50,this.player.body.position.y+20,"logo-game" );
            proj.setOrigin(0).setDepth(9).setScale(0.1).setDepth(10);
            proj.body.allowGravity = false;
            proj.body.setAccelerationX(300)
            this.groupProj.add(proj);
            }else{
                this.shot=false;
                let proj = this.physics.add.image(this.player.body.position.x-10,this.player.body.position.y+20,"logo-game" );
                proj.setOrigin(1,0).setDepth(9).setScale(0.1).setDepth(10);
                proj.body.allowGravity = false;
                proj.body.setAccelerationX(-300);
                this.groupProj.add(proj);
            }
        }
    }

    
    thunder(){
        let thunder = this.physics.add.image(this.cameras.main.worldView.getRandomPoint().x,this.cameras.main.worldView.top,"thunder").setDepth(10);
        thunder.setOrigin(1,1).setDepth(9);
        thunder.body.allowGravity = false;
        thunder.body.setVelocityY(600);
        this.groupThunder.add(thunder);
    }

}
