import * as Phaser from 'phaser';
import * as GameObjects from 'game-objects';
import { colours } from '../constants'

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'OnlineMenu',
};

export class OnlineMenuScene extends Phaser.Scene {
  constructor() {
    super(sceneConfig);
  }

  public create() {
    const x = 100
    const buttons: Array<{
      y: number
      label: string
      colour: 'pink' | 'purple' | 'orange' | 'green'
    }> = [
      { 
        y: 100,
        label: '1 Player: Left and Right',
        colour: 'pink'
      },
      { 
        y: 150,
        label: '2 Players: C and V',
        colour: 'purple'
      },
      { 
        y: 200,
        label: '3 Players: 1 and 2',
        colour: 'orange'
      },
      { 
        y: 250,
        label: '4 Players: - and +',
        colour: 'green'
      },
    ]
    for (let i = 0; i < buttons.length; i += 1) {
      const { y, label, colour } = buttons[i]
      const button = new GameObjects.Button(this, x, y, label, {
        fill: colours[colour].string,
        fontSize: '25px',
      }, {
        pointerup: () => this.startGame(i),
      });
      this.add.existing(button);
    }
  }

  public startGame(players: number) {
    this.scene.start('Game', {
      players,
    });
  }
}