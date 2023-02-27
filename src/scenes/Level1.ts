
import GamePlay from "./GamePlay";
import Player from "../components/Player";
import Bonus from "../components/Bonus";
import Bcoin from "../components/Bcoin";

export default class Level1 extends Phaser.Scene{
   

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
    private groupBonus: Phaser.GameObjects.Group;
    private points:integer;
    private textPoints:Phaser.GameObjects.BitmapText;
    private posX:integer;
    private posY:integer;
    private lives:integer;
    private cuori:Phaser.GameObjects.Image;
    private saved:boolean;
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
        this.posX=this.player._body.position.x+10;
        this.posY=this.player._body.position.y;
        this.lives=3;
        this.physics.add.existing(this.player);
        this.music=this.sound.add("music1",{loop:true,volume:.3});
        this.music.play();
        this.map = this.make.tilemap({ key: "level-1"});
        this.bg=this.add.image(0, 0,"bg1").setOrigin(0,0).setDepth(0);
        this.keyEsc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.points=0;
        this.textPoints=this.add.bitmapText(this.cameras.main.worldView.x+30,this.cameras.main.worldView.y+50, "arcade", "Punti: "+this.points, 24)
        .setAlpha(1)
        .setDepth(100)
        .setOrigin(0.5,0.5)
        .setTint(0x0000);
        this.cuori=this.add.image(this.cameras.main.worldView.x+75,this.cameras.main.worldView.y+35,"3cuori");
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
        
        this.groupBonus = this.add.group({ runChildUpdate: true });

        this.groupBonus.add(new Bcoin({ scene: this,  x: 200, y: 550, key: "bonus-coin" }));
        this.setupObjects();
        this.createCollider();
    }

    create() {
        console.log("create:Level1");
        this.createHUD();
    }

    createCollider(){
        this.physics.add.collider(this.player,this.layer2,(_player: any, _tile: any) => {
            if(this.player._body.blocked.down){
                this.jmp=true;
            }
            if (_tile.properties.exit == true) {	
                //TODO			
                console.log("level completed");
                this.completed=true;
                this.scene.start("LevelSelection");
            }else if(_tile.properties.check==true&&!this.saved){
                this.saved=true;
                this.posX=this.player._body.position.x;
                this.posY=this.player._body.position.y;
                this.time.addEvent({
                    delay: 5000, loop: false, callback: () => {
                        this.saved=false;
                    }, callbackScope: this
                });
               
                console.log("saved");;
            }else if(_tile.properties.kill==true){
                if(this.lives>1){
                    console.log("morto");
                    this.lives--;
                    this.mainCam.stopFollow();
                    this.player.destroy();
                    this.player.pause=true;
                    
                    this.time.addEvent({
                        delay: 1000, loop: false, callback: () => {
                            this.player= new Player({ scene: this, x:this.posX, y: this.posY, key: "player" });
                            this.createCollider();
                            this.player.setAlpha(1);
                            this.mainCam.startFollow(this.player);
                        }, callbackScope: this
                    });
                }else{
                    this.time.addEvent({
                        delay: 100, loop: false, callback: () => {
                            this.scene.restart();
                        }, callbackScope: this
                    });
                }
            }
        },undefined,this
        );
        this.physics.add.collider(this.player, this.groupBonus,(player: any, bonus: any)=>{
            //let music=this.sound.add("music1",{loop:false,volume:.3});
            //music.play();
            bonus.destroy();
            this.points+=1
        }, undefined, this);
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
        this.changePoint();
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
        this.continua=this.add.image(this.cameras.main.worldView.centerX,this.cameras.main.worldView.centerY-15,"continua").setInteractive().on("pointerdown",()=>{this.HUD.setAlpha(0);console.log(1);this.player.pause=false;}).setOrigin(0.5,0.5).setDepth(9).setScale(0.3);
        this.esci=this.add.image(this.cameras.main.worldView.centerX,this.cameras.main.worldView.centerY+85,"esci").setInteractive().on("pointerdown",()=>{this.music.destroy();this.scene.remove;this.scene.start("LevelSelection")}).setOrigin(0.5,0.5).setDepth(9).setScale(0.3);
        
        this.HUD.add([this.base,this.continua,this.esci]);
        this.HUD.setAlpha(0).setDepth(100);
    }

    changePoint(){
        this.textPoints.destroy();
        this.textPoints=this.add.bitmapText(this.cameras.main.worldView.x+90,this.cameras.main.worldView.y+75, "arcade", "Punti: "+this.points, 18)
        .setAlpha(1)
        .setDepth(100)
        .setOrigin(0.5,0.5)
        .setTint(0x0000);
        this.cuori.destroy();
        if(this.lives==3){
            this.cuori=this.add.image(this.cameras.main.worldView.x+75,this.cameras.main.worldView.y+35,"3cuori");
        }else if(this.lives==2){
            this.cuori=this.add.image(this.cameras.main.worldView.x+55,this.cameras.main.worldView.y+35,"2cuori");
        }else if(this.lives==1){
            this.cuori=this.add.image(this.cameras.main.worldView.x+35,this.cameras.main.worldView.y+35,"1cuore");
        }
    }

    addBonus(bonus: Bonus) {
        this.groupBonus.add(bonus);
    }

    removeBonus(bonus: Bonus) {
        this.groupBonus.remove(bonus, true, true);
    }

    setupObjects(): void {
		//recuperiamo il layer object dalla mappa di TILED
		let _objLayer: Phaser.Tilemaps.ObjectLayer = this.map.getObjectLayer("gameObjects");
		// controlliamo che _objLayer non sia null
		if (_objLayer != null) {
			// recuperiamo gli objects all'interno del layer
			let _objects: any = _objLayer.objects as any[];
			_objects.forEach((tile: Phaser.Tilemaps.Tile) => {
                this.addBonus(new Bcoin({ scene: this,  x: tile.x, y: tile.y, key: "bonus-coin" })); 
			});
		}
	}

    
}
