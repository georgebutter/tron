import * as Phaser from 'phaser';
import * as GameObjects from 'game-objects';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Title',
};

export class TitleScene extends Phaser.Scene {
  constructor() {
    super(sceneConfig);
  }

  public create() {
    this.onePlayerButton = new GameObjects.Button(this, 100, 100, '1 Player', {
      fill: '#FF647C',
    }, {
      pointerup: () => this.startGame(1),
    });
    this.twoPlayerButton = new GameObjects.Button(this, 100, 150, '2 Players', {
      fill: '#BE52F2',
    }, {
      pointerup: () => this.startGame(2),
    });
    this.threePlayerButton = new GameObjects.Button(this, 100, 200, '3 Players', {
      fill: '#FFA26B',
    }, {
      pointerup: () => this.startGame(3),
    });
    this.fourPlayerButton = new GameObjects.Button(this, 100, 250, '4 Players', {
      fill: '#00C48C',
    }, {
      pointerup: () => this.startGame(3),
    });
    this.add.existing(this.onePlayerButton);
    this.add.existing(this.twoPlayerButton);
    this.add.existing(this.threePlayerButton);
    this.add.existing(this.fourPlayerButton);
  }

  public startGame(players: number) {
    this.scene.start('Game', {
      players,
    });
  }
}

export interface TitleScene {
  onePlayerButton: Phaser.GameObjects.Text;
  twoPlayerButton: Phaser.GameObjects.Text;
  threePlayerButton: Phaser.GameObjects.Text;
  fourPlayerButton: Phaser.GameObjects.Text;
}
