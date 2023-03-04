import Player from "../components/Player";
import BossC from "../components/BossC";
import Enemy from "../components/Enemy";
import Bonus from "../components/Bonus";
import Bcoin from "../components/Bcoin";
import Overlay from "./Overlay";
import PauseHud from "./PauseHud";

export default class Boss extends Phaser.Scene {
    private mainCam:Phaser.Cameras.Scene2D.Camera;
    private player:Player;
    private music: Phaser.Sound.BaseSound;
    private bossMusic: Phaser.Sound.BaseSound;
    private continua :Phaser.GameObjects.Image;
    private base: Phaser.GameObjects.Image;
    public completed:boolean=false;
  //i due riferimenti alla mappa di tile e al tileset
	private map: Phaser.Tilemaps.Tilemap;
	private tileset: Phaser.Tilemaps.Tileset;
  //in layer viene istanziato il livello di tile visibili
	private layer: Phaser.Tilemaps.TilemapLayer;
  //in layer 2 il livello per la gestione delle collisioni pavimento e piattaforme	
	private layer2: Phaser.Tilemaps.TilemapLayer;
    private keyEsc:any;
    private bg:Phaser.GameObjects.Image;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private groupProj:Phaser.GameObjects.Group;
    private boss:BossC;
    private groupThunder:Phaser.GameObjects.Group;
    private groupFire:Phaser.GameObjects.Group;
    private shot:boolean;
    private win:boolean;
    private triggered:boolean
    private cloud: Phaser.GameObjects.Image;
    private posX:integer;
    private posY:integer;
    private lives:integer;
    private cuori:Phaser.GameObjects.Image;
    private saved:boolean;
    public enemyGroup: Phaser.GameObjects.Group;
    private groupBonus: Phaser.GameObjects.Group;
    private points:integer;
    private x:boolean;
    private keyE:Phaser.Input.Keyboard.Key;

    constructor() {
        super({
        key: "Boss",
        });
    }

