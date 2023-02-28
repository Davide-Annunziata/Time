import Player from "../components/Player";
import BossC from "../components/BossC";

export default class Boss extends Phaser.Scene {
    private mainCam:Phaser.Cameras.Scene2D.Camera;
    private player:Player;
    private music: Phaser.Sound.BaseSound;
    private HUD :Phaser.GameObjects.Container;
    private continua :Phaser.GameObjects.Image;
    private esci: Phaser.GameObjects.Image;
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
    private playing:boolean;
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

    constructor() {
        super({
        key: "Boss",
        });
    }

    preload() {      
        let x=500;
        let y=550;
        this.player= new Player({ scene: this, x: 100, y: 500, key: "player" });
        this.boss=new BossC(({ scene: this, x: x, y: y, key: "player" }));
        this.triggered=false;
        this.posX=this.player._body.position.x+10;
        this.posY=this.player._body.position.y;
        this.lives=3;
        this.saved=false;
        this.bg=this.add.image(0, 0,"bg2").setOrigin(0,0).setDepth(0);
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
        this.cloud=this.physics.add.image(90,655,"nuvola").setOrigin(0.5,0.5).setDepth(12).setAlpha(0).setImmovable(true).setScale(1.25);
        this.cuori=this.add.image(this.cameras.main.worldView.x+75,this.cameras.main.worldView.y+35,"3cuori");

        this.physics.world.setBounds(
            0, //x
            0, //y
            this.map.widthInPixels, //width
            this.map.heightInPixels //height
        );
        this.groupThunder = this.add.group();
        this.groupFire=this.add.group();
        this.shot=false;
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
            boss.life-=50;
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

        this.createCollider();
        this.time.addEvent({
            delay: 3000, loop: true, callback: () => {
                if(this.boss.life>0&&!this.player.pause&&!this.triggered&&this.boss.scene!=undefined){
                    this.thunder();
                    this.thunder();
                    this.fireBall();
                    if(this.boss.life<=55&&this.boss.scene!=undefined){
                        this.thunder();
                        this.time.addEvent({
                            delay: 1000, loop: false, callback: () => {
                                this.fireBall();
                            }, callbackScope: this
                        });
                    }
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

    createCollider(){
        this.physics.add.collider(this.player,this.layer2,(_player: any, _tile: any) => {
            if(this.player._body.blocked.down){
                this.player.jmp=true;
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
               
                console.log("saved");
            }else if(_tile.properties.kill==true){
                this.checkLives()
            }
        },undefined,this
        );
        
    
        this.physics.add.collider(this.groupFire, this.player, (obj1: any, obj2: any) => {
            obj1.destroy();
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
        }, undefined, this);
        
        this.physics.add.collider(this.groupThunder, this.player, (obj1: any, obj2: any) => {
            obj1.destroy();
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
        }, undefined, this);
        
        this.physics.add.collider(this.player,this.cloud,(obj1: any, obj2: any) => {if(this.player._body.blocked.down){this.player.jmp=true; } },undefined,this);
    }
    update(time: number, delta: number): void {
        this.player.update(time,delta);
        if(this.boss.life<=0){
            this.boss.destroy();
            if(!this.win){
                this.createCloud();
            }
            this.win=true;
        }      

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
        this.changeLives();
    }
    
    createHUD(){
        this.HUD=this.add.container().setAlpha(1);
        this.base=this.add.image(this.cameras.main.worldView.centerX,this.cameras.main.worldView.centerY+15,"base").setOrigin(0.5,0.5).setDepth(12);
        this.continua=this.add.image(this.cameras.main.worldView.centerX,this.cameras.main.worldView.centerY-15,"continua").setInteractive().on("pointerdown",()=>{this.HUD.setAlpha(0);console.log(1);this.player.pause=false;}).setOrigin(0.5,0.5).setDepth(9).setScale(0.3);
        this.esci=this.add.image(this.cameras.main.worldView.centerX,this.cameras.main.worldView.centerY+85,"esci").setInteractive().on("pointerdown",()=>{this.music.destroy();this.scene.remove;this.scene.start("LevelSelection")}).setOrigin(0.5,0.5).setDepth(9).setScale(0.3);    
        this.HUD.add([this.base,this.continua,this.esci]);
        this.HUD.setAlpha(0).setDepth(100);
    }

    createProj(){
        if(this.shot&&this.player.scene!=undefined&&!this.player.pause){
            if(this.player.right){ 
            this.shot=false;
            let proj = this.physics.add.image(this.player.body.position.x+50,this.player.body.position.y+20,"logo-game" );
            proj.setOrigin(0).setDepth(9).setScale(0.1).setDepth(10);
            proj.body.allowGravity = false;
            proj.body.setVelocityX(300);
            this.groupProj.add(proj);
            }else{
                this.shot=false;
                let proj = this.physics.add.image(this.player.body.position.x-10,this.player.body.position.y+20,"logo-game" );
                proj.setOrigin(1,0).setDepth(9).setScale(0.1).setDepth(10);
                proj.body.allowGravity = false;
                proj.body.setVelocityX(-300);
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

    fireBall(){
        if(this.boss.scene!=undefined){
            let fireBall = this.physics.add.image(this.boss.body.position.x+50,this.boss.body.position.y+20,"fireball").setDepth(10);
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
            y: 300,
            onComplete: () => {
                this.tweens.add({
                    targets: this.cloud,
                    duration: 4000,
                    repeat: 0,
                    ease: "Linear",
                    y: 655,
                    onComplete: () => {
                        this.createCloud();     
                    }
                });
            }    
        });

        
    }

    changeLives(){
        this.cuori.destroy();
        if(this.lives==3){
            this.cuori=this.add.image(this.cameras.main.worldView.x+75,this.cameras.main.worldView.y+35,"3cuori");
        }else if(this.lives==2){
            this.cuori=this.add.image(this.cameras.main.worldView.x+55,this.cameras.main.worldView.y+35,"2cuori");
        }else if(this.lives==1){
            this.cuori=this.add.image(this.cameras.main.worldView.x+35,this.cameras.main.worldView.y+35,"1cuore");
        }
    }

    checkLives(){
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
}