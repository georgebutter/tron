import * as Phaser from 'phaser';
import * as GameObjects from 'game-objects';
import { colours } from '../constants'
import { Colours } from 'src/types';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Menu',
};

export class MenuScene extends Phaser.Scene {
  constructor() {
    super(sceneConfig);
  }

  public create() {
    const x = 100
    const buttons: Array<{
      y: number
      label: string
      colour: Colours
      action: () => void
    }> = [
      { 
        y: 100,
        label: 'Local',
        colour: 'pink',
        action: () => this.scene.start('LocalMenu')
      },
      { 
        y: 150,
        label: 'Online',
        colour: 'purple',
        action: () => this.scene.start('OnlineMenu')
      },
    ]
    for (let i = 0; i < buttons.length; i += 1) {
      const { y, label, colour, action } = buttons[i]
      const button = new GameObjects.Button(this, x, y, label, {
        fill: colours[colour].string,
        fontSize: '25px',
      }, {
        pointerup: action,
      });
      this.add.existing(button);
    }
  }
}