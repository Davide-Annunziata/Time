import IProj from "./IProj";
//Importiamo la scena di gameplay in modo da potervi accedere
import GamePlay from "../scenes/GamePlay";

export default class Player extends Phaser.GameObjects.Sprite implements IProj {
	private _config: genericConfig;
	//riferimento alla scena dove il nostro game object verrà inserito
	private _scene: GamePlay;
	//variabile locale di tipo arcade.body per poter accedere ai metodi del Body
	// descritti nel capitolo 7
	private _body: Phaser.Physics.Arcade.Body;
	private _animations: Array<{ key: string, frames: Array<number>, frameRate: number, yoyo: boolean, repeat: number }> = [
	{ key: "idle", frames: [0, 1, 2, 3, 4, 5], frameRate: 10, yoyo: false, repeat: -1 },
	{ key: "move", frames: [6,7,8,9,10,11], frameRate: 10, yoyo: false, repeat: -1 }
	];

    private right:boolean;
    private shoot:boolean;
    
    constructor(params: genericConfig,dir:boolean) {  
                super(params.scene, params.x, params.y, params.key);
                this.right=dir;
                this._config = params;
                //richiamiamo il metodo create nel quale sono inserite alcune
                // inizializzazioni della nostra classe custom
                this.create();
                //richiamiamo un metodo locale per implementare le animazioni dello
                // sprite
                this.createAnimations();
            }

	create() {
		//Creiamo un riferimento alla scena in modo da poterlo utilizzare 
		// successivamente per richiamare dei metodi della scena
		this._scene = <GamePlay>this._config.scene;
		//Abilitiamo this ovvero la classe corrente alla fisica di phaser
		this._scene.physics.world.enable(this);
		//Inseriamo in this._body il cast di this.body
		//Lo facciamo perché altrimenti non riusciremmo ad avere accesso
		// ai metodi di body
		this._body = <Phaser.Physics.Arcade.Body>this.body;
		//indichiamo al body che deve collidere con i bounds del world
		this._body.setCollideWorldBounds(true).setImmovable(true);

        if(this.right){
            this._body.allowGravity = false;
            this._body.setVelocityX(300);
        }else{
            this._body.allowGravity = false;
            this._body.setVelocityX(-300);
        }         
		//Settiamo il livello di profondità a 11
		this.setDepth(10).setScale(0.5);
		//Aggiungiamo il Player alla scena
		this._scene.add.existing(this);      
	}
    
    createAnimations() {
		//creazione dell’animazione come visto nei capitoli precedenti
		this._animations.forEach(element => {
		
			if (!this._scene.anims.exists(element.key)) {
				let _animation:Phaser.Types.Animations.Animation={
                    key: element.key,
                    frames: this.anims.generateFrameNumbers("player", { frames: element.frames }),
                    frameRate:element.frameRate,
                    yoyo:element.yoyo,
                    repeat:element.repeat
                }
                this.anims.create(_animation);
			}
		});

	}

    update(time: number, delta: number): void{

    }
}