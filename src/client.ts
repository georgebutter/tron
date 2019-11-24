import * as Phaser from 'phaser';
import Scenes from 'scenes';

const config: Phaser.Types.Core.GameConfig = {
  title: 'Phaser Node Boilerplate',
  type: Phaser.AUTO,
  scale: {
    width: window.innerWidth,
    height: window.innerHeight,
  },
  scene: Scenes,
  parent: 'game',
  backgroundColor: 0xffffff,
};

export const game = new Phaser.Game(config);

window.addEventListener('resize', () => {
  game.scale.setGameSize(window.innerWidth, window.innerHeight);
});
