
import GamePlay from "../scenes/GamePlay";
import Bonus from "./Bonus";

export default class Bcoin extends Bonus {
    private _animations: Array<{ key: string, frames: Array<number>, frameRate: number, yoyo: boolean, repeat: number }> = [
        { key: "rotate", frames: [0, 1, 2, 3, 4, 5, 6, 7], frameRate: 10, yoyo: false, repeat: -1 },
    ];

    constructor(params: genericConfig) {
        super(params);
        // settiamo il nome di questo gameObject a coin
        // potrebbe esserci utile per differenziare i tipi di bonus 
        // quando vengono raccolti dal player
        this.setName("coin");
        this.create();
      }

    create() {
        			
        if (!this._scene.anims.exists("rotate")) {
            this._animations.forEach(element => {
		
                if (!this._scene.anims.exists(element.key)) {
                    let _animation:Phaser.Types.Animations.Animation={
                        key: element.key,
                        frames: this.anims.generateFrameNumbers("bonus", { frames: element.frames }),
                        frameRate:element.frameRate,
                        yoyo:element.yoyo,
                        repeat:element.repeat
                    }
                    this.anims.create(_animation);
                }
            });
        }

        this.play("rotate");
        this.setScale(.7);
    }
    
}