    preload() { 
        PauseHud.setLevel(4);     
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.scene.setVisible(true,"Boss");
        this.player= new Player({ scene: this, x: 100, y: 775, key: "player" });
        this.boss=new BossC(({ scene: this, x: 2335, y: 645, key: "player" }));
        this.triggered=false;
        this.posX=100;
        this.posY=775;
        this.lives=3;
        this.points=0;
        this.saved=false;
        this.bg=this.add.image(0, 0,"bg4").setOrigin(0,0).setDepth(0);
        this.groupProj= this.add.group();
        this.physics.add.existing(this.player);
        this.music=this.sound.add("music3",{loop:true,volume:0.4});
        this.bossMusic=this.sound.add("music4",{loop:true,volume:0.4});
        this.music.play();
        this.x=false;
        this.map = this.make.tilemap({ key: "level-4"});
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
        this.cloud=this.physics.add.image(3616,825,"nuvola").setOrigin(0.5,0.5).setDepth(12).setAlpha(0).setImmovable(true).setScale(1.25);
        this.cuori=this.add.image(this.cameras.main.worldView.x+75,this.cameras.main.worldView.y+35,"3cuori").setDepth(20);

        this.physics.world.setBounds(
            0, //x
            0, //y
            this.map.widthInPixels, //width
            this.map.heightInPixels //height
        );
        this.groupThunder = this.add.group();
        this.groupFire=this.add.group();
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
        .setAlpha(0);
            
        this.layer2.setCollisionByProperty({collide: true });

        this.physics.add.collider(this.groupProj,this.boss,(proj: any, boss: any) => {	
            proj.destroy();
            boss.life-=9;
            console.log(this.boss.life);
            },undefined,this
        );
        
        this.physics.add.collider(this.groupProj,this.layer2,(proj: any, _tile: any) => {
            proj.destroy();
            },undefined,this
        )

        this.physics.add.overlap(this.groupProj,this.layer2,(proj: any, _tile: any) => {
            if (_tile.properties.worldBounds == true) {				
                proj.destroy();
            }
            },undefined,this
        )

        this.physics.add.collider(this.groupThunder,this.layer2,(proj: any, _tile: any) => {
            proj.destroy();
            },undefined,this
        );

        this.physics.add.collider(this.groupFire,this.layer2,(proj: any, _tile: any) => {
            proj.destroy();
            },undefined,this
        );

        this.physics.add.overlap(this.groupFire,this.layer2,(proj: any, _tile: any) => {
            if (_tile.properties.worldBounds == true) {				
                proj.destroy();
            }
            },undefined,this
        )
        this.enemyGroup= this.add.group({ runChildUpdate: true });
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

        this.physics.add.collider(this.groupProj,this.enemyGroup,(proj: any, enemy: any) => {
            proj.destroy();
            enemy.destroy();
            },undefined,this
        )
        this.groupBonus = this.add.group({ runChildUpdate: true });
        this.createCollider();
        this.setupObjects();
        
        
        this.time.addEvent({
            delay: 3000, loop: true, callback: () => {
                if(this.boss.life>0&&this.triggered&&this.boss.scene!=undefined){
                    this.thunder();
                    this.thunder();
                    let music=this.sound.add("fireball-sound",{loop:false,volume:1});
                    music.play();
                    this.fireBall();
                    if(this.boss.life<=55&&this.boss.scene!=undefined){
                        this.thunder();
                        this.time.addEvent({
                            delay: 1000, loop: false, callback: () => {
                                this.fireBall();
                                music.play();
                            }, callbackScope: this
                        });
                    }
                } 
                if(this.boss.scene==undefined){
                    this.physics.add.collider(this.player,this.cloud,(obj1: any, obj2: any) => {if(this.player._body.blocked.down){this.player.jmp=true; } },undefined,this);
                }
            }, callbackScope: this
        });

        this.time.addEvent({
            delay: 500, loop: true, callback: () => {
                if(this.player.scene!=undefined&&this.boss.scene!=undefined){
                    this.boss.changeDir(this.player.body.position.x<this.boss.body.position.x);
                }
                if(!this.triggered&&this.player.scene!=undefined&&this.player.body.position.x>1700&&this.boss.scene!=undefined){
                    this.boss.anims.play("move");
                    this.triggered=true;
                    this.music.stop();
                    this.bossMusic.stop();
                }
            }, callbackScope: this
        }); 
        this.scene.launch("Overlay");
    }

    create() {
        console.log("create:Boss");
    }

    createCollider(){
        this.physics.add.collider(this.player, this.enemyGroup,(player: any, enemy: any)=>{    
            if(((this.player._body.position.y+11.3)<(enemy._body.position.y))&&this.player._body.blocked.down){
                enemy.destroy();
            }else{
                this.checkLives();
            }
        }, undefined, this);

        this.physics.add.collider(this.player,this.layer2,(_player: any, _tile: any) => {
            if(this.player._body.blocked.down){
                this.player.jmp=true;
            }
            if (_tile.properties.exit == true&&this.points>=8&&this.player.scene!=undefined&&!this.x) {	
                Overlay.updateScore(this.points,this.lives,false,false);
                console.log("level completed");
                let base=this.add.image(this.cameras.main.worldView.centerX,this.cameras.main.worldView.centerY+15,"youwin").setOrigin(0.5,0.5).setDepth(12);
                this.continua=this.add.image(this.cameras.main.worldView.centerX,this.cameras.main.worldView.centerY+25,"continua").setInteractive().on("pointerdown",()=>{this.bossMusic.pause();
                    this.music.pause();Overlay.updateScore(this.points,this.lives,false,false);this.scene.remove;this.scene.start("Finale");})
                .setOrigin(0.5,0.5)
                .setDepth(9)
                .setScale(0.3)
                .setDepth(98);
            }else if(_tile.properties.exit == true&&this.points<8&&this.player.scene!=undefined&&!this.x){
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
                console.log("saved");
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
                    this.bossMusic.stop();
                }
                this.player.pause=true;
                this.checkLives()
            }
        },undefined,this
        );
            
