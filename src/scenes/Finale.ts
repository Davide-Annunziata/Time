export default class Finale extends Phaser.Scene {
    private bg:Phaser.GameObjects.Image;
    private img:Phaser.GameObjects.Image;
    private music: Phaser.Sound.BaseSound;
    constructor() {
      super({
        key: "Finale",
      });
    }
  
    preload() {
        this.img=this.add.image(512,300,"clessidra").setScale(1).setDepth(5);
        this.bg=this.add.image(700,300,"bg4").setScale(0.7).setDepth(0);
        this.music=this.sound.add("music1",{loop:true,volume:0.3});
        this.music.play();
        this.time.addEvent({
            delay: 1500, loop: false, callback: () => {
                this.bg=this.add.image(700,300,"bg3").setScale(0.7).setDepth(1);
                this.time.addEvent({
                    delay: 1500, loop: false, callback: () => {
                        this.bg=this.add.image(710,300,"bg2").setScale(0.7).setDepth(2);
                        this.time.addEvent({
                            delay: 1500, loop: false, callback: () => {
                                this.bg=this.add.image(700,300,"bg1").setScale(1).setDepth(3);   
                                this.time.addEvent({
                                    delay: 1500, loop: false, callback: () => {
                                        this.music.pause();
                                        this.scene.start("Intro");
                                    }, callbackScope: this
                                });
                            }, callbackScope: this
                        });   
                    }, callbackScope: this
                });   
            }, callbackScope: this
        });
        
    }
  
   
    create() {
      console.log("create:Finale");
    }
  
    update(){
        this.img.rotation+=0.0088;   
    }
  }
  