export let GameData: any = {
  globals: {
    leaderboard: false,
    gameWidth: 1024,
    gameHeight: 600,
    bgColor: "#ffffff",
    debug: true,
  },

  preloader: {
    bgColor: "",
    image: "phaser",
    imageX: 512,
    imageY: 300,
    loadingText: "",
  },
  spritesheets:  [
    {
    name: "player",
    path: "assets/images/player.png",
    width: 454, 
    height: 669,
    frames: 3
    },{
      name: "tilemap-extruded",
      path: "assets/map/tilemap-extruded.png",
      width: 32,
      height: 32,
      spacing: 2,
      margin: 1,
    },{	
      name: "bonus",
      path: "assets/images/bonus-coin.png",
      width: 64,
      height: 64,
      frames: 8
    },{	
      name: "boss-model",
      path: "assets/images/boss.png",
      width: 36,
      height: 22,
      frames: 3
    },{	
      name: "enemy",
      path: "assets/images/enemy.png",
      width: 12,
      height: 15,
      frames: 7
    }
    
  ]
,
  images: [
    {name:"logo-game", path:"assets/images/GameTitle.png"},
    {name: "bg0", path: "assets/map/sfondo0.jpg" },
    {name: "bg1", path: "assets/map/sfondo1.jpg" },
    {name: "bg2", path: "assets/map/sfondo2.jpg" },
    {name: "bg3", path: "assets/map/sfondo3.jpg" },
    {name: "bg4", path: "assets/map/sfondo4.jpg" },
    { name: "thunder", path: "assets/images/thunder.png" },
    { name: "fireball", path: "assets/images/fireball.png" },
    { name: "base", path: "assets/images/base.png" },
    { name: "continua", path: "assets/images/continua.png" },
    { name: "esci", path: "assets/images/esci.png" },
    { name: "1cuore", path: "assets/images/1cuore.png" },
    { name: "2cuori", path: "assets/images/2cuori.png" },
    { name: "3cuori", path: "assets/images/3cuori.png" },
    { name: "nuvola", path: "assets/images/nuvola.png" }
  ],
  atlas: [],
  sounds: [{
    name: "music0",
    paths: ["assets/sounds/music0.ogg", "assets/sounds/music0.m4a"],
    },{
      name: "music1",
      paths: ["assets/sounds/music1.ogg", "assets/sounds/music1.m4a"],
    },{
      name: "music2",
      paths: ["assets/sounds/music2.ogg", "assets/sounds/music2.m4a"],
    },{
      name: "music3",
      paths: ["assets/sounds/music3.ogg", "assets/sounds/music3.m4a"],
    },
    {
      name: "music4",
      paths: ["assets/sounds/music4.ogg", "assets/sounds/music4.m4a"],
    },{
      name: "tick",
      paths: ["assets/sounds/tick.ogg", "assets/sounds/tick.m4a"],
    },{
      name: "fireball-sound",
      paths: ["assets/sounds/fireball-sound.ogg", "assets/sounds/fireball-sound.m4a"],
    },
  ],
  audio: [],
  bitmapfont: [],
  tilemaps: [
		{
		key: "level-1",
		path: "assets/map/level-1.json",
		},
    {
      key: "level-2",
      path: "assets/map/level-2.json",
    },{
      key: "level-3",
      path: "assets/map/level-3.json",
    },{
      key: "level-4",
      path: "assets/map/level-4.json",
    }
	],
};
