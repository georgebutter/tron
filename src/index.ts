import * as Phaser from 'phaser';
import Scenes from 'scenes';

const config: Phaser.Types.Core.GameConfig = {
  title: 'Tron',
  type: Phaser.AUTO,
  scale: {
    width: window.innerWidth,
    height: window.innerHeight,
  },
  scene: Scenes,
  parent: 'game',
  backgroundColor: 0x3F3356,
};

export const game = new Phaser.Game(config);

/**
 * Set the canvas to fill the browser window if the screen size changes.
 */ 
window.addEventListener('resize', () => {
  game.scale.setGameSize(window.innerWidth, window.innerHeight);
});