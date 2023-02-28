import Level1 from "../scenes/Level1";
import IBonus from "./IBonus";

export default class Bonus extends Phaser.GameObjects.Sprite implements IBonus {
	protected _config: genericConfig;
	protected _scene: Level1;
	protected _body: Phaser.Physics.Arcade.Body;
			
	constructor(params: genericConfig) {
		super(params.scene, params.x, params.y, params.key);
		this._config = params;
		this._scene = <Level1>params.scene;
		this._config.scene.physics.world.enable(this);
		this._body = <Phaser.Physics.Arcade.Body>this.body;
		this._scene.add.existing(this);
		this._body.setImmovable(true);
		this._body.setCircle(27, 8, 9);
		this.setDepth(6);
	}
	create() { }
	update(time: number, delta: number) { }
}