        this.physics.add.overlap(this.player, this.groupBonus,(player: any, bonus: any)=>{
            let music=this.sound.add("tick",{loop:false,volume:1});
            music.play();
            bonus.destroy();
            this.points+=1
        }, undefined, this);

        this.physics.add.collider(this.groupFire, this.player, (obj1: any, obj2: any) => {
            obj1.destroy();
            this.checkLives();
        }, undefined, this);
        
        this.physics.add.collider(this.groupThunder, this.player, (obj1: any, obj2: any) => {
            obj1.destroy();
            this.checkLives();
        }, undefined, this);
    }

    update(time: number, delta: number): void {    
        if(!this.music.isPlaying&&!this.bossMusic.isPlaying&&!this.triggered&&!this.player.pause){
            this.music.play();   
            this.bossMusic.stop(); 
        }else if(!this.music.isPlaying&&!this.bossMusic.isPlaying&&this.triggered&&!this.player.pause){
            this.triggered=true;
            this.music.stop();
            this.bossMusic.play();        
        }else if(this.triggered&&!this.bossMusic&&!this.player.pause){
            this.music.stop();
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
        if(this.boss.life<=0){
            this.boss.destroy();
            if(!this.win){
                this.createCloud();
            }
            this.win=true;
        }          
        if (this.keyE.isDown) {
            this.createProj();
        }
    }

    createProj(){
        if(this.shot&&this.player.scene!=undefined){
            if(this.player.right){ 
            this.shot=false;
            let proj = this.physics.add.image(this.player.body.position.x+50,this.player.body.position.y+20,"freccia" );
            proj.setOrigin(0).setDepth(9).setScale(0.06).setDepth(10);
            proj.body.allowGravity = false;
            proj.body.setVelocityX(300);
            this.groupProj.add(proj);
            this.time.addEvent({
                delay: 1000, loop: false, callback: () => {
                    if(this.boss.life>0&&!this.shot){
                       this.shot=true;
                    } 
                }, callbackScope: this
            });     
            }else{
                this.shot=false;
                let proj = this.physics.add.image(this.player.body.position.x-10,this.player.body.position.y+20,"freccia");
                proj.setOrigin(1,0).setDepth(9).setScale(0.06).setDepth(10);
                proj.setFlipX(true);
                proj.body.allowGravity = false;
                proj.body.setVelocityX(-300);
                this.groupProj.add(proj);
                this.time.addEvent({
                    delay: 1000, loop: false, callback: () => {
                        if(this.boss.life>0&&!this.shot){
                           this.shot=true;
                        } 
                    }, callbackScope: this
                });     
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

    fireBall(){
        if(this.boss.scene!=undefined){
            let fireBall = this.physics.add.image(this.boss.body.position.x+50,this.boss.body.position.y+20,"fireball").setDepth(10);
            fireBall.setFlipX(true);
            fireBall.setOrigin(0).setDepth(9).setScale(2);
            fireBall.body.setCircle(7, 4, 5)
            fireBall.body.allowGravity=false;
            fireBall.setVelocityX(250);
            this.groupFire.add(fireBall);
    
            let fireBall2 = this.physics.add.image(this.boss.body.position.x-5,this.boss.body.position.y+20,"fireball").setDepth(10);
            fireBall2.setOrigin(1,0).setDepth(9).setScale(2);
            fireBall2.body.setCircle(7, 4, 5)
            fireBall2.body.allowGravity=false;
            fireBall2.setVelocityX(-250);
            this.groupFire.add(fireBall2); 
        }
        
    }

    createCloud(){
        this.cloud.setAlpha(1);
        this.tweens.add({
            targets: this.cloud,
            duration: 4000,
            repeat: 0,
            ease: "Linear",
            y: 544,
            onComplete: () => {
                this.tweens.add({
                    targets: this.cloud,
                    duration: 4000,
                    repeat: 0,
                    ease: "Linear",
                    y: 800,
                    onComplete: () => {
                        this.createCloud();     
                    }
                });
            }    
        });
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
                    this.bossMusic.stop();
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
}