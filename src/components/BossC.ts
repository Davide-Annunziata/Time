import IBoss from "./IBoss";
//Importiamo la scena di gameplay in modo da potervi accedere
import Level1 from "../scenes/Level1";

export default class BossC extends Phaser.GameObjects.Sprite implements IBoss {
	private _config: genericConfig;
	//riferimento alla scena dove il nostro game object verrà inserito
	private _scene: Level1;
	//variabile locale di tipo arcade.body per poter accedere ai metodi del Body
	// descritti nel capitolo 7
	private _body: Phaser.Physics.Arcade.Body;
	//variabile locale per la gestione dei tasti cursore come visto nel capitolo 6
	public _cursors: Phaser.Types.Input.Keyboard.CursorKeys;
	//variabile locale per impostare la velocità del body

	//array di oggetti per la creazione dell’animazione
	private _animations: Array<{ key: string, frames: Array<number>, frameRate: number, yoyo: boolean, repeat: number }> = [
	{ key: "move", frames: [0,1,2,1], frameRate: 3, yoyo: false, repeat: -1 },
	{ key: "idle", frames: [0], frameRate: 2, yoyo: false, repeat: -1 }
	];
    public life:integer;

    constructor(params: genericConfig) {
            super(params.scene, params.x, params.y+20, params.key);
                this._config = params;
                this.create();
                this.createAnimations();
            }

	create() {
        this.life=100;
		this._scene = <Level1>this._config.scene;

		this._scene.physics.world.enable(this);
		
		this._body = <Phaser.Physics.Arcade.Body>this.body;
        this._body.setImmovable();
	
		
		this._cursors = this._scene.input.keyboard.createCursorKeys();
		this.setDepth(10).setScale(3.5);
		this._body.setSize(25,25).setOffset(0,0);

		this._scene.add.existing(this);
	}
	
	createAnimations() {
		//creazione dell’animazione come visto nei capitoli precedenti
		this._animations.forEach(element => {
		
			if (!this._scene.anims.exists(element.key)) {
				let _animation:Phaser.Types.Animations.Animation={
                    key: element.key,
                    frames: this.anims.generateFrameNumbers("boss-model", { frames: element.frames }),
                    frameRate:element.frameRate,
                    yoyo:element.yoyo,
                    repeat:element.repeat
                }
                this.anims.create(_animation);
				this.anims.play("idle");
			}
		});
	}

	changeDir(x:boolean){
		this.setFlipX(x);
		if(x){
			this._body.setOffset(15,0);
		}else{
			this._body.setOffset(0,0);
		}
	}
    update(time: number, delta: number) {
    }

}
