import React from 'react';
import canUseDOM from '../../components/canUseDOM';
// const Phaser = canUseDOM() ? require('phaser') : null;
const Phaser = null;

export default function SWM() {
  return (
    <div
      style={{ width: 300, height: 200 }}
      ref={(parent) => game(parent)}
    ></div>
  );
}
/* const map = require('./assets/smw.json');
console.log(map); */

function game(parent) {
  if (!Phaser) {
    return <>not a browser or phaser not installed</>;
  }

  return new Phaser.Game({
    parent,
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 200 }
      }
    },
    scene: {
      preload: function () {
        this.load.image('tiles', './assets/tmw_tiles2.png');
        /* this.load.tilemapTiledJSON({
          key: 'map',
          url: 'assets/smw.json'
      }); */
      },
      create: function () {
        var map = this.make.tilemap({ key: 'map' });
        var tiles = map.addTilesetImage('cybernoid', 'tiles');

        var layer = map.createStaticLayer(0, tiles, 0, 0);
        this.cameras.main.setBounds(
          0,
          0,
          map.widthInPixels,
          map.heightInPixels
        );
        // var tiles = map.addTilesetImage('cybernoid', 'tiles');
        // var layer = map.createStaticLayer(0, tiles, 0, 0);
        this.add.image(400, 300, 'sky');

        //this.add.tilemap('level');

        layer = map.createLayer('Tile Layer 1');
        layer.resizeWorld();
      }
    }
  });
}
