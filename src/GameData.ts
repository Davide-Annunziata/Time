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
    width: 52, 
    height: 68,
    frames: 14
    },{
      name: "tilemap-extruded",
      path: "assets/map/tilemap-extruded.png",
      width: 32,
      height: 32,
      spacing: 2,
      margin: 1,
    }
  ]
,
  images: [
    {name:"logo-game", path:"assets/images/GameTitle.png"},
    {name: "bg1", path: "assets/images/bg/1.png" },
    { name: "bg2", path: "assets/images/bg/2.png" },
    { name: "bg3", path: "assets/images/bg/3.png" },
    { name: "bg4", path: "assets/images/bg/4.png" },
    { name: "bg5", path: "assets/images/bg/5.png" },
    { name: "bg6", path: "assets/images/bg/6.png" },
    { name: "bg7", path: "assets/images/bg/7.png" },
    { name: "skel", path: "assets/images/bg/skel.png" },
    { name: "thunder", path: "assets/images/thunder.png" },
    { name: "rettangolo", path: "assets/images/rettangolo.png" },
    { name: "base", path: "assets/images/base.png" }
  ],
  atlas: [],
  sounds: [
    {name: "music0",
      paths: ["assets/sounds/music0.ogg", "assets/sounds/music0.m4a"],}
  ],
  audio: [],
  bitmapfont: [],
  tilemaps: [
		{
		key: "level-1",
		path: "assets/map/level-1.json",
		}
	],
};
