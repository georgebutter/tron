import * as Phaser from 'phaser';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Title',
};

export class TitleScene extends Phaser.Scene {
  constructor() {
    super(sceneConfig);
  }

  public preload() {
    console.log('title scene');
  }
}
