import Player from "../components/Player";
import Enemy from "../components/Enemy";
import Bonus from "../components/Bonus";
import Bcoin from "../components/Bcoin";
import Overlay from "./Overlay";
import PauseHud from "./PauseHud";

export default class Level3 extends Phaser.Scene {
    private mainCam:Phaser.Cameras.Scene2D.Camera;
    private player:Player;
    private music: Phaser.Sound.BaseSound;
    private jmp:boolean;
    private continua :Phaser.GameObjects.Image;
    private base: Phaser.GameObjects.Image;
    public static completed:boolean;
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
    private posX:integer;
    private posY:integer;
    private lives:integer;
    private saved:boolean;
    public enemyGroup: Phaser.GameObjects.Group;
    private cloud: Phaser.GameObjects.Image;
    private x:boolean;
    private bg:Phaser.GameObjects.Image;
    private grotta:Phaser.GameObjects.Image;

    constructor() {
        super({
        key: "Level3",
        });
    }

    preload() {  
        if(!Level3.completed){
            Level3.completed=true;
        }    
        PauseHud.setLevel(3);
        this.scene.setVisible(true,"Level3");
        this.player= new Player({ scene: this, x:55, y: 580, key: "player" });
        this.posX=55;
        this.posY=580;
        this.lives=3;
        this.saved=false;
        this.physics.add.existing(this.player);
        this.music=this.sound.add("music3",{loop:true,volume:0.3});
        this.music.play();
        this.bg=this.add.image(0, -250,"bg3").setOrigin(0,0).setDepth(2);
        this.grotta=this.add.image(4500, 987,"grotta").setOrigin(1,1).setDepth(4);
        this.map = this.make.tilemap({ key: "level-3"});
        this.keyEsc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.points=0;
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
        this.cloud=this.physics.add.image(648,570,"nuvola").setOrigin(0.5,0.5).setDepth(12).setImmovable(true).setScale(1.25);
        this.createCloud();

        this.tileset = this.map.addTilesetImage("tilemap-extruded");
        this.layer = this.map
	    .createLayer("world", this.tileset, 0, 0)
	    .setDepth(9)
	    .setAlpha(1);

        this.layer2 = this.map
        .createLayer("collision", this.tileset, 0, 0)
        .setDepth(0)
        .setAlpha(0);

        this.layer2.setCollisionByProperty({collide: true });
        
        this.groupBonus = this.add.group({ runChildUpdate: true });
        this.enemyGroup= this.add.group({ runChildUpdate: true });
        this.setupObjects();
        this.x=false;
        this.createCollider();
        this.scene.launch("Overlay");
    }

    create() {
        console.log("create:Level3");  
    }

    createCollider(){
        this.physics.add.collider(this.player,this.layer2,(_player: any, _tile: any) => {
            if(this.player._body.blocked.down){
                this.player.jmp=true;
            }
            if (_tile.properties.exit == true&&this.points>=24 ) {	
                this.player.anims.play('idle', true);
                Overlay.updateScore(this.points,this.lives,false,false);	
                console.log("level completed");
                Level3.completed=true;
                this.player.pause=true;
                let base=this.add.image(this.cameras.main.worldView.centerX,this.cameras.main.worldView.centerY+15,"youwin").setOrigin(0.5,0.5).setDepth(12);
                this.continua=this.add.image(this.cameras.main.worldView.centerX,this.cameras.main.worldView.centerY+25,"continua").setInteractive().on("pointerdown",()=>{Overlay.updateScore(this.points,this.lives,false,false);this.scene.remove;this.scene.start("LevelSelection");this.music.stop();})
                .setOrigin(0.5,0.5)
                .setDepth(9)
                .setScale(0.3)
                .setDepth(98);
            }else if(_tile.properties.exit == true&&this.points<24&&this.player.scene!=undefined&&!this.x){
                console.log("ho bisono di altri frammenti");
                this.x=true;
                let text:Phaser.GameObjects.Text=this.add.text(this.player.body.position.x-90,this.player.body.position.y-35,"ho bisogno di piu frammenti!",{fontSize:"12px"}).setTint(0xFF0000).setDepth(15);;  
                this.time.addEvent({
                    delay: 1000, loop: true, callback: () => {
                        text.destroy(); 
                        this.x=false;
                    }, callbackScope: this
                });   
            }else if(_tile.properties.check==true&&!this.saved){
                this.saved=true;
                this.posX=this.player._body.position.x;
                this.posY=this.player._body.position.y;
                this.time.addEvent({
                    delay: 5000, loop: false, callback: () => {
                        this.saved=false;
                    }, callbackScope: this
                });
               
                console.log("saved");
            }else if(_tile.properties.kill==true){
                if(this.lives<0){
                    this.music.stop();
                }
                this.player.pause=true;
                this.checkLives()
            }
            },undefined,this
        );
        this.physics.add.collider(this.player,this.cloud,(obj1: any, obj2: any) => {if(this.player._body.blocked.down){this.player.jmp=true; } },undefined,this);

        this.physics.add.overlap(this.player, this.groupBonus,(player: any, bonus: any)=>{
            let music=this.sound.add("tick",{loop:false,volume:1});
            music.play();
            bonus.destroy();
            this.points+=1
        }, undefined, this);

        this.physics.add.collider(this.player, this.enemyGroup,(player: any, enemy: any)=>{    
            if(((this.player._body.position.y+11.3)<(enemy._body.position.y))&&this.player._body.blocked.down){
                enemy.destroy();
            }else{
                this.checkLives();
            }
        }, undefined, this);
    }

