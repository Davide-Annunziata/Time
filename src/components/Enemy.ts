import IEnemy from "./IEnemy";
//Importiamo la scena di gameplay in modo da potervi accedere
import Level1 from "../scenes/Level1";

export default class Enemy extends Phaser.GameObjects.Sprite implements IEnemy {
	private _config: genericConfig;
	//riferimento alla scena dove il nostro game object verrà inserito
	private _scene: Level1;
	//variabile locale di tipo arcade.body per poter accedere ai metodi del Body
	// descritti nel capitolo 7
	public _body: Phaser.Physics.Arcade.Body;
	//variabile locale per la gestione dei tasti cursore come visto nel capitolo 6
	public _cursors: Phaser.Types.Input.Keyboard.CursorKeys;
	//variabile locale per impostare la velocità del body
	//array di oggetti per la creazione dell’animazione
    private flipped:boolean

	private _animations: Array<{ key: string, frames: Array<number>, frameRate: number, yoyo: boolean, repeat: number }> = [
	{ key: "move", frames: [0,1,2,3,4,5,6], frameRate: 4, yoyo: false, repeat: -1 }
	];

    constructor(params: genericConfig) {
    super(params.scene, params.x, params.y+20, params.key);
        this._config = params;
        this.create();
        this.createAnimations();
    }

	create() {
        this.flipped=false;
		this._scene = <Level1>this._config.scene;

		this._scene.physics.world.enable(this);
		
		this._body = <Phaser.Physics.Arcade.Body>this.body;
        this._body.setImmovable();
		
		this._cursors = this._scene.input.keyboard.createCursorKeys();
        this._body.setAllowGravity(true).setVelocityX(100).setGravityY(30);
	
		this._body.setCollideWorldBounds(true);

		this.setDepth(10).setScale(3.5);
		this._scene.add.existing(this);
	}
	
	createAnimations() {
		//creazione dell’animazione come visto nei capitoli precedenti
		this._animations.forEach(element => {
		
			if (!this._scene.anims.exists(element.key)) {
				let _animation:Phaser.Types.Animations.Animation={
                    key: element.key,
                    frames: this.anims.generateFrameNumbers("enemy", { frames: element.frames }),
                    frameRate:element.frameRate,
                    yoyo:element.yoyo,
                    repeat:element.repeat
                }
                this.anims.create(_animation);
			}
		});
		this.anims.play("move");
	}

    public changeDirection(){
        if(this.flipped){
            this._body.setVelocityX(100);
            this.flipped=false;
            this.setFlipX(false);
        }else{
            this._body.setVelocityX(-100);
            this.flipped=true;
            
        }
    }
    update(time: number, delta: number) {
    }

}