    update(time: number, delta: number): void {
        if(!this.music.isPlaying&&!this.player.pause){
            this.music.play();        
        }
        this.player.update(time,delta);
        Overlay.updateScore(this.points,this.lives,true,(this.keyEsc.isDown&&this.player.scene!=undefined));
        if(this.keyEsc.isDown&&this.player.scene!=undefined){
            this.player.pause=true;
            this.music.stop()
            this.scene.launch("PauseHud");
            this.scene.pause();
            this.time.addEvent({
                delay: 100, loop: false, callback: () => {
                    this.player.pause=false;                    
                }, callbackScope: this
            });
        }
        if(this.player._body.position.x>3798&&this.player._body.position.y>610){
            this.mainCam.setBounds(
                0, //x
                0, //y
                this.map.widthInPixels, //width
                this.map.heightInPixels //height
            );
        }else if(this.player._body.position.x<3798&&this.player._body.position.y<=610){
            this.mainCam.setBounds(
                0, //x
                -258, //y
                this.map.widthInPixels, //width
                this.map.heightInPixels //height
                );
        }
    }

    checkLives(){
        if(this.lives>=1){
            console.log("morto");
            this.lives--;
            Overlay.updateScore(this.points,this.lives,true,false);
            this.mainCam.stopFollow();
            if(this.player.scene!=undefined){
                this.player.destroy();
            }
            
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
            this.player.destroy();
            this.player.pause=true;
            this.time.addEvent({
                delay: 500, loop: false, callback: () => {
                    Overlay.updateScore(this.points,this.lives,false,false);  
                    this.music.stop()
                    this.scene.restart();
                }, callbackScope: this
            });
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

		let enLayer: Phaser.Tilemaps.ObjectLayer = this.map.getObjectLayer("enemy");
		if (enLayer != null) {
			let _objects: any = enLayer.objects as any[];
			_objects.forEach((tile: Phaser.Tilemaps.Tile) => {

                this.enemyGroup.add(new Enemy({ scene: this,  x: tile.x, y: tile.y, key: "enemy" })); 
			});
		}

        this.physics.add.collider(this.enemyGroup,this.layer2,(enemy: any, _tile: any) => {
            if (_tile.properties.worldBounds == true) {				
                enemy.changeDirection();
            }
            },undefined,this
        )

        this.physics.add.overlap(this.enemyGroup,this.layer2,(enemy: any, _tile: any) => {
            if (_tile.properties.worldBounds == true) {				
                enemy.changeDirection();
            }
            },undefined,this
        )
	}
  
    createCloud(){ 
        this.tweens.add({
            targets: this.cloud,
            duration: 4000,
            repeat: 0,
            ease: "Linear",
            y: 330,
            onComplete: () => {
                this.tweens.add({
                    targets: this.cloud,
                    duration: 4000,
                    repeat: 0,
                    ease: "Linear",
                    y: 570,
                    onComplete: () => {
                        this.createCloud();     
                    }
                });
            }    
        });
    }